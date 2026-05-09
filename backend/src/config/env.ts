import { z } from 'zod'

const envSchema = z.object({
  // Server
  PORT: z.coerce.number().default(3001),
  HOST: z.string().default('0.0.0.0'),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  // Security & Auth
  JWT_SECRET: z
    .string()
    .min(32, 'El JWT_SECRET debe tener al menos 32 caracteres'),
  ALLOWED_ORIGINS: z
    .string()
    .default('http://localhost:3000')
    .transform(str => str.split(',')),

  // App Constants
  PLUGIN_TIMEOUT: z.coerce.number().default(20_000),
  MAX_FILE_SIZE: z.coerce.number().default(5_242_880),
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  TRUST_PROXY: z
    .preprocess(
      val => {
        if (val === 'true') return true
        if (val === 'false') return false
        if (typeof val === 'string' && val.includes(',')) return val.split(',')
        return val
      },
      z.union([z.boolean(), z.string(), z.number(), z.array(z.string())])
    )
    .default(false),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Error en las variables de entorno:', parsed.error.format())
  process.exit(1)
}

export const config = parsed.data
export type Config = typeof config
