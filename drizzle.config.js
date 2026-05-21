import { readFileSync, existsSync } from 'fs';
import { defineConfig } from 'drizzle-kit';
import './scripts/neon-ipv4.mjs';

function loadEnvLocal() {
  if (!existsSync('.env.local')) return;
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

export default defineConfig({
  schema: './utils/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      process.env.NEXT_PUBLIC_DRIZZLE_DB_URL,
  },
});
