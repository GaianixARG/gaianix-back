import { Pool } from 'pg'
import { config } from './env'

const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : undefined
})

export default pool
