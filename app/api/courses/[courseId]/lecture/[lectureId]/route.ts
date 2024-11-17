import { NextResponse } from "next/server";
import { db, initializeDatabase } from '@/lib/db/index';
import { lectures, recordings, snapshots, notes } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  req: Request,
  { params }: { params: { courseId: string; lectureId: string } }
) {
  try {
    const db = await initializeDatabase('system');
    
    // Get lecture details
    const lecture = await db
      .select()
      .from(lectures)
      .where(eq(lectures.id, params.lectureId));

    if (!lecture.length) {
      return NextResponse.json({ error: "Lecture not found" }, { status: 404 });
    }

    // Get recordings with their details
    const recordingsWithDetails = await db
      .select()
      .from(recordings)
      .where(eq(recordings.lectureId, params.lectureId));

    // Get snapshots for all recordings
    const allSnapshots = await db
      .select()
      .from(snapshots)
      .where(
        eq(snapshots.recordingId, recordingsWithDetails[recordingsWithDetails.length - 1]?.id)
      );

    // Map snapshots to include URL
    const images = allSnapshots.map(snapshot => ({
      id: snapshot.id,
      url: `https://gateway.pinata.cloud/ipfs/${snapshot.imageCid}`
    }));

    // Get the latest recording with media
    const latestRecording = recordingsWithDetails
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .find(r => r.recordingCid || r.transcriptCid || r.summary);

    return NextResponse.json({
      ...lecture[0],
      recordingCid: latestRecording?.recordingCid || null,
      transcriptCid: latestRecording?.transcriptCid || null,
      summary: latestRecording?.summary || null,
      recordings: recordingsWithDetails,
      images
    });
  } catch (error) {
    console.error("[LECTURE_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
