import { initializeDatabase } from './lib/db/index';

async function showSchema() {
  try {
    const db = await initializeDatabase('system');
    const schema = await db.all(`
      SELECT 
        name as 'Table',
        sql as 'Create Statement'
      FROM 
        sqlite_master 
      WHERE 
        type='table' AND 
        name NOT LIKE 'sqlite_%' AND
        name NOT LIKE '_*'
    `);
    
    console.table(schema);
  } catch (error) {
    console.error('Failed to fetch schema:', error);
  }
}

showSchema(); 