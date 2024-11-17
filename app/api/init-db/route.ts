import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    await initializeDatabase(userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database initialization failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to initialize database' }, { status: 500 });
  }
} 