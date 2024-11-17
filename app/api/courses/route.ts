import { NextResponse } from 'next/server';
import { db } from '@/lib/db/index';
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

    // Return courses without trying to fetch images for now
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
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Delete associated course images first (due to foreign key constraint)
    await db.delete(courseImages)
      .where(eq(courseImages.courseId, id));

    // Delete associated lectures
    await db.delete(lectures)
      .where(eq(lectures.courseId, id));

    // Delete the course
    const deletedCourse = await db.delete(courses)
      .where(eq(courses.id, id))
      .returning();

    if (!deletedCourse.length) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete course:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
