'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Order {
  orderId: string
  items: any[]
  total: number
  customerInfo: {
    name: string
    email: string
    phone: string
  }
  orderDate: string
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
}

export default function AdminDashboard() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  useEffect(() => {
    // Load orders from localStorage
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]')
    setOrders(orderHistory.reverse()) // Show newest first
  }, [])

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => {
      if (order.orderId === orderId) {
        const updatedOrder = { ...order, status: newStatus }
        
        // Send email notification
        sendStatusUpdateEmail(updatedOrder)
        
        return updatedOrder
      }
      return order
    })

    setOrders(updatedOrders)
    localStorage.setItem('orderHistory', JSON.stringify(updatedOrders))
  }

  const sendStatusUpdateEmail = async (order: Order) => {
    try {
      await fetch('/api/email/status-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      })
    } catch (error) {
      console.error('Failed to send email notification:', error)
    }
  }

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(order => order.status === selectedStatus)

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => router.push('/admin/menu')}
          className="btn-secondary"
        >
          Manage Menu
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Status
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="input-field"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready for Pickup</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.orderId} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Order #{order.orderId}</h3>
                <p className="text-gray-600">
                  {new Date(order.orderDate).toLocaleString()}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium mb-2">Customer Details</h4>
                <p>Name: {order.customerInfo.name}</p>
                <p>Email: {order.customerInfo.email}</p>
                <p>Phone: {order.customerInfo.phone}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Order Items</h4>
                {order.items.map((item, index) => (
                  <p key={index}>
                    {item.name} × {item.quantity} - ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                ))}
                <p className="font-bold mt-2">Total: ₹{order.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                <>
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.orderId, 'preparing')}
                      className="btn-primary"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.orderId, 'ready')}
                      className="btn-primary"
                    >
                      Mark as Ready
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.orderId, 'delivered')}
                      className="btn-primary"
                    >
                      Mark as Delivered
                    </button>
                  )}
                  <button
                    onClick={() => updateOrderStatus(order.orderId, 'cancelled')}
                    className="btn-secondary"
                  >
                    Cancel Order
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders found
          </div>
        )}
      </div>
    </div>
  )
} 