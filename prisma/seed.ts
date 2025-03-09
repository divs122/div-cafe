import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const mainCourse = await prisma.category.create({
    data: {
      name: 'Main Course',
    },
  })

  const snacks = await prisma.category.create({
    data: {
      name: 'Snacks',
    },
  })

  const beverages = await prisma.category.create({
    data: {
      name: 'Beverages',
    },
  })

  // Create menu items
  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Classic Burger',
        description: 'Juicy beef patty with fresh lettuce, tomatoes, and our special sauce',
        price: 8.99,
        image: '/menu/burger.jpg',
        categoryId: mainCourse.id,
      },
      {
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, tomatoes, and basil on our house-made crust',
        price: 12.99,
        image: '/menu/pizza.jpg',
        categoryId: mainCourse.id,
      },
      {
        name: 'Caesar Salad',
        description: 'Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing',
        price: 7.99,
        image: '/menu/salad.jpg',
        categoryId: mainCourse.id,
      },
      {
        name: 'French Fries',
        description: 'Crispy golden fries served with ketchup',
        price: 3.99,
        image: '/menu/fries.jpg',
        categoryId: snacks.id,
      },
      {
        name: 'Coca Cola',
        description: 'Chilled Coca Cola (300ml)',
        price: 2.49,
        image: '/menu/coke.jpg',
        categoryId: beverages.id,
      },
    ],
  })

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 