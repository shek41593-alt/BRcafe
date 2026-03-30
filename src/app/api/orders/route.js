import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = authToken ? twilio(accountSid, authToken) : null;
const whatsappSender = process.env.TWILIO_WHATSAPP_SENDER || 'whatsapp:+14155238886';
const ownerNumber = process.env.OWNER_WHATSAPP_NUMBER;

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, message, totalAmount, orderType, deliveryAddress, items } = body;

    // 1. Validation
    if (!name || !phone || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Format order details from items if provided, fallback to message
    let orderSummary = message;
    if (items && Array.isArray(items) && items.length > 0) {
      const itemLines = items.map(item => `- ${item.quantity}x ${item.name} (₹${(item.price * item.quantity).toFixed(2)})`).join('\n');
      orderSummary = `Items:\n${itemLines}${message ? `\n\nAdditional Note: ${message}` : ''}`;
    }

    // 3. Save to Database (Prisma)
    const newOrder = await prisma.order.create({
      data: {
        customerName: name,
        customerPhone: phone,
        orderDetails: orderSummary,
        totalAmount: totalAmount || '0.00',
        orderType: orderType || 'PICKUP',
        deliveryAddress: deliveryAddress || null,
        status: 'PENDING'
      }
    });

    // 3. Send WhatsApp Notification via Twilio
    let whatsappSent = false;
    let twilioError = null;

    if (client && ownerNumber) {
      try {
        const orderIcon = orderType === 'DELIVERY' ? '🚚' : '🥡';
        const deliveryInfo = orderType === 'DELIVERY' ? `\n*Delivery Address*: ${deliveryAddress}` : '\n*Type*: Store Pick up';
        
        const formattedMessage = `*New Order from B.R Cafe!* ${orderIcon}\n\n*Name*: ${name}\n*Phone*: ${phone}${deliveryInfo}\n\n*Details*:\n${orderSummary}\n\n*Total*: ₹${totalAmount || '0.00'}`;
        
        // 1. Notify Owner
        await client.messages.create({
          body: formattedMessage,
          from: whatsappSender,
          to: `whatsapp:${ownerNumber.startsWith('+') ? ownerNumber : '+91' + ownerNumber}`
        });

        // 2. Notify Customer (as a courtesy if they've joined sandbox)
        try {
          const customerMessage = `*Hi ${name}!* ☕\nYour order at *B.R Cafe* has been received!\n\n${orderSummary}\n\n*Total*: ₹${totalAmount || '0.00'}\n\nWe will prepare it shortly. Thank you!`;
          await client.messages.create({
            body: customerMessage,
            from: whatsappSender,
            to: `whatsapp:${phone.startsWith('+') ? phone : '+91' + phone.replace(/\s+/g, '')}`
          });
        } catch (custErr) {
          console.warn('Could not send WhatsApp to customer (likely not in sandbox):', custErr.message);
        }

        whatsappSent = true;
      } catch (err) {
        console.error('Twilio Error:', err);
        twilioError = err.message;
      }
    } else {
      console.warn('Twilio client or owner number not configured. Skipping WhatsApp notification.');
    }

    return NextResponse.json({
      success: true,
      order: newOrder,
      whatsappSent,
      notificationError: twilioError
    });

  } catch (error) {
    console.error('FULL Order Submission Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json({ 
      error: 'Failed to process order', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
