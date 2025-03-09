import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function POST(request: Request) {
  try {
    const order = await request.json()

    const statusMessages = {
      preparing: 'Your order is now being prepared',
      ready: 'Your order is ready for pickup',
      delivered: 'Your order has been delivered',
      cancelled: 'Your order has been cancelled',
    }

    const message = statusMessages[order.status as keyof typeof statusMessages]
    if (!message) return

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: order.customerInfo.email,
      subject: `Order #${order.orderId} Status Update`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Order Status Update</h2>
          <p>Dear ${order.customerInfo.name},</p>
          <p>${message}</p>
          
          <div style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
            <h3 style="margin-top: 0;">Order Details</h3>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
            <p><strong>Total Amount:</strong> ₹${order.total.toFixed(2)}</p>
          </div>

          <h3>Order Items:</h3>
          <ul style="list-style: none; padding: 0;">
            ${order.items.map((item: any) => `
              <li style="margin-bottom: 10px;">
                ${item.name} × ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}
              </li>
            `).join('')}
          </ul>

          <p>If you have any questions, please contact us.</p>
          <p>Thank you for choosing our service!</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email sending failed:', error)
    return NextResponse.json(
      { error: 'Failed to send email notification' },
      { status: 500 }
    )
  }
} 