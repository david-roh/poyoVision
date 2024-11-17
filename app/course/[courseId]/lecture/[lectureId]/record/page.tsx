'use client'

import NewSession from "@/components/new-session";
import { useParams } from "next/navigation";

export default function RecordPage() {
  const params = useParams();
  
  return <NewSession courseId={params.courseId} lectureId={params.lectureId} />;
} 