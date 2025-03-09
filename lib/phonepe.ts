import crypto from 'crypto';

const PHONEPE_API_URL = process.env.PHONEPE_ENV === 'PROD'
  ? 'https://api.phonepe.com/apis/hermes'
  : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

interface PaymentPayload {
  merchantId: string;
  merchantTransactionId: string;
  merchantUserId: string;
  amount: number;
  redirectUrl: string;
  redirectMode: string;
  callbackUrl: string;
  mobileNumber: string;
  paymentInstrument: {
    type: string;
  };
}

export const initializePhonePePayment = async (
  amount: number,
  orderId: string,
  userId: string,
  mobileNumber: string
) => {
  try {
    const merchantId = process.env.PHONEPE_MERCHANT_ID!;
    const saltKey = process.env.PHONEPE_SALT_KEY!;
    const saltIndex = process.env.PHONEPE_SALT_INDEX!;
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/phonepe/callback`;
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/order/status`;

    const payload: PaymentPayload = {
      merchantId: merchantId,
      merchantTransactionId: orderId,
      merchantUserId: userId,
      amount: amount * 100, // Convert to paise
      redirectUrl: redirectUrl,
      redirectMode: 'POST',
      callbackUrl: callbackUrl,
      mobileNumber: mobileNumber,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    
    // Generate checksum
    const string = `${base64Payload}/pg/v1/pay${saltKey}`;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = `${sha256}###${saltIndex}`;

    // Make request to PhonePe
    const response = await fetch(`${PHONEPE_API_URL}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
      },
      body: JSON.stringify({
        request: base64Payload
      })
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        redirectUrl: data.data.instrumentResponse.redirectInfo.url
      };
    } else {
      throw new Error(data.message || 'Payment initialization failed');
    }
  } catch (error) {
    console.error('PhonePe payment error:', error);
    throw error;
  }
};

export const verifyPhonePePayment = async (
  merchantTransactionId: string,
  merchantId = process.env.PHONEPE_MERCHANT_ID!
) => {
  try {
    const saltKey = process.env.PHONEPE_SALT_KEY!;
    const saltIndex = process.env.PHONEPE_SALT_INDEX!;

    // Generate checksum
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}${saltKey}`;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = `${sha256}###${saltIndex}`;

    // Make request to PhonePe
    const response = await fetch(
      `${PHONEPE_API_URL}/pg/v1/status/${merchantId}/${merchantTransactionId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': merchantId,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        status: data.code,
        paymentId: data.data.transactionId,
        amount: data.data.amount / 100, // Convert from paise to rupees
      };
    } else {
      throw new Error(data.message || 'Payment verification failed');
    }
  } catch (error) {
    console.error('PhonePe verification error:', error);
    throw error;
  }
}; 