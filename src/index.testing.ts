import { createApp } from './app'
import { FertilizerModelTestingSupabase } from './models/testing-supabase/fertilizer.models'
import { LoteModelTestingSupabase } from './models/testing-supabase/lote.models'
import { OrderModelTestingSupabase } from './models/testing-supabase/orders.models'
import { SeedModelTestingSupabase } from './models/testing-supabase/seeds.models'
import { UserModelTestingSupabase } from './models/testing-supabase/users.models'

createApp({
  orderModel: new OrderModelTestingSupabase(),
  seedModel: new SeedModelTestingSupabase(),
  userModel: new UserModelTestingSupabase(),
  loteModel: new LoteModelTestingSupabase(),
  fertilizerModel: new FertilizerModelTestingSupabase()
})
