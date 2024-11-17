import { NextRequest, NextResponse } from "next/server";
import { backupDatabase, restoreDatabase } from "@/lib/db/backup";

export async function POST(request: NextRequest) {
  try {
    // Close the database connection before backup
    const sqlite = require('better-sqlite3')('sqlite.db');
    sqlite.close();

    const backup = await backupDatabase('sqlite.db');
    return NextResponse.json({
      message: 'Backup created successfully',
      backup
    });
  } catch (error) {
    console.error('Backup creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Close the database connection before restore
    const sqlite = require('better-sqlite3')('sqlite.db');
    sqlite.close();

    await restoreDatabase('sqlite.db');
    return NextResponse.json({
      message: 'Database restored successfully'
    });
  } catch (error) {
    console.error('Database restore failed:', error);
    return NextResponse.json(
      { error: 'Failed to restore database' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const backups = await pinata.files.list()
      .metadata({ type: 'database-backup' })
      .order('DESC');

    return NextResponse.json(backups);
  } catch (error) {
    console.error('Failed to list backups:', error);
    return NextResponse.json(
      { error: 'Failed to list backups' },
      { status: 500 }
    );
  }
} 