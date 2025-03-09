'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-20 h-20 mx-auto mb-6 text-green-500"
        >
          <CheckCircle className="w-full h-full" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Order Placed Successfully!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Thank you for your order! We've sent a confirmation email with your order details.
          {orderId && <span className="block mt-2 font-medium">Order ID: {orderId}</span>}
        </p>

        <div className="space-y-4">
          <Link 
            href="/orders" 
            className="block w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Track Order
          </Link>
          
          <Link 
            href="/menu"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Order More
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-600 text-sm">
            Your order is being prepared. You'll receive updates about your order status via email.
          </p>
        </div>
      </motion.div>
    </div>
  )
} 