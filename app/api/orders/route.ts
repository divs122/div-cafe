import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// In-memory store for orders (replace with your database)
let orders: any[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.items || !body.totalAmount || !body.deliveryDetails) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new order
    const orderId = uuidv4()
    const newOrder = {
      id: orderId,
      ...body,
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