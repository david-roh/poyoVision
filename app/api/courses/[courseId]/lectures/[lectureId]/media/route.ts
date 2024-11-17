import { NextResponse } from "next/server";
import { db } from '@/lib/db/index';
import { recordings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  request: Request,
  { params }: { params: { courseId: string; lectureId: string } }
) {
  try {
    // Explicitly parse as JSON
    const body = await request.json();
    const { type, recordingId, cid } = body;

    if (!type || !recordingId || !cid) {
      console.error("Missing fields:", { type, recordingId, cid });
      return NextResponse.json(
        { error: "Required fields missing", received: { type, recordingId, cid } },
        { status: 400 }
      );
    }

    // Update database based on media type
    const updateData: Record<string, string> = {};
    switch (type) {
      case 'audio':
        updateData.recordingCid = cid;
        break;
      case 'transcript':
        updateData.transcriptCid = cid;
        break;
      case 'summary':
        updateData.summaryCid = cid;
        break;
      case 'snapshot':
        updateData.snapshotCid = cid;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid media type" },
          { status: 400 }
        );
    }

    await db.update(recordings)
      .set(updateData)
      .where(eq(recordings.id, recordingId));

    return NextResponse.json({ 
      success: true,
      updated: {
        type,
        recordingId,
        ...updateData
      }
    });
  } catch (error) {
    console.error("Failed to update media:", error);
    return NextResponse.json(
      { error: "Failed to update media", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 