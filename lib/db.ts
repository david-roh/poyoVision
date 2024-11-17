// Temporary mock implementation
const pool = {
  query: async (text: string, params: any[]) => {
    // Mock data for GET requests
    if (text.includes('SELECT')) {
      return {
        rows: [
          { id: 1, name: 'Test Course', description: 'Test Description', created_at: new Date() }
        ]
      };
    }
    // Mock data for POST requests
    if (text.includes('INSERT')) {
      return {
        rows: [
          { id: 2, name: params[1], description: params[2], created_at: new Date() }
        ]
      };
    }
    return { rows: [] };
  }
};

export default pool;