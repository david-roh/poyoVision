import { NextResponse } from "next/server";
import { initializeDatabase } from '@/lib/db/index';
import { lectures, recordings } from '@/lib/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { PinataSDK } from 'pinata';

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT
});

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

    const db = await initializeDatabase('system');
    const lectureId = uuidv4();
    const recordingId = uuidv4();

    // Create lecture
    const newLecture = await db.insert(lectures).values({
      id: lectureId,
      courseId: params.courseId,
      title,
      description,
      date,
      userId: 'user_placeholder',
    }).returning();

    // Create associated recording entry
    await db.insert(recordings).values({
      id: recordingId,
      lectureId: lectureId,
      userId: 'user_placeholder',
      status: 'pending'
    });

    // Create a Pinata group for this lecture's media
    const group = await pinata.groups.create({
      name: `lecture-${lectureId}`,
      isPublic: false
    });

    return NextResponse.json({
      ...newLecture[0],
      recordingId,
      groupId: group.id
    });
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
