import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(req) {
  try {
    const { type, page, metadata } = await req.json();

    if (!type || !page) {
      return NextResponse.json({ error: 'Missing type or page' }, { status: 400 });
    }

    const event = await prisma.analyticsEvent.create({
      data: {
        type,
        page,
        metadata: metadata || {},
      },
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Analytics Error:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
