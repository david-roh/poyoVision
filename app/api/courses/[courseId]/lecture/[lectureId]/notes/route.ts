import { NextResponse } from "next/server";
import { initializeDatabase } from '@/lib/db/index';
import { recordings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: Request,
  { params }: { params: { courseId: string; lectureId: string } }
) {
  try {
    const { notes } = await request.json();
    const { lectureId } = params;

    const db = await initializeDatabase('system');

    await db.update(recordings)
      .set({ summary: notes })
      .where(eq(recordings.lectureId, lectureId))
      .execute();

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error("[LECTURE_NOTES_UPDATE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 