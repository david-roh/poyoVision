import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { courses, lectures, sessions, snapshots, notes } from "./schema";
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { backupDatabase, restoreDatabase } from './backup';
import fs from 'fs';

const DB_PATH = 'sqlite.db';
let sqlite: Database.Database;
let db: ReturnType<typeof drizzle>;
let isInitialized = false;

// Initialize database connection
function initConnection() {
  if (!isInitialized) {
    sqlite = new Database(DB_PATH);
    db = drizzle(sqlite);
    isInitialized = true;
  }
  return { sqlite, db };
}

// Initialize or restore database
export async function initializeDatabase(userId: string) {
  try {
    console.log("🔄 Checking database status...");
    
    // Check if database exists
    const dbExists = fs.existsSync(DB_PATH);
    
    if (!dbExists) {
      console.log("💾 No database found, attempting to restore from backup...");
      try {
        await restoreDatabase(DB_PATH);
        console.log("✅ Database restored from backup");
      } catch (error) {
        console.log("⚠️ No backup found or restore failed, creating new database");
        await createNewDatabase(userId);
      }
    }

    // Initialize connection if not already initialized
    const { db: database } = initConnection();
    
    // Verify database integrity
    const hasData = await verifyDatabaseIntegrity(userId);
    
    if (!hasData) {
      console.log("⚠️ Database empty or corrupted, initializing with seed data");
      await createNewDatabase(userId);
    }

    return database;
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

// Create new database with schema and seed data
async function createNewDatabase(userId: string) {
  console.log("🔄 Creating new database...");
  
  // Initialize connection if not exists
  if (!sqlite || !db) {
    ({ sqlite, db } = initConnection());
  }

  // Create schema
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

  // Seed initial data
  const seedCourses = getSeedCourses(userId);
  for (const course of seedCourses) {
    await db.insert(courses).values(course);
  }

  // Create initial backup
  await createBackup();
  
  console.log("✅ New database created and backed up");
}

// Verify database has required tables and data
async function verifyDatabaseIntegrity(userId: string) {
  try {
    const existingCourses = await db
      .select()
      .from(courses)
      .where(eq(courses.userId, userId));
    
    return existingCourses.length > 0;
  } catch {
    return false;
  }
}

// Backup after significant operations
export async function withBackup<T>(operation: () => Promise<T>): Promise<T> {
  try {
    const result = await operation();
    await createBackup();
    return result;
  } catch (error) {
    console.error('Operation failed:', error);
    throw error;
  }
}

// Add this function to handle automatic backups
export async function createBackup() {
  try {
    // Close current connection
    sqlite.close();
    
    // Create backup
    const backup = await backupDatabase('sqlite.db');
    
    // Reinitialize connection
    const newSqlite = new Database('sqlite.db');
    
    return backup;
  } catch (error) {
    console.error('Auto-backup failed:', error);
    throw error;
  }
}

function getSeedCourses(userId: string) {
  return [
    {
      id: uuidv4(),
      name: "My First Course",
      description: "Get started by adding your first lecture",
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      lastAccessed: new Date().toISOString()
    }
  ];
}

export { db }; 