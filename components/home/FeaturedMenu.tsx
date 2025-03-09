'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const featuredItems = [
  {
    id: 1,
    name: 'Classic Burger',
    description: 'Juicy beef patty with fresh lettuce, tomatoes, and our special sauce',
    price: 199,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop',
    category: 'Most Popular'
  },
  {
    id: 2,
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomatoes, and basil on our house-made crust',
    price: 299,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&h=400&fit=crop',
    category: 'Chef\'s Special'
  },
  {
    id: 3,
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing',
    price: 159,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=400&fit=crop',
    category: 'Healthy Choice'
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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function FeaturedMenu() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-96 h-96 bg-primary rounded-full blur-3xl -top-48 -left-48 animate-blob" />
        <div className="absolute w-96 h-96 bg-secondary rounded-full blur-3xl top-48 right-48 animate-blob animation-delay-2000" />
        <div className="absolute w-96 h-96 bg-accent rounded-full blur-3xl bottom-48 left-48 animate-blob animation-delay-4000" />
      </div>

      <div className="container relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Featured Menu</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover our chef's specially curated selection of delicious dishes, 
            prepared with the finest ingredients and served with love.
          </p>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuredItems.map((item) => (
            <motion.div 
              key={item.id}
              variants={item}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary/20"
            >
              <div className="relative h-60 overflow-hidden group">
                <div className="absolute top-4 left-4 z-10">
                  <motion.span 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="px-3 py-1 bg-primary text-white text-sm rounded-full"
                  >
                    {item.category}
                  </motion.span>
                </div>
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent opacity-60" />
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{item.name}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <motion.span 
                    whileHover={{ scale: 1.1 }}
                    className="text-2xl font-bold text-primary"
                  >
                    ₹{item.price}
                  </motion.span>
                  <Link 
                    href={`/menu/${item.id}`} 
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors transform hover:scale-105 hover:shadow-lg hover:shadow-primary/50"
                  >
                    Order Now
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <Link 
            href="/menu" 
            className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            View Full Menu
          </Link>
        </motion.div>
      </div>
    </section>
  )
} 