import crypto from 'crypto'

interface PaymentInitiateRequest {
  merchantId: string
  merchantTransactionId: string
  amount: number
  callbackUrl: string
  mobileNumber: string
  deviceContext: {
    merchantId: string
    terminalId: string
    merchantName?: string
    merchantLocation?: string
  }
}

const PHONEPE_API_URL = process.env.PHONEPE_API_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox'
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID as string
const SALT_KEY = process.env.PHONEPE_SALT_KEY as string
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1'

export const generateTransactionId = () => {
  return `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

export const generateChecksum = (payload: string, saltKey: string) => {
  const data = payload + '/pg/v1/pay' + saltKey
  return crypto.createHash('sha256').update(data).digest('hex') + '###' + SALT_INDEX
}

export const initiatePayment = async (amount: number, mobileNumber: string, orderId: string) => {
  try {
    const merchantTransactionId = generateTransactionId()
    const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/callback`

    const payload: PaymentInitiateRequest = {
      merchantId: MERCHANT_ID,
      merchantTransactionId,
      amount: amount * 100, // Convert to paise
      callbackUrl,
      mobileNumber,
      deviceContext: {
        merchantId: MERCHANT_ID,
        terminalId: 'TERM_001',
        merchantName: 'Hostel Restaurant',
        merchantLocation: 'Test Location'
      }
    }

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64')
    const checksum = generateChecksum(base64Payload, SALT_KEY)

    const response = await fetch(`${PHONEPE_API_URL}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum
      },
      body: JSON.stringify({
        request: base64Payload
      })
    })

    const data = await response.json()
    console.log('PhonePe API Response:', data) // For debugging

    if (data.success) {
      return {
        success: true,
        redirectUrl: data.data.instrumentResponse.redirectInfo.url,
        transactionId: merchantTransactionId
      }
    } else {
      throw new Error(data.message || 'Payment initiation failed')
    }
  } catch (error) {
    console.error('PhonePe payment initiation error:', error)
    throw error
  }
}

export const verifyPayment = async (transactionId: string) => {
  try {
    const payload = `/pg/v1/status/${MERCHANT_ID}/${transactionId}`
    const checksum = generateChecksum(payload, SALT_KEY)

    const response = await fetch(`${PHONEPE_API_URL}${payload}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': MERCHANT_ID
      }
    })

    const data = await response.json()
    console.log('PhonePe Verification Response:', data) // For debugging

    if (data.success) {
      return {
        success: true,
        status: data.data.paymentInstrument.status,
        amount: data.data.paymentInstrument.amount / 100 // Convert from paise to rupees
      }
    } else {
      throw new Error(data.message || 'Payment verification failed')
    }
  } catch (error) {
    console.error('PhonePe payment verification error:', error)
    throw error
  }
} 