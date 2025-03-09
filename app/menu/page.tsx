'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { ShoppingCart, Loader2 } from 'lucide-react'

const menuItems = [
  // Burgers
  {
    id: 1,
    name: 'Classic Burger',
    description: 'Juicy beef patty with fresh lettuce, tomatoes, and our special sauce',
    price: 199,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop',
  },
  {
    id: 2,
    name: 'Chicken Burger',
    description: 'Grilled chicken patty with mayo, lettuce, and cheese',
    price: 179,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1525164286253-04e68b9d94c6?w=500&h=400&fit=crop',
  },
  {
    id: 3,
    name: 'Veggie Burger',
    description: 'Plant-based patty with fresh vegetables and vegan mayo',
    price: 159,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&h=400&fit=crop',
  },

  // Pizza
  {
    id: 4,
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomatoes, and basil on our house-made crust',
    price: 299,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&h=400&fit=crop',
  },
  {
    id: 5,
    name: 'Pepperoni Pizza',
    description: 'Classic pepperoni with mozzarella and our signature sauce',
    price: 349,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=400&fit=crop',
  },
  {
    id: 6,
    name: 'Vegetarian Pizza',
    description: 'Assorted vegetables with cheese and olive oil',
    price: 279,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&h=400&fit=crop',
  },

  // Main Course
  {
    id: 7,
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice cooked with tender chicken and special spices',
    price: 249,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=400&fit=crop',
  },
  {
    id: 8,
    name: 'Butter Chicken',
    description: 'Tender chicken in rich tomato-based curry with butter and cream',
    price: 299,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=400&fit=crop',
  },
  {
    id: 9,
    name: 'Paneer Tikka Masala',
    description: 'Grilled cottage cheese in spiced tomato gravy',
    price: 249,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=400&fit=crop',
  },

  // Salads
  {
    id: 10,
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing',
    price: 149,
    category: 'Salads',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=400&fit=crop',
  },
  {
    id: 11,
    name: 'Greek Salad',
    description: 'Fresh vegetables, olives, and feta cheese with olive oil dressing',
    price: 169,
    category: 'Salads',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=400&fit=crop',
  },

  // Desserts
  {
    id: 12,
    name: 'Chocolate Brownie',
    description: 'Rich chocolate brownie served with vanilla ice cream',
    price: 149,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500&h=400&fit=crop',
  },
  {
    id: 13,
    name: 'Gulab Jamun',
    description: 'Traditional Indian sweet served warm',
    price: 99,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1601303516361-190e3cc24ee3?w=500&h=400&fit=crop',
  },
  {
    id: 14,
    name: 'Ice Cream Sundae',
    description: 'Assorted ice cream with nuts, chocolate sauce, and cherry',
    price: 179,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=400&fit=crop',
  },

  // Beverages
  {
    id: 15,
    name: 'Fresh Lime Soda',
    description: 'Refreshing lime soda with mint leaves',
    price: 79,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&h=400&fit=crop',
  },
  {
    id: 16,
    name: 'Mango Lassi',
    description: 'Thick mango yogurt smoothie',
    price: 99,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1571006682235-47091c9c0d42?w=500&h=400&fit=crop',
  },
]

export default function MenuPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({})

  const addToCart = (item: typeof menuItems[0]) => {
    setLoadingStates(prev => ({ ...prev, [item.id]: true }))
    
    setTimeout(() => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingItem = cart.find((i: any) => i.id === item.id)

      if (existingItem) {
        existingItem.quantity += 1
        toast.success(`Added another ${item.name} to cart!`)
      } else {
        cart.push({ ...item, quantity: 1 })
        toast.success(`${item.name} added to cart!`)
      }

      localStorage.setItem('cart', JSON.stringify(cart))
      window.dispatchEvent(new Event('storage'))
      setLoadingStates(prev => ({ ...prev, [item.id]: false }))
    }, 500)
  }

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category)))]

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold mb-2 text-gray-800 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
        >
          Our Menu
        </motion.h1>
        <motion.p 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 text-center mb-8"
        >
          Discover our delicious selection of freshly prepared dishes
        </motion.p>

        {/* Category Filter - Enhanced for mobile */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 mb-8 overflow-x-auto pb-4 px-4 -mx-4 md:mx-0 md:px-0 md:justify-center scrollbar-hide"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all font-medium min-w-[100px] ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/30'
                  : 'bg-white hover:bg-gray-50 text-gray-700 shadow-md hover:shadow-lg'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onError={(e: any) => {
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-sm line-clamp-2">{item.description}</p>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-xl md:text-2xl font-bold text-primary">₹{item.price}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(item)}
                    disabled={loadingStates[item.id]}
                    className="bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {loadingStates[item.id] ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <ShoppingCart size={18} />
                    )}
                    <span className="hidden sm:inline">Add to Cart</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
} 