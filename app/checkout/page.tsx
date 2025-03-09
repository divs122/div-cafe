'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface DeliveryDetails {
  name: string
  hostelRoom: string
  phone: string
  instructions: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    name: '',
    hostelRoom: '',
    phone: '',
    instructions: ''
  })
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    roomNumber: '',
    instructions: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[]
    if (cart.length === 0) {
      router.push('/cart')
      return
    }
    setCartItems(cart)
    const sum = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    setTotal(sum)
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null) // Clear any previous errors

    try {
      // Create order
      const orderData = {
        items: cartItems,
        totalAmount: total,
        deliveryDetails: formData,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }

      console.log('Submitting order:', orderData) // Debug log

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create order')
      }

      const orderResult = await orderResponse.json()
      console.log('Order result:', orderResult) // Debug log

      if (orderResult.success) {
        // Create the complete order object
        const completeOrder = {
          ...orderData,
          id: orderResult.orderId,
          total: total,
          items: cartItems,
        }

        // Save to localStorage
        const savedOrders = JSON.parse(localStorage.getItem('savedOrders') || '[]')
        savedOrders.unshift(completeOrder) // Add new order at the beginning
        localStorage.setItem('savedOrders', JSON.stringify(savedOrders))

        // Send confirmation email
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderDetails: completeOrder,
            email: formData.email,
          }),
        })

        if (!emailResponse.ok) {
          console.error('Failed to send confirmation email')
        }

        // Clear cart and redirect
        localStorage.removeItem('cart')
        window.dispatchEvent(new Event('storage'))
        router.push(`/order-success?orderId=${orderResult.orderId}`)
      } else {
        throw new Error(orderResult.error || 'Failed to place order')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      setError(error instanceof Error ? error.message : 'Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
                Hostel Room Number
              </label>
              <input
                type="text"
                id="roomNumber"
                name="roomNumber"
                required
                value={formData.roomNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                Special Instructions (Optional)
              </label>
              <textarea
                id="instructions"
                name="instructions"
                rows={3}
                value={formData.instructions}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-medium">Cash on Delivery</p>
                <p className="text-sm text-gray-600">Pay when your order arrives</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-dark disabled:opacity-50 transition-all duration-200 relative"
            >
              {isSubmitting ? (
                <>
                  <span className="opacity-0">Place Order</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </>
              ) : (
                'Place Order'
              )}
            </button>

            {isSubmitting && (
              <p className="text-sm text-gray-500 text-center mt-2">
                Processing your order, please wait...
              </p>
            )}
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4 py-4 border-b">
                <div className="w-16 h-16 relative">
                  <Image
                    src={item.image || 'https://via.placeholder.com/64'}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 