import { NextResponse } from "next/server";
import { db } from '@/lib/db/index';
import { courses, lectures, courseImages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // Fetch course details
    const course = await db
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
      .where(eq(courses.id, params.courseId))
      .limit(1);

    if (!course || course.length === 0) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Fetch course images
    const images = await db
      .select({
        url: courseImages.url,
      })
      .from(courseImages)
      .where(eq(courseImages.courseId, params.courseId));

    // Fetch lectures for this course
    const courseLectures = await db
      .select({
        id: lectures.id,
        title: lectures.title,
        description: lectures.description,
        date: lectures.date,
        createdAt: lectures.createdAt
      })
      .from(lectures)
      .where(eq(lectures.courseId, params.courseId));

    return NextResponse.json({
      ...course[0],
      images,
      lectures: courseLectures
    });
  } catch (error) {
    console.error('Error fetching course:', error); // Add logging
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}