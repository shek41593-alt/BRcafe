import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getStoreStatus } from '../../../lib/timing';

export async function GET() {
  try {
    const store = await prisma.storeLocation.findFirst({
      include: {
        regularHours: true,
        holidayHours: true
      }
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const status = getStoreStatus(store);
    
    return NextResponse.json({
      ...store,
      status
    });
  } catch (error) {
    console.error('API Error (Store Info):', error.message);
    // Return a default store object if DB is down
    return NextResponse.json({ 
      name: "B.R Cafe",
      status: { isOpen: false, message: 'Service temporarily unavailable' }
    });
  }
}
