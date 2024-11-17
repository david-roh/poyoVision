import { NextResponse } from "next/server";
import { db, initializeDatabase } from '@/lib/db/index';
import { lectures, recordings, snapshots, notes } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  req: Request,
  { params }: { params: { courseId: string; lectureId: string } }
) {
  try {
    await initializeDatabase('system');

    // Get lecture details
    const lecture = await db
      .select()
      .from(lectures)
      .where(
        and(
          eq(lectures.courseId, params.courseId),
          eq(lectures.id, params.lectureId)
        )
      )
      .limit(1);

    if (!lecture?.length) {
      return NextResponse.json(
        { error: "Lecture not found" },
        { status: 404 }
      );
    }

    // Get recordings for this lecture
    const recordingsData = await db
      .select()
      .from(recordings)
      .where(eq(recordings.lectureId, params.lectureId));

    // Get all snapshots and notes for each recording
    const recordingsWithDetails = await Promise.all(
      recordingsData.map(async (recording) => {
        const [recordingSnapshots, recordingNotes] = await Promise.all([
          db.select()
            .from(snapshots)
            .where(eq(snapshots.recordingId, recording.id)),
          db.select()
            .from(notes)
            .where(eq(notes.lectureId, params.lectureId))
        ]);

        return {
          ...recording,
          snapshots: recordingSnapshots,
          notes: recordingNotes
        };
      })
    );

    return NextResponse.json({
      ...lecture[0],
      recordings: recordingsWithDetails
    });
  } catch (error) {
    console.error("[LECTURE_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
