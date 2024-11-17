import { NextResponse } from "next/server";

const dummyCourseDetails = [
    {
      id: 1,
      name: "React Basics",
      description: "Learn React fundamentals",
      notes: "<h2>Introduction to React</h2><p>React is a JavaScript library for building user interfaces...</p>",
      transcript: "Welcome to React Basics. In this course, we'll cover fundamental concepts...",
      audioUrl: "/dummy-audio.mp3",
      images: [
        { url: "https://placeholder.co/400x300" },
        { url: "https://placeholder.co/400x300" }
      ]
    },
    {
      id: 2,
      name: "Advanced JavaScript",
      description: "Master JavaScript concepts and patterns",
      notes: "<h2>Deep Dive into JavaScript</h2><p>Understanding closures, prototypes, and async programming...</p>",
      transcript: "Welcome to Advanced JavaScript. We'll explore complex JavaScript concepts...",
      audioUrl: "/dummy-audio-2.mp3",
      images: [
        { url: "https://placeholder.co/400x300" },
        { url: "https://placeholder.co/400x300" }
      ]
    },
    {
      id: 3,
      name: "Node.js Fundamentals",
      description: "Build backend applications with Node.js",
      notes: "<h2>Server-side JavaScript</h2><p>Learn to create scalable network applications...</p>",
      transcript: "In this Node.js course, we'll cover server-side JavaScript programming...",
      audioUrl: "/dummy-audio-3.mp3",
      images: [
        { url: "https://placeholder.co/400x300" }
      ]
    },
    {
      id: 4,
      name: "TypeScript Essentials",
      description: "Learn static typing in JavaScript",
      notes: "<h2>TypeScript Basics</h2><p>Understanding types, interfaces, and TypeScript features...</p>",
      transcript: "Welcome to TypeScript Essentials. Let's explore type-safe JavaScript...",
      audioUrl: "/dummy-audio-4.mp3",
      images: [
        { url: "https://placeholder.co/400x300" }
      ]
    },
    {
      id: 5,
      name: "Next.js Masterclass",
      description: "Build full-stack React applications",
      notes: "<h2>Modern Web Development</h2><p>Learn server-side rendering and API routes...</p>",
      transcript: "This Next.js course will teach you modern web development practices...",
      audioUrl: "/dummy-audio-5.mp3",
      images: [
        { url: "https://placeholder.co/400x300" }
      ]
    },
    {
      id: 6,
      name: "Web Security Fundamentals",
      description: "Learn essential web security practices",
      notes: "<h2>Security Best Practices</h2><p>Understanding XSS, CSRF, and secure authentication...</p>",
      transcript: "In this security course, we'll cover critical web security concepts...",
      audioUrl: "/dummy-audio-6.mp3",
      images: [
        { url: "https://placeholder.co/400x300" }
      ]
    }
  ];

const dummyLectures = [
  {
    id: 1,
    courseId: 1,
    title: "Getting Started with React",
    description: "Setup and basic concepts",
    duration: "15:00",
    videoUrl: "https://example.com/lecture1",
    position: 1,
    isCompleted: false
  },
  {
    id: 2,
    courseId: 1,
    title: "Components and Props",
    description: "Understanding React components",
    duration: "20:00",
    videoUrl: "https://example.com/lecture2",
    position: 2,
    isCompleted: false
  },
  {
    id: 3,
    courseId: 2,
    title: "Closures in JavaScript",
    description: "Deep dive into closures",
    duration: "25:00",
    videoUrl: "https://example.com/lecture3",
    position: 1,
    isCompleted: false
  },
  {
    id: 4,
    courseId: 2,
    title: "Prototypal Inheritance",
    description: "Understanding prototypes",
    duration: "30:00",
    videoUrl: "https://example.com/lecture4",
    position: 2,
    isCompleted: false
  }
];

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const course = dummyCourseDetails.find(
      (course) => course.id.toString() === params.courseId
    );

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Update the lectures filter to use toString()
    const lectures = dummyLectures.filter(
      (lecture) => lecture.courseId.toString() === params.courseId
    );

    return NextResponse.json({
      ...course,
      lectures
    });
  } catch (error) {
    console.error('Error fetching course:', error); // Add logging
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}