'use client'

import { ClockIcon, ShoppingCartIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const steps = [
  {
    id: 1,
    title: 'Browse & Select',
    description: 'Choose from our delicious menu items and customize your order',
    icon: ShoppingCartIcon,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 2,
    title: 'Easy Payment',
    description: 'Pay conveniently with cash on delivery when your order arrives',
    icon: CheckCircleIcon,
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 3,
    title: 'Quick Delivery',
    description: 'Get your food delivered fresh and hot to your hostel room',
    icon: ClockIcon,
    color: 'from-blue-500 to-cyan-500'
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const item = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Animated lines */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent top-1/4 animate-slide-right" />
        <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-secondary to-transparent top-2/4 animate-slide-left" />
        <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-accent to-transparent top-3/4 animate-slide-right" />
      </div>

      <div className="container relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Ordering your favorite food has never been easier. Follow these simple steps 
            to get delicious meals delivered to your room.
          </p>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <motion.div 
                key={step.id}
                variants={item}
                className="relative group"
              >
                <div 
                  className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-2xl opacity-75 blur-xl group-hover:opacity-100 transition-opacity duration-300`}
                />
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="relative bg-gray-800 rounded-2xl p-8 transition-all duration-300"
                >
                  <motion.div 
                    className="flex justify-center mb-6"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="p-3 bg-gray-700 rounded-xl">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>
                  <motion.h3 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-semibold text-white mb-4 text-center"
                  >
                    {step.title}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-400 text-center"
                  >
                    {step.description}
                  </motion.p>
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 200,
                      delay: 0.2
                    }}
                    className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold"
                  >
                    {step.id}
                  </motion.div>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
} 