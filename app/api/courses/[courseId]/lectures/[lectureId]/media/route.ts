import { NextResponse } from "next/server";
import { initializeDatabase } from '@/lib/db/index';
import { recordings, snapshots } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  request: Request,
  { params }: { params: { courseId: string; lectureId: string } }
) {
  console.log('Media endpoint called with params:', params);
  
  try {
    const db = await initializeDatabase('system');
    const body = await request.json();
    console.log('Received media request body:', body);

    const { type, recordingId, cid } = body;

    if (!type || !recordingId || !cid) {
      console.error("Missing fields:", { type, recordingId, cid });
      return NextResponse.json(
        { error: "Required fields missing", received: { type, recordingId, cid } },
        { status: 400 }
      );
    }

    console.log('Processing media type:', type);
    
    // Handle different media types
    switch (type) {
      case 'audio':
      case 'transcript':
      case 'summary':
        // Update recordings table
        const updateData = type === 'audio' ? { recordingCid: cid } :
                         type === 'transcript' ? { transcriptCid: cid } :
                         { summary: cid };
        
        await db
          .update(recordings)
          .set(updateData)
          .where(eq(recordings.id, recordingId));
        break;

      case 'snapshot':
        // Insert into snapshots table
        const snapshotId = uuidv4();
        await db.insert(snapshots).values({
          id: snapshotId,
          recordingId,
          imageCid: cid,
          userId: 'user_placeholder',
          createdAt: new Date().toISOString()
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid media type" },
          { status: 400 }
        );
    }

    return NextResponse.json({ 
      success: true,
      type,
      recordingId,
      cid
    });

  } catch (error) {
    console.error("Media handler error:", error);
    return NextResponse.json(
      { error: "Failed to update media", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 