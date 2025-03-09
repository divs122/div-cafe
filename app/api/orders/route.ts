import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { Order } from '@/types/order'

interface OrderItem {
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
  instructions?: string
}

// In-memory store for orders (replace with your database)
let orders: Order[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.items || !body.total || !body.deliveryDetails) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new order
    const orderId = uuidv4()
    const newOrder: Order = {
      id: orderId,
      items: body.items,
      total: body.total,
      deliveryDetails: body.deliveryDetails,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    // Add to in-memory store
    orders.unshift(newOrder)

    return NextResponse.json({
      success: true,
      orderId: orderId,
      message: 'Order created successfully'
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      orders: orders 
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
} 