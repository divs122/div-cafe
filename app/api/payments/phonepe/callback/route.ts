import { NextResponse } from 'next/server';
import { verifyPhonePePayment } from '@/lib/phonepe';
import { PrismaClient } from '@prisma/client';
import { sendOrderConfirmationEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { merchantTransactionId } = body;

    if (!merchantTransactionId) {
      return NextResponse.json(
        { message: 'Missing transaction ID' },
        { status: 400 }
      );
    }

    // Verify payment status with PhonePe
    const paymentStatus = await verifyPhonePePayment(merchantTransactionId);

    if (!paymentStatus.success) {
      return NextResponse.json(
        { message: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Update order status in database
    const order = await prisma.order.update({
      where: { id: merchantTransactionId },
      data: {
        paymentStatus: 'COMPLETED',
        paymentId: paymentStatus.paymentId,
        status: 'CONFIRMED',
      },
      include: {
        user: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    // Send confirmation email
    await sendOrderConfirmationEmail({
      to: order.user.email,
      orderId: order.id,
      items: order.items.map(item => ({
        name: item.menuItem.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: order.total,
      pickupTime: order.pickupTime,
    });

    return NextResponse.json({
      success: true,
      message: 'Payment successful',
      order: {
        id: order.id,
        status: order.status,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json(
      { message: 'Payment callback processing failed' },
      { status: 500 }
    );
  }
} 