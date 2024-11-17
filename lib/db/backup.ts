import fs from 'fs';
import { pinata } from '@/utils/config';

const BACKUP_FILE_NAME = 'sqlite-backup.db';
const BACKUP_GROUP_NAME = 'database-backups';

export async function backupDatabase(dbPath: string) {
  try {
    // Create a temporary backup file
    const backupPath = `./${BACKUP_FILE_NAME}`;
    
    // Copy current database to backup file
    fs.copyFileSync(dbPath, backupPath);
    
    // Create a File object from the backup
    const backupFile = new File(
      [fs.readFileSync(backupPath)],
      BACKUP_FILE_NAME,
      { type: 'application/x-sqlite3' }
    );

    // Upload to Pinata with metadata
    const uploadResponse = await pinata.upload.file(backupFile)
      .addMetadata({
        name: `Backup-${new Date().toISOString()}`,
        keyValues: {
          type: 'database-backup',
          timestamp: new Date().toISOString()
        }
      });

    // Clean up temporary file
    fs.unlinkSync(backupPath);

    return uploadResponse;
  } catch (error) {
    console.error('Database backup failed:', error);
    throw error;
  }
}

export async function restoreDatabase(dbPath: string) {
  try {
    // Get latest backup file
    const files = await pinata.listFiles()
      .keyValue("type", "database-backup")
      .pageLimit(1);

    if (!files.length) {
      throw new Error('No backup found');
    }

    const latestBackup = files[0];
    
    // Download the backup file from Pinata gateway
    const response = await pinata.gateways.get(latestBackup.ipfs_pin_hash);
    
    if (!response.data) {
      throw new Error('Failed to download backup file');
    }

    // Convert blob to buffer and write to disk
    const arrayBuffer = await (response.data as Blob).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Create temporary file
    const tempPath = `${dbPath}.temp`;
    fs.writeFileSync(tempPath, buffer);

    // Verify the backup file
    try {
      const sqlite = require('better-sqlite3');
      new sqlite(tempPath); // This will throw if file is corrupted
      
      // If verification passes, replace the current database
      fs.renameSync(tempPath, dbPath);
    } catch (error) {
      // Clean up temp file if verification fails
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
      throw new Error('Backup file verification failed');
    }

    return true;
  } catch (error) {
    console.error('Database restore failed:', error);
    throw error;
  }
} 