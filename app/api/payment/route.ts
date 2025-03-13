import { NextRequest, NextResponse } from 'next/server';
import { Xendit } from 'xendit-node';
import { CreateInvoiceRequest, Invoice } from 'xendit-node/invoice/models';

// Initialize Xendit client
const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY || '',
});

const xenditInvoiceClient = xenditClient.Invoice;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, courseId, courseName, customerName, customerEmail } = body;

    // Create a unique external ID
    const externalId = `course-${courseId}-${Date.now()}`;

    const data: CreateInvoiceRequest = {
      amount: amount,
      invoiceDuration: 172800, // 48 hours in seconds
      externalId: externalId,
      description: `Payment for course: ${courseName}`,
      currency: "IDR",
      reminderTime: 1,
      customer: {
        givenNames: customerName,
        email: customerEmail,
      },
      successRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      failureRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed`,
    };

    const response: Invoice = await xenditInvoiceClient.createInvoice({
      data
    });

    return NextResponse.json({ 
      success: true, 
      invoiceUrl: response.invoiceUrl,
      invoiceId: response.id
    });
  } catch (error) {
    console.error('Error creating Xendit invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment invoice' },
      { status: 500 }
    );
  }
}