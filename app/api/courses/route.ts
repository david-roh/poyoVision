import { NextResponse } from 'next/server';
import { db, initializeDatabase } from '@/lib/db/index';
import { courses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Initialize database first
    await initializeDatabase(userId);

    const userCourses = await db
      .select()
      .from(courses)
      .where(eq(courses.userId, userId));

    return NextResponse.json({ courses: userCourses });
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, userId } = body;

    if (!userId || !name) {
      return NextResponse.json(
        { error: 'User ID and course name are required' },
        { status: 400 }
      );
    }

    // Initialize database first
    await initializeDatabase(userId);

    const now = new Date().toISOString();
    await db
      .insert(courses)
      .values({
        id: crypto.randomUUID(),
        userId,
        name,
        description: description || '',
        createdAt: now,
        updatedAt: now,
        status: 'active',
        lastAccessed: now
      });

    return NextResponse.json({ success: true }, { 
      status: 200,
      headers: {
        'Location': '/'
      }
    });
  } catch (error) {
    console.error('Failed to create course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
