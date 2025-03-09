import { NextResponse } from 'next/server'
import { verifyPayment } from '@/utils/phonepe'

export async function POST(request: Request) {
  try {
    const { merchantId, merchantTransactionId, transactionId, amount, code, status } = await request.json()

    // Verify the payment status
    const verificationResult = await verifyPayment(merchantTransactionId)

    if (verificationResult.success && verificationResult.status === 'PAYMENT_SUCCESS') {
      // Here you would typically:
      // 1. Update the order status in your database
      // 2. Send confirmation email/SMS to the customer
      // 3. Update inventory if necessary

      return NextResponse.json({
        success: true,
        message: 'Payment successful',
        data: {
          orderId: merchantTransactionId,
          amount: verificationResult.amount,
          status: 'success'
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Payment failed',
        data: {
          orderId: merchantTransactionId,
          status: 'failed'
        }
      })
    }
  } catch (error) {
    console.error('Payment callback error:', error)
    return NextResponse.json(
      { error: 'Failed to process payment callback' },
      { status: 500 }
    )
  }
} 