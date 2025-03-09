import nodemailer from 'nodemailer';

// Configure nodemailer with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Format currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};

// Generate HTML for order items
const generateOrderItemsHtml = (items: any[]) => {
  return items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${formatPrice(item.price)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${formatPrice(item.price * item.quantity)}</td>
    </tr>
  `).join('');
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (
  orderDetails: any,
  recipientEmail: string
) => {
  const { items, totalAmount, deliveryDetails, orderId } = orderDetails;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #FF6B6B; text-align: center;">DIV CAFE - Order Confirmation</h1>
      <p style="text-align: center;">Thank you for ordering from DIV CAFE! Here are your order details:</p>
      
      <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #333;">Order #${orderId}</h2>
        
        <h3 style="color: #666;">Items Ordered:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #FF6B6B; color: white;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: left;">Quantity</th>
              <th style="padding: 10px; text-align: left;">Price</th>
              <th style="padding: 10px; text-align: left;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${generateOrderItemsHtml(items)}
          </tbody>
        </table>
        
        <div style="margin-top: 20px; text-align: right;">
          <strong>Total Amount: ${formatPrice(totalAmount)}</strong>
        </div>
      </div>
      
      <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px;">
        <h3 style="color: #666;">Delivery Details:</h3>
        <p><strong>Name:</strong> ${deliveryDetails.name}</p>
        <p><strong>Phone:</strong> ${deliveryDetails.phone}</p>
        <p><strong>Room Number:</strong> ${deliveryDetails.roomNumber}</p>
        <p><strong>Additional Instructions:</strong> ${deliveryDetails.instructions || 'None'}</p>
      </div>
      
      <p style="text-align: center; margin-top: 20px; color: #666;">
        You can track your order status in the Orders section of our website.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `Order Confirmation #${orderId}`,
      html: emailHtml,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}; 