'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    // Load cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[]
    setCartItems(cart)
    calculateTotal(cart)
  }, [])

  const calculateTotal = (items: CartItem[]) => {
    const sum = items.reduce((acc: number, item: CartItem) => acc + (item.price * item.quantity), 0)
    setTotal(sum)
  }

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return
    const updatedCart = [...cartItems]
    updatedCart[index].quantity = newQuantity
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    calculateTotal(updatedCart)
  }

  const removeItem = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index)
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    calculateTotal(updatedCart)
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.setItem('cart', '[]')
    setTotal(0)
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <Link href="/menu" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {cartItems.map((item, index) => (
            <div key={index} className="flex items-center gap-4 border-b py-4">
              <div className="w-24 h-24 relative">
                <Image
                  src={item.image || 'https://via.placeholder.com/96'}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">₹{item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(index, item.quantity - 1)}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(index, item.quantity + 1)}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          
          <button
            onClick={clearCart}
            className="mt-4 text-red-500 hover:text-red-700"
          >
            Clear Cart
          </button>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="block w-full bg-primary text-white text-center py-2 rounded mt-4 hover:bg-primary-dark"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
} 