'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface OrderStatus {
  id: string
  status: string
  paymentStatus: string
}

export default function OrderStatus() {
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<OrderStatus | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const merchantTransactionId = searchParams.get('merchantTransactionId')
    
    if (!merchantTransactionId) {
      setError('Order ID not found')
      setIsLoading(false)
      return
    }

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/orders/${merchantTransactionId}`)
        if (!response.ok) throw new Error('Failed to fetch order status')
        
        const data = await response.json()
        setOrder(data.order)
      } catch (error) {
        console.error('Status check error:', error)
        setError('Failed to fetch order status')
      } finally {
        setIsLoading(false)
      }
    }

    checkStatus()
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Checking order status...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-500 mb-6">{error}</p>
          <Link href="/menu" className="btn-primary">
            Return to Menu
          </Link>
        </div>
      </div>
    )
  }

  const getStatusMessage = () => {
    if (order.paymentStatus !== 'COMPLETED') {
      return {
        title: 'Payment Failed',
        message: 'Your payment was not successful. Please try again.',
        color: 'text-red-500',
      }
    }

    switch (order.status) {
      case 'CONFIRMED':
        return {
          title: 'Order Confirmed',
          message: 'Your order has been confirmed and will be prepared soon.',
          color: 'text-green-500',
        }
      case 'PREPARING':
        return {
          title: 'Preparing Order',
          message: 'Your order is being prepared.',
          color: 'text-blue-500',
        }
      case 'READY':
        return {
          title: 'Ready for Pickup',
          message: 'Your order is ready for pickup!',
          color: 'text-green-500',
        }
      case 'COMPLETED':
        return {
          title: 'Order Completed',
          message: 'Thank you for your order!',
          color: 'text-green-500',
        }
      case 'CANCELLED':
        return {
          title: 'Order Cancelled',
          message: 'Your order has been cancelled.',
          color: 'text-red-500',
        }
      default:
        return {
          title: 'Order Status',
          message: order.status,
          color: 'text-gray-500',
        }
    }
  }

  const status = getStatusMessage()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className={`text-2xl font-bold mb-4 ${status.color}`}>
          {status.title}
        </h1>
        <p className="text-gray-600 mb-6">{status.message}</p>
        
        <div className="mb-8">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="font-medium">{order.id}</p>
        </div>

        <div className="flex justify-center">
          <Link href="/menu" className="btn-primary">
            Place Another Order
          </Link>
        </div>
      </div>
    </div>
  )
} 