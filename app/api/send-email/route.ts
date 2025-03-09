import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/utils/email';

export async function POST(request: Request) {
  try {
    const { orderDetails, email } = await request.json();

    if (!orderDetails || !email) {
      return NextResponse.json(
        { error: 'Order details and email are required' },
        { status: 400 }
      );
    }

    const result = await sendOrderConfirmationEmail(orderDetails, email);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 