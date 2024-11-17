
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

export async function GET() {
  const courseList = dummyCourseDetails.map(({ id, name, description }) => ({
    id: id.toString(),
    name,
    description
  }));
  return NextResponse.json(courseList);
}

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();
    
    const dummyResponse = {
      id: dummyCourseDetails.length + 1,
      name,
      description,
      notes: "<h2>New Course</h2><p>Course content coming soon...</p>",
      transcript: "Welcome to the new course.",
      audioUrl: "/dummy-audio-placeholder.mp3",
      images: [{ url: "https://placeholder.co/400x300" }]
    };
    
    dummyCourseDetails.push(dummyResponse);
    return NextResponse.json(dummyResponse);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
