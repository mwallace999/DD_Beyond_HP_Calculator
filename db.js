import pkg from 'pg';
const { Client } = pkg;

// Create a new PostgreSQL client
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'ddbeyond',
  password: 'password',
  port: 5432,
});

// Connect to the database
await client.connect();
console.log('Connected to the database');

// Handle SIGINT signal to gracefully shutdown the application
process.on('SIGINT', async () => {
  try {
    // Close the database connection
    await client.end();
    console.log('Disconnected from the database');
    // Terminate the application process
    process.exit();
  } catch (error) {
    console.error('Error disconnecting from the database:', error);
    // Terminate the application process with an error exit code
    process.exit(1);
  }
});

export default client;