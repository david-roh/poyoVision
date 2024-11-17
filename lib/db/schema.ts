import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Courses table
export const courses = sqliteTable('courses', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
  userId: text('user_id').notNull(),
  imageUrl: text('image_url'),
  lastAccessed: text('last_accessed'),
  status: text('status').default('active'),
});

// Lectures table
export const lectures = sqliteTable('lectures', {
  id: text('id').primaryKey().notNull(),
  courseId: text('course_id').references(() => courses.id),
  title: text('title').notNull(),
  description: text('description'),
  date: text('date').notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
  userId: text('user_id').notNull(),
});

// Sessions table (recording sessions)
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey().notNull(),
  lectureId: text('lecture_id').references(() => lectures.id),
  userId: text('user_id').notNull(),
  startedAt: text('started_at').default('CURRENT_TIMESTAMP'),
  endedAt: text('ended_at'),
  status: text('status').default('active'),
  transcriptCid: text('transcript_cid'),
  recordingCid: text('recording_cid'),
  summary: text('summary'),
});

// Snapshots table (images taken during sessions)
export const snapshots = sqliteTable('snapshots', {
  id: text('id').primaryKey().notNull(),
  sessionId: text('session_id').references(() => sessions.id),
  userId: text('user_id').notNull(),
  imageCid: text('image_cid').notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  notes: text('notes'),
});

// Notes table (for course/lecture notes)
export const notes = sqliteTable('notes', {
  id: text('id').primaryKey().notNull(),
  courseId: text('course_id').references(() => courses.id),
  lectureId: text('lecture_id').references(() => lectures.id),
  userId: text('user_id').notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
}); 