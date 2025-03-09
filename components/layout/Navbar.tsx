'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Coffee } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Navbar() {
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Update cart count whenever localStorage changes
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
      setCartCount(count)
    }

    updateCartCount()
    window.addEventListener('storage', updateCartCount)
    
    return () => {
      window.removeEventListener('storage', updateCartCount)
    }
  }, [])

  const isActive = (path: string) => {
    return pathname === path ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Home */}
          <Link href="/" className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center bg-gradient-to-br from-primary to-primary/80 p-2 rounded-xl shadow-lg shadow-primary/20"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
              >
                <Coffee className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                DIV CAFE
              </span>
              <span className="text-xs text-gray-500 -mt-1">Fresh & Quick</span>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-4">
            <Link
              href="/menu"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/menu')}`}
            >
              Menu
            </Link>
            <Link
              href="/orders"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/orders')}`}
            >
              My Orders
            </Link>
            <Link
              href="/cart"
              className={`px-3 py-2 rounded-md text-sm font-medium relative ${isActive('/cart')}`}
            >
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/admin"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/admin')}`}
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-primary focus:outline-none focus:text-primary"
              onClick={() => document.getElementById('mobile-menu')?.classList.toggle('hidden')}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="hidden md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/menu"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/menu')}`}
            >
              Menu
            </Link>
            <Link
              href="/orders"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/orders')}`}
            >
              My Orders
            </Link>
            <Link
              href="/cart"
              className={`block px-3 py-2 rounded-md text-base font-medium relative ${isActive('/cart')}`}
            >
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
            <Link
              href="/admin"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin')}`}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 