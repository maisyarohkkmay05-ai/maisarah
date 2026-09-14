import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // PRD Section 8: Supabase Keep-Alive (Cron)
  // Endpoint: /api/cron/keepalive
  // Method: GET
  // Melakukan SELECT ringan ke salah satu tabel (contoh: tabel projects, limit 1)
  // Response sukses: { ok: true }
  // Validasi request menggunakan CRON_SECRET
  app.get('/api/cron/keepalive', async (req, res) => {
    const cronSecret = process.env.CRON_SECRET;
    
    // Validate CRON_SECRET if configured
    if (cronSecret) {
      const authHeader = req.headers.authorization;
      const customHeader = req.headers['x-cron-secret'];
      const querySecret = req.query.secret;

      const providedToken = authHeader?.replace(/^Bearer\s+/i, '') || customHeader || querySecret;

      if (providedToken !== cronSecret) {
        return res.status(401).json({ error: 'Unauthorized: Invalid CRON_SECRET' });
      }
    }

    // Perform light select if Supabase credentials are configured
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = 
      process.env.SUPABASE_SERVICE_ROLE_KEY || 
      process.env.VITE_SUPABASE_ANON_KEY || 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http') && !supabaseUrl.includes('your-project')) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        // Light select only: limit 1, no mutation
        await supabase.from('projects').select('id').limit(1);
      } catch (err: any) {
        console.warn('Keep-alive Supabase query note:', err.message);
      }
    }

    return res.json({ 
      ok: true,
      timestamp: new Date().toISOString(),
      message: 'Supabase keep-alive ping successful'
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    // Explicit SPA HTML handler placed before vite.middlewares so any client route (/admin, /login, etc.)
    // always returns index.html and never throws a 404
    app.use(async (req, res, next) => {
      if (req.method !== 'GET') return next();
      // Skip API endpoints, Vite internal modules, and static files with extensions
      if (
        req.path.startsWith('/api') ||
        req.path.startsWith('/@') ||
        req.path.startsWith('/src') ||
        req.path.startsWith('/node_modules') ||
        path.extname(req.path) !== ''
      ) {
        return next();
      }

      try {
        const indexPath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        return res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(template);
      } catch (e) {
        next(e);
      }
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
