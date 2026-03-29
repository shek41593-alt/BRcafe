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
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch store info' }, { status: 500 });
  }
}
