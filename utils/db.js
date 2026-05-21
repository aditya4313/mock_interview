import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString =
  process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DRIZZLE_DB_URL;

if (!connectionString) {
  throw new Error(
    'Database URL missing. Set DATABASE_URL or NEXT_PUBLIC_DRIZZLE_DB_URL in .env.local'
  );
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
