export const config = {
  // Server
  PORT: parseInt(process.env.PORT || '3001', 10),
  HOST: process.env.HOST || '0.0.0.0',

  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
  ],

  // Database (para futuro uso)
  DATABASE_URL: process.env.DATABASE_URL || '',

  // JWT (para futuro uso)
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
} as const

export type Config = typeof config
