export const env = {
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ?? '',
  ADZUNA_APP_ID: process.env.ADZUNA_APP_ID ?? '',
  ADZUNA_API_KEY: process.env.ADZUNA_API_KEY ?? '',
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
} as const

export type Env = typeof env
