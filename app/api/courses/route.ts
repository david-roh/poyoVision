import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db/index';
import { courses, courseImages, lectures } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Initialize database connection first
    const db = await initializeDatabase(userId);

    const userCourses = await db
      .select({
        id: courses.id,
        name: courses.name,
        description: courses.description,
        imageUrl: courses.imageUrl,
        status: courses.status,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt
      })
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

    // Initialize database connection first
    const db = await initializeDatabase(userId);
    const courseId = uuidv4();
    
    // Create course with only the fields that exist in the schema
    const newCourse = await db.insert(courses).values({
      id: courseId,
      name,
      description,
      userId,
      status: 'active',
      imageUrl: null,
    }).returning();

    // Add default image
    await db.insert(courseImages).values({
      id: uuidv4(),
      courseId,
      url: "https://placeholder.co/400x300"
    });

    return NextResponse.json(newCourse[0]);
  } catch (error) {
    console.error('Failed to create course:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    console.log('Starting DELETE request');
    const { id, userId } = await request.json();
    console.log('Received params:', { id, userId });
    
    if (!id || !userId) {
      console.log('Missing required params');
      return NextResponse.json({ error: 'Course ID and User ID are required' }, { status: 400 });
    }

    console.log('Initializing database connection');
    const db = await initializeDatabase(userId);
    console.log('Database connection established');

    try {
      console.log('Deleting course images');
      await db.delete(courseImages)
        .where(eq(courseImages.courseId, id));
      console.log('Course images deleted successfully');

      console.log('Deleting lectures');
      await db.delete(lectures)
        .where(eq(lectures.courseId, id));
      console.log('Lectures deleted successfully');

      console.log('Deleting course');
      const deletedCourse = await db.delete(courses)
        .where(eq(courses.id, id))
        .returning();
      console.log('Course deletion result:', deletedCourse);

      if (!deletedCourse.length) {
        console.log('No course found to delete');
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      throw dbError;
    }
  } catch (error) {
    console.error('Failed to delete course:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
