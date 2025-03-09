'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface Order {
  id: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'preparing' | 'ready' | 'delivered'
  createdAt: string
  deliveryDetails: {
    name: string
    hostelRoom: string
    phone: string
    instructions?: string
  }
}

const OrderItemComponent = ({ item, orderId, index }: { item: OrderItem; orderId: string; index: number }) => (
  <div key={`${orderId}-item-${index}`} className="flex items-center gap-4 py-2">
    <div className="w-16 h-16 relative">
      <Image
        src={item.image || 'https://via.placeholder.com/64'}
        alt={item.name}
        fill
        className="object-cover rounded"
      />
    </div>
    <div className="flex-1">
      <p className="font-medium">{item.name}</p>
      <p className="text-sm text-gray-600">
        Quantity: {item.quantity}
      </p>
    </div>
    <div className="text-right">
      <p className="font-medium">₹{item.price * item.quantity}</p>
    </div>
  </div>
);

export default function OrdersPage() {
  const searchParams = useSearchParams()
  const highlightedOrderId = searchParams.get('highlight')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load orders from localStorage first
    const savedOrders = localStorage.getItem('savedOrders')
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders) as Order[]
        setOrders(parsedOrders)
        setLoading(false)
      } catch (error) {
        console.error('Error parsing saved orders:', error)
      }
    }

    // Then try to fetch from API
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders')
        const data = await response.json()
        
        if (data.success) {
          const apiOrders = (data.orders || []) as Order[]
          setOrders(apiOrders)
          // Save to localStorage for offline access
          localStorage.setItem('savedOrders', JSON.stringify(apiOrders))
        } else {
          setError('Failed to fetch orders')
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        setError('Failed to load orders. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'preparing':
        return 'bg-blue-100 text-blue-800'
      case 'ready':
        return 'bg-green-100 text-green-800'
      case 'delivered':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
          {error}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600">No orders yet</h2>
          <p className="text-gray-500 mt-2">Your order history will appear here</p>
          <Link href="/menu" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark">
            Order Now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Orders</h1>
      
      <div className="space-y-6">
        {(orders as Array<Order>).map((order: Order) => (
          <div
            key={order.id}
            className={`bg-white rounded-lg shadow-sm border ${
              highlightedOrderId === order.id ? 'border-primary' : 'border-gray-200'
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="border-t border-b border-gray-100 py-4 my-4">
                {order.items.map((item, index) => (
                  <OrderItemComponent
                    key={`${order.id}-item-${index}`}
                    item={item}
                    orderId={order.id}
                    index={index}
                  />
                ))}
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-600">Delivery to</p>
                  <p className="font-medium">{order.deliveryDetails.name}</p>
                  <p className="text-gray-600">
                    Room {order.deliveryDetails.hostelRoom}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-xl font-bold">₹{order.total}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 