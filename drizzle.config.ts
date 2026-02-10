import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql', // Changed from 'driver' to 'dialect'
  dbCredentials: {
    url: process.env.POSTGRES_URL || process.env.DATABASE_URL!, // Changed 'connectionString' to 'url'
  },
  verbose: true,
  strict: true,
});