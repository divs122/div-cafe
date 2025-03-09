'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface OrderStatus {
  id: string
  status: 'pending' | 'preparing' | 'ready' | 'delivered'
  estimatedTime?: number
}

function OrderStatusContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [status, setStatus] = useState<OrderStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // Simulated API call
        const response = await fetch(`/api/orders/${orderId}/status`)
        const data = await response.json()
        
        if (data.success) {
          setStatus(data.status)
        } else {
          setError('Failed to fetch order status')
        }
      } catch (error) {
        setError('Failed to load order status. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchStatus()
    } else {
      setError('No order ID provided')
      setLoading(false)
    }
  }, [orderId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error || !status) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-4">
            {error || 'Order not found'}
          </div>
          <Link
            href="/orders"
            className="block text-center bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark"
          >
            View All Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Status</h1>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-medium">{status.id}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium capitalize">{status.status}</p>
            </div>
            
            {status.estimatedTime && (
              <div>
                <p className="text-sm text-gray-600">Estimated Time</p>
                <p className="font-medium">{status.estimatedTime} minutes</p>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <Link
              href="/orders"
              className="block text-center bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark"
            >
              View All Orders
            </Link>
            
            <Link
              href="/menu"
              className="block text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
            >
              Order More
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function OrderStatusPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <OrderStatusContent />
    </Suspense>
  )
} 