import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { initializePhonePePayment } from '@/lib/phonepe';
import { PrismaClient } from '@prisma/client';
import { initiatePayment } from '@/utils/phonepe';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { amount, mobileNumber, orderId } = await request.json();

    if (!amount || !mobileNumber || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await initiatePayment(amount, mobileNumber, orderId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
} 