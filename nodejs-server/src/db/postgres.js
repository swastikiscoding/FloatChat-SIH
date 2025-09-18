import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'argo_data',
  password: process.env.DB_PASS || 'your-postgres-password',
  port: 5432, 
});

export default pool;
