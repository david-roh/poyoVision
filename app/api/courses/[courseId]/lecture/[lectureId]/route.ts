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

    // Get lecture with recordings and their details
    const lecture = await db
      .select({
        id: lectures.id,
        courseId: lectures.courseId,
        title: lectures.title,
        description: lectures.description,
        date: lectures.date,
        userId: lectures.userId,
        createdAt: lectures.createdAt,
        updatedAt: lectures.updatedAt,
      })
      .from(lectures)
      .where(
        and(
          eq(lectures.id, params.lectureId),
          eq(lectures.courseId, params.courseId)
        )
      );

    if (!lecture || lecture.length === 0) {
      return NextResponse.json(
        { error: "Lecture not found" },
        { status: 404 }
      );
    }

    // Get recordings with their media details
    const recordingsWithDetails = await db
      .select({
        id: recordings.id,
        status: recordings.status,
        startedAt: recordings.startedAt,
        recordingCid: recordings.recordingCid,
        transcriptCid: recordings.transcriptCid,
        summary: recordings.summary,
      })
      .from(recordings)
      .where(eq(recordings.lectureId, params.lectureId));

    // Get the latest recording with media
    const latestRecording = recordingsWithDetails
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .find(r => r.recordingCid || r.transcriptCid || r.summary);

    return NextResponse.json({
      ...lecture[0],
      recordingCid: latestRecording?.recordingCid || null,
      transcriptCid: latestRecording?.transcriptCid || null,
      summary: latestRecording?.summary || null,
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
