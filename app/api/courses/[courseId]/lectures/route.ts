import { NextResponse } from "next/server";
import { db } from '@/lib/db/index';
import { lectures } from '@/lib/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { withBackup } from '@/lib/db/index';

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

    const newLecture = await withBackup(async () => {
      return db.insert(lectures).values({
        id: uuidv4(),
        courseId: params.courseId,
        title,
        description,
        date,
        userId: 'user_placeholder',
      }).returning();
    });

    return NextResponse.json(newLecture[0]);
  } catch (error) {
    console.error("Failed to create lecture:", error);
    return NextResponse.json(
      { error: "Failed to create lecture" },
      { status: 500 }
    );
  }
} 