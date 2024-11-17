import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { courses, lectures, sessions, snapshots, notes } from "./schema";
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite);

const getSeedCourses = (userId: string) => [
  {
    id: uuidv4(),
    name: "Introduction to Computer Science",
    description: "Fundamental concepts of programming and computer science",
    userId: userId,
  },
  {
    id: uuidv4(),
    name: "Data Structures and Algorithms",
    description: "Essential data structures and algorithm design techniques",
    userId: userId,
  },
  {
    id: uuidv4(),
    name: "Web Development Fundamentals",
    description: "Basics of HTML, CSS, and JavaScript",
    userId: userId,
  },
];

export async function initializeDatabase(userId: string) {
  try {
    console.log("🔄 Initializing database...");

    // Create tables
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_id TEXT NOT NULL,
        image_url TEXT DEFAULT NULL,
        last_accessed DATETIME DEFAULT NULL,
        status TEXT DEFAULT 'active'
      );

      CREATE TABLE IF NOT EXISTS lectures (
        id TEXT PRIMARY KEY,
        course_id TEXT REFERENCES courses(id),
        title TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_id TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        lecture_id TEXT REFERENCES lectures(id),
        user_id TEXT NOT NULL,
        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ended_at DATETIME DEFAULT NULL,
        status TEXT DEFAULT 'active',
        transcript_cid TEXT DEFAULT NULL,
        recording_cid TEXT DEFAULT NULL,
        summary TEXT DEFAULT NULL
      );

      CREATE TABLE IF NOT EXISTS snapshots (
        id TEXT PRIMARY KEY,
        session_id TEXT REFERENCES sessions(id),
        user_id TEXT NOT NULL,
        image_cid TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT DEFAULT NULL
      );

      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        course_id TEXT REFERENCES courses(id),
        lecture_id TEXT REFERENCES lectures(id),
        user_id TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS course_images (
        id TEXT PRIMARY KEY,
        course_id TEXT REFERENCES courses(id),
        url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check for existing courses
    const existingCourses = await db
      .select()
      .from(courses)
      .where(eq(courses.userId, userId));
    
    if (existingCourses.length === 0) {
      console.log("🌱 Seeding initial course data...");
      const seedCourses = getSeedCourses(userId);
      for (const course of seedCourses) {
        await db.insert(courses).values(course);
      }
      console.log("✅ Seed data inserted successfully");
    } else {
      console.log("📚 Database already contains courses, skipping seed");
    }

    console.log("✅ Database initialization complete");
    
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
} 