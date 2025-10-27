import { createClient } from '@supabase/supabase-js'
import { config } from './env'

const supabase = createClient(config.projectUrlSupabase, config.apyKeySupabase)

export default supabase
