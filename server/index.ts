import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from './db.js';

const app = express();

// With credentials: true, the browser Origin must be allowed. In dev, allow any origin to avoid
// localhost vs 127.0.0.1 / port mismatches. In production, set NODE_ENV=production and CLIENT_URL.
const relaxCors = process.env.NODE_ENV !== 'production' || process.env.CORS_RELAXED === 'true';
app.use(
  cors({
    origin(origin, callback) {
      if (relaxCors) return callback(null, true);
      const list = process.env.CLIENT_URL?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];
      if (!origin) return callback(null, true);
      if (list.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const PORT = process.env.PORT || 5000;

// Root URL — the API has no SPA here; "Cannot GET /" confuses people opening port 5000 in a browser.
app.get('/', (_req: any, res: any) => {
  res.type('html').send(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>LEONI API</title></head>
<body style="font-family:system-ui;padding:2rem;max-width:40rem">
  <h1>LEONI backend is running</h1>
  <p>This port serves the <strong>REST API</strong>, not the React app.</p>
  <ul>
    <li><a href="/api/health">/api/health</a> — check database connection</li>
    <li>React UI: run <code>npm run dev:frontend</code> and open the Vite URL (e.g. <code>http://localhost:5173</code>)</li>
  </ul>
</body></html>`);
});

// Public: verify API + PostgreSQL (no JWT). Open GET /api/health in a browser or use curl.
app.get('/api/health', async (_req: any, res: any) => {
  try {
    const result = await query('SELECT 1 AS ok, current_database() AS database, now() AS server_time');
    const row = result.rows[0];

    const checks = { usersTable: false, hackerUser: false };
    try {
      await query('SELECT 1 FROM users LIMIT 1');
      checks.usersTable = true;
      const admin = await query('SELECT 1 FROM users WHERE username = $1 LIMIT 1', ['hacker']);
      checks.hackerUser = admin.rows.length > 0;
    } catch {
      /* table missing or not readable */
    }

    res.json({
      status: 'ok',
      api: 'running',
      database: 'connected',
      dbName: row.database,
      serverTime: row.server_time,
      checks,
      hint:
        !checks.usersTable || !checks.hackerUser
          ? 'Run: npm run db:setup  (creates tables + user hacker / hacker123)'
          : undefined,
    });
  } catch (error: any) {
    console.error('Health check DB error:', error);
    res.status(503).json({
      status: 'error',
      api: 'running',
      database: 'disconnected',
      message: error?.message || 'Database query failed',
    });
  }
});

// Middleware to verify JWT
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(401).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// --- AUTHENTICATION ROUTES ---

// Login
app.post('/api/auth/login', async (req: any, res: any) => {
  const fail500 = (err: unknown) => {
    const detail = err instanceof Error ? err.message : String(err);
    console.error('Login error:', err);
    res.status(500).json({
      error: 'Server error during login',
      detail,
    });
  };

  try {
    const rawUser = req.body?.username;
    const password = req.body?.password;
    const username = typeof rawUser === 'string' ? rawUser.trim() : '';
    if (!username || typeof password !== 'string') {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await query(
      'SELECT id, username, role, password_hash FROM users WHERE LOWER(username) = LOWER($1)',
      [username]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const row = result.rows[0] as { id: number; username: string; role: string; password_hash?: string };
    const hash = row.password_hash;
    if (!hash || typeof hash !== 'string') {
      return res.status(500).json({
        error: 'Server error during login',
        detail: 'User row has no password_hash. Run npm run db:setup or fix the database.',
      });
    }

    let validPassword = false;
    try {
      validPassword = await bcrypt.compare(password, hash);
    } catch (bcErr: unknown) {
      const msg = bcErr instanceof Error ? bcErr.message : String(bcErr);
      return res.status(500).json({
        error: 'Server error during login',
        detail: `Password check failed: ${msg}. The stored hash may be invalid.`,
      });
    }

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: row.id, username: row.username, role: row.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, role: row.role, username: row.username });
  } catch (error: unknown) {
    fail500(error);
  }
});

// Register new user (Only 'hacker' can do this)
app.post('/api/auth/register', authenticateToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'hacker') {
      return res.status(403).json({ error: 'Only hacker can create accounts' });
    }

    const { username, password, role } = req.body;
    
    if (!['hacker', 'supervisor', 'assistante'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be hacker, supervisor, or assistante' });
    }

    const existingUser = await query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    await query('INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)', [username, hash, role]);

    res.json({ message: `User ${username} created successfully with role ${role}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Get all users (Only 'hacker')
app.get('/api/users', authenticateToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'hacker') return res.status(403).json({ error: 'Forbidden' });
    const result = await query('SELECT id, username, role FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- DASHBOARD DATA ROUTES ---

// Get all dashboard data
app.get('/api/dashboard', authenticateToken, async (req: any, res: any) => {
  try {
    const result = await query('SELECT metric_type, data FROM dashboard_data');
    const fullData: any = {};
    result.rows.forEach(row => {
      fullData[row.metric_type] = row.data;
    });
    res.json(fullData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Save/Update dashboard data
app.post('/api/sync', authenticateToken, async (req: any, res: any) => {
  try {
    const { productionData, importedData, safetyState } = req.body;

    const upsert = async (metricType: string, data: unknown) => {
      await query(
        `
        INSERT INTO dashboard_data (metric_type, data)
        VALUES ($1, $2)
        ON CONFLICT (metric_type)
        DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP
      `,
        [metricType, data]
      );
    };

    if (productionData != null) await upsert('productionData', productionData);
    if (importedData != null) await upsert('importedData', importedData);
    if (safetyState != null) await upsert('safetyState', safetyState);

    res.json({ message: 'Data synced successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to sync dashboard data' });
  }
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
