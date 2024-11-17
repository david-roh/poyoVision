import { NextResponse } from "next/server";
import { db } from '@/lib/db/index';
import { recordings } from '@/lib/db/schema';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  request: Request,
  { params }: { params: { courseId: string; lectureId: string } }
) {
  try {
    const { lectureId } = params;
    const { status, userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Generate a new UUID for the recording
    const recordingId = uuidv4();

    // Create new recording entry
    const newRecording = await db.insert(recordings).values({
      id: recordingId,
      lectureId,
      userId,
      status: status || 'recording',
      startedAt: new Date().toISOString(),
    }).returning();

    return NextResponse.json({ 
      recordingId: recordingId,
      status: 'success',
      data: newRecording[0]
    });

  } catch (error) {
    console.error("Failed to create recording:", error);
    return NextResponse.json(
      { error: "Failed to create recording" },
      { status: 500 }
    );
  }
} 