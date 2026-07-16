import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('Database pipeline failure: Local variable DATABASE_URL environment token key target is missing.');
}

// Highly efficient secure HTTP pooling database context initializer
const sqlClientConnector = neon(process.env.DATABASE_URL);
export const db = drizzle(sqlClientConnector, { schema });