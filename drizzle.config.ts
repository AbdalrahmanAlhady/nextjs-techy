import type { Config } from 'drizzle-kit';

export default {
  schema: './packages/db/schema.ts', // adjust path if needed
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;