import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

function createPool() {
  const url = process.env.DATABASE_URL?.trim();
  if (url) {
    return new Pool({ connectionString: url });
  }

  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT || 5432);
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD ?? '';
  const database = process.env.DB_NAME;

  if (!user || !database) {
    throw new Error(
      'Database not configured: set DATABASE_URL or DB_HOST, DB_USER, DB_NAME (and DB_PASSWORD if required).'
    );
  }

  return new Pool({
    host,
    port,
    user,
    password,
    database,
  });
}

const pool = createPool();

export const query = (text: string, params?: any[]) => pool.query(text, params);
