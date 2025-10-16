import pg from 'pg'
import { config } from './env'

pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value: string) => {
  return parseFloat(value)
})

const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : undefined
})

export default pool
