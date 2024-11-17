import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Courses table
export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
  userId: text('user_id').notNull(),
  imageUrl: text('image_url'),
  lastAccessed: text('last_accessed'),
  status: text('status').default('active')
});

// Course Images table
export const courseImages = sqliteTable('course_images', {
  id: text('id').primaryKey(),
  courseId: text('course_id').references(() => courses.id),
  url: text('url').notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP')
});

// Lectures table
export const lectures = sqliteTable('lectures', {
  id: text('id').primaryKey(),
  courseId: text('course_id').references(() => courses.id),
  title: text('title').notNull(),
  description: text('description'),
  date: text('date').notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
  userId: text('user_id').notNull()
});

// Recordings table
export const recordings = sqliteTable('recordings', {
  id: text('id').primaryKey(),
  lectureId: text('lecture_id').references(() => lectures.id),
  userId: text('user_id').notNull(),
  startedAt: text('started_at').default('CURRENT_TIMESTAMP'),
  endedAt: text('ended_at'),
  status: text('status').default('active'),
  recordingCid: text('recording_cid'),
  transcriptCid: text('transcript_cid'),
  summary: text('summary')
});

// Snapshots table
export const snapshots = sqliteTable('snapshots', {
  id: text('id').primaryKey(),
  recordingId: text('recording_id').references(() => recordings.id),
  userId: text('user_id').notNull(),
  imageCid: text('image_cid').notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  notes: text('notes')
});

// Notes table
export const notes = sqliteTable('notes', {
  id: text('id').primaryKey(),
  courseId: text('course_id').references(() => courses.id),
  lectureId: text('lecture_id').references(() => lectures.id),
  userId: text('user_id').notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP')
}); 