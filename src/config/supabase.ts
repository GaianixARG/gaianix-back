import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { config } from './env'

export class Supabase {
  protected client: SupabaseClient

  constructor () {
    this.client = createClient(config.projectUrlSupabase, config.apyKeySupabase)
  }

  getAccess = (): SupabaseClient => this.client
}

// const supabase = config.projectUrlSupabase === '' ? undefined : createClient(config.projectUrlSupabase, config.apyKeySupabase)
// export default supabase
