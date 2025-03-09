import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface EmailData {
  to: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  pickupTime: Date;
}

export async function sendOrderConfirmationEmail(data: EmailData) {
  const { to, orderId, items, total, pickupTime } = data;

  const itemsList = items
    .map(
      (item) =>
        `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(
          2
        )}`
    )
    .join('\n');

  const formattedPickupTime = new Date(pickupTime).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const emailContent = `
    <h1>Order Confirmation</h1>
    <p>Thank you for your order!</p>
    
    <h2>Order Details</h2>
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Pickup Time:</strong> ${formattedPickupTime}</p>
    
    <h3>Items:</h3>
    <pre>${itemsList}</pre>
    
    <p><strong>Total Amount:</strong> ₹${total.toFixed(2)}</p>
    
    <p>Your order has been confirmed and will be ready for pickup at the specified time.</p>
    
    <p>If you have any questions about your order, please contact us.</p>
    
    <p>Thank you for choosing our service!</p>
  `;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: `Order Confirmation - #${orderId}`,
    html: emailContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
}

export async function sendOrderStatusEmail(
  to: string,
  orderId: string,
  status: string
) {
  const statusMessages = {
    PREPARING: 'Your order is being prepared',
    READY: 'Your order is ready for pickup',
    COMPLETED: 'Thank you for picking up your order',
    CANCELLED: 'Your order has been cancelled',
  };

  const message = statusMessages[status as keyof typeof statusMessages] || status;

  const emailContent = `
    <h1>Order Status Update</h1>
    <p>Your order #${orderId} has been updated.</p>
    
    <h2>New Status: ${status}</h2>
    <p>${message}</p>
    
    <p>If you have any questions about your order, please contact us.</p>
  `;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: `Order Status Update - #${orderId}`,
    html: emailContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order status email sent successfully');
  } catch (error) {
    console.error('Error sending order status email:', error);
    throw error;
  }
} 