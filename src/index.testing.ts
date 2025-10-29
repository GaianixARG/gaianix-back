import { createApp } from './app'
import { Supabase } from './config/supabase'
import { FertilizerModelTestingSupabase } from './models/testing-supabase/fertilizer.models'
import { LoteModelTestingSupabase } from './models/testing-supabase/lote.models'
import { OrderModelTestingSupabase } from './models/testing-supabase/orders.models'
import { SeedModelTestingSupabase } from './models/testing-supabase/seeds.models'
import { UserModelTestingSupabase } from './models/testing-supabase/users.models'

const client = new Supabase().getAccess()
const app = createApp({
  orderModel: new OrderModelTestingSupabase(client),
  seedModel: new SeedModelTestingSupabase(client),
  userModel: new UserModelTestingSupabase(client),
  loteModel: new LoteModelTestingSupabase(client),
  fertilizerModel: new FertilizerModelTestingSupabase(client)
})

export default app
