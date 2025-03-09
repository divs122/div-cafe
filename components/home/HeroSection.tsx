'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop"
          alt="Delicious food spread"
          fill
          className="object-cover brightness-[0.35] scale-110 animate-ken-burns"
          priority
          sizes="100vw"
        />
      </div>
      
      <div className="container relative z-10 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-6xl font-bold mb-6 text-white leading-tight">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="block"
            >
              Delicious Food,
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="block"
            >
              <span className="text-primary animate-pulse">Prepared</span> Before You Reach
            </motion.span>
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-xl mb-12 text-gray-200 leading-relaxed"
          >
            Skip the cafeteria lines! Order your favorite meals from DIV CAFE and enjoy 
            the convenience of quick food takeaway. Fresh, hot, and right on time.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex justify-center"
          >
            <Link 
              href="/menu" 
              className="btn-primary text-lg px-12 py-3 rounded-full hover:scale-105 transform transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 animate-bounce-subtle"
            >
              Order Now
            </Link>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
        >
          {[
            {
              icon: '🕒',
              title: 'Fresh & Hot',
              description: 'Enjoy your meal fresh and hot, every time',
              delay: 1.8
            },
            {
              icon: '💳',
              title: 'Easy Payment',
              description: 'Pay securely with online payment authentication',
              delay: 2.0
            },
            {
              icon: '🍽️',
              title: 'Skip the Wait',
              description: 'Pre-order your food and pick it up without waiting',
              delay: 2.2
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: feature.delay, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-opacity-20 transition-all duration-300 group"
            >
              <motion.div 
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-4xl mb-4"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-200 group-hover:text-white transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute w-4 h-4 bg-primary rounded-full animate-float-slow top-1/4 left-1/4" />
        <div className="absolute w-3 h-3 bg-secondary rounded-full animate-float-medium top-1/3 right-1/4" />
        <div className="absolute w-2 h-2 bg-white rounded-full animate-float-fast top-2/3 left-1/3" />
      </div>
    </section>
  )
} 