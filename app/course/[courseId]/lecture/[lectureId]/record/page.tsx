'use client'

import NewSession from "@/components/new-session";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function RecordPage() {
  const params = useParams();
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    const createRecording = async () => {
      if (!isLoaded || !isSignedIn) return;
      
      try {
        const response = await fetch(`/api/courses/${params.courseId}/lectures/${params.lectureId}/recordings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'recording',
            userId: user.id
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create recording');
        }

        const data = await response.json();
        setRecordingId(data.recordingId);
      } catch (error) {
        console.error('Error creating recording:', error);
      }
    };

    createRecording();
  }, [params.courseId, params.lectureId, isLoaded, isSignedIn, user]);

  if (!isLoaded || !isSignedIn || !recordingId) {
    return <div>Loading...</div>;
  }

  return <NewSession 
    courseId={params.courseId.toString()} 
    lectureId={params.lectureId.toString()} 
    recordingId={recordingId}
  />;
} 