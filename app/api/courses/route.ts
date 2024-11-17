import { NextResponse } from 'next/server';
import { db, initializeDatabase } from '@/lib/db/index';
import { courses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Initialize database if needed
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
    const { name, description, userId } = await request.json();

    if (!name || !userId) {
      return NextResponse.json({ error: 'Name and User ID are required' }, { status: 400 });
    }

    // Initialize database if needed
    await initializeDatabase(userId);

    const newCourse = await db.insert(courses).values({
      id: uuidv4(),
      name,
      description,
      userId,
      status: 'active',
      imageUrl: null,
    }).returning();

    return NextResponse.json(newCourse[0]);
  } catch (error) {
    console.error('Failed to create course:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id }: { id: string } = await request.json();
    const index = dummyCourseDetails.findIndex(course => course.id.toString() === id);
    
    if (index === -1) {
      return new NextResponse("Course not found", { status: 404 });
    }
    
    dummyCourseDetails.splice(index, 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
