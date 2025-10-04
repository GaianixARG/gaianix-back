import dotenv from 'dotenv'

dotenv.config()

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback
  if (value == null) {
    throw new Error(`❌ Missing env variable: ${key}`)
  }
  return value
}

export const config = {
  port: Number(getEnv('PORT', '3000')),
  nodeEnv: getEnv('NODE_ENV', 'development'),
  jwtSecret: getEnv('JWT_SECRET'),
  databaseUrl: getEnv('DATABASE_URL')
}
