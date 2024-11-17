import { db, sqlite } from './index';
import { pinata } from '@/utils/config';
import { v4 as uuidv4 } from 'uuid';

export async function backupDatabase() {
  try {
    // Create a backup of the database
    const backup = sqlite.backup('backup.db');
    
    // Convert the backup to a File object
    const dbFile = new File([backup], 'sqlite-backup.db', {
      type: 'application/x-sqlite3'
    });

    // Upload to Pinata with metadata
    const upload = await pinata.upload.file(dbFile)
      .addMetadata({
        name: `db-backup-${new Date().toISOString()}`,
        keyvalues: {
          type: 'sqlite-backup',
          timestamp: new Date().toISOString()
        }
      });

    console.log('Database backed up successfully:', upload.cid);
    return upload;
  } catch (error) {
    console.error('Failed to backup database:', error);
    throw error;
  }
}

export async function restoreDatabase() {
  try {
    // Get latest backup from Pinata
    const backups = await pinata.files.list()
      .metadata({ type: 'sqlite-backup' })
      .order('DESC')
      .limit(1);

    if (backups.files.length === 0) {
      console.log('No backup found, using fresh database');
      return false;
    }

    // Download the latest backup
    const latestBackup = backups.files[0];
    const response = await pinata.gateways.get(latestBackup.cid);
    const dbFile = response.data as Blob;

    // Write the backup to disk
    sqlite.restore(await dbFile.arrayBuffer());
    
    console.log('Database restored from backup:', latestBackup.cid);
    return true;
  } catch (error) {
    console.error('Failed to restore database:', error);
    throw error;
  }
} 