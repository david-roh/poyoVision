import { NextResponse } from "next/server";

const dummyLectures = [
  {
    id: "1",
    courseId: "1",
    name: "Getting Started with React",
    description: "Setup and basic concepts",
    notes: "<h2>React Setup Guide</h2><p>In this lecture, we'll cover the essential steps to set up a React project...</p>",
    transcript: "Welcome to our first lecture on React. Today we'll be covering the fundamentals of setting up a React project...",
    audioUrl: "/dummy-audio-lecture1.mp3",
    images: [
      { url: "https://placeholder.co/400x300" },
      { url: "https://placeholder.co/400x300" }
    ],
    duration: "15:00",
    videoUrl: "https://example.com/lecture1",
    position: 1,
    isCompleted: false
  },
  {
    id: "2",
    courseId: "1",
    name: "Components and Props",
    description: "Understanding React components",
    notes: "<h2>Components in React</h2><p>Components are the building blocks of React applications...</p>",
    transcript: "In this lecture, we'll dive deep into React components and how they work...",
    audioUrl: "/dummy-audio-lecture2.mp3",
    images: [
      { url: "https://placeholder.co/400x300" },
      { url: "https://placeholder.co/400x300" }
    ],
    duration: "20:00",
    videoUrl: "https://example.com/lecture2",
    position: 2,
    isCompleted: false
  }
];

export async function GET(
  req: Request,
  { params }: { params: { courseId: string; lectureId: string } }
) {
  try {
    const lecture = dummyLectures.find(
      (lecture) => 
        lecture.courseId === params.courseId && 
        lecture.id === params.lectureId
    );

    if (!lecture) {
      return NextResponse.json(
        { error: "Lecture not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(lecture);
  } catch (error) {
    console.error("[LECTURE_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
