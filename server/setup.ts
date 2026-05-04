import { query } from './db.js';
import bcrypt from 'bcrypt';

const USERS_REQUIRED_COLUMNS = ['username', 'password_hash', 'role'] as const;

async function ensureUsersTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL
    );
  `);

  const { rows } = await query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users'
  `);
  const columns = new Set((rows as { column_name: string }[]).map((r) => r.column_name));
  const missing = USERS_REQUIRED_COLUMNS.filter((c) => !columns.has(c));

  if (missing.length > 0) {
    console.warn(
      `The "users" table is missing column(s): ${missing.join(', ')}. ` +
        'Another app or an old schema may have created it. Dropping and recreating "users" for LEONI (only login users are removed).'
    );
    await query('DROP TABLE IF EXISTS users CASCADE');
    await query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL
      );
    `);
  }

  console.log('Users table verified.');
}

async function setup() {
  console.log('Starting Database Setup...');

  try {
    await ensureUsersTable();

    await query(`
      CREATE TABLE IF NOT EXISTS dashboard_data (
        id SERIAL PRIMARY KEY,
        metric_type VARCHAR(255) UNIQUE NOT NULL,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Dashboard Data table verified.');

    const adminCheck = await query(`SELECT id FROM users WHERE LOWER(username) = LOWER($1)`, ['hacker']);
    if (adminCheck.rows.length === 0) {
      const hash = await bcrypt.hash('hacker123', 10);
      await query(`INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)`, [
        'hacker',
        hash,
        'hacker',
      ]);
      console.log("Default admin created: Username: hacker | Password: hacker123 | Role: hacker");
    } else {
      console.log("Admin user 'hacker' already exists.");
    }

    console.log('Database Setup Complete!');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setup();
