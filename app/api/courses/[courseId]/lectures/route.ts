import { NextResponse } from "next/server";
import { initializeDatabase } from '@/lib/db/index';
import { lectures } from '@/lib/db/schema';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { title, description, date } = await request.json();

    if (!title || !description || !date) {
      return NextResponse.json(
        { error: "Title, description, and date are required" },
        { status: 400 }
      );
    }

    // Initialize the database and get the db instance
    const db = await initializeDatabase('system');

    // Create the new lecture
    const newLecture = await db.insert(lectures).values({
      id: uuidv4(),
      courseId: params.courseId,
      title,
      description,
      date,
      userId: 'user_placeholder',
    }).returning();

    return NextResponse.json(newLecture[0]);
  } catch (error) {
    console.error("Failed to create lecture:", error);
    return NextResponse.json(
      { error: "Failed to create lecture" },
      { status: 500 }
    );
  }
} 


// export const lectures = sqliteTable('lectures', {
//   id: text('id').primaryKey(),
//   courseId: text('course_id').references(() => courses.id),
//   title: text('title').notNull(),
//   description: text('description'),
//   date: text('date').notNull(),
//   createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
//   updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
//   userId: text('user_id').notNull()
// });
