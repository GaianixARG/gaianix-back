import { randomUUID } from 'crypto'
import { TablasMap } from '../../schemas/mappings'
import { ICreateUser, IUser, IUserPrivate, userPrivateSchema, userSchema } from '../../schemas/user.schema'
import { BDService } from '../../services/bd.services'
import { ETablas } from '../../types/enums'
import { IUserModel } from '../definitions/users.models'
import { SupabaseClient } from '@supabase/supabase-js'
import { getValuesToSupabase, querySelectSupabase } from '../../utils/supabase.utils'

export class UserModelTestingSupabase implements IUserModel {
  Table: ETablas = ETablas.User
  MapTable = TablasMap[this.Table]

  supabase: SupabaseClient
  constructor (supabase: SupabaseClient) {
    this.supabase = supabase
  }

  getAll = async (): Promise<IUserPrivate[]> => {
    const query = querySelectSupabase(this.Table)
    const { data } = await this.supabase.from(this.Table).select(query)
    if (data == null) return []
    return data.map((row) => {
      const userResult = BDService.getObjectFromTable(this.Table, row, true)
      return userPrivateSchema.parse(userResult)
    })
  }

  getById = async (id: string): Promise<IUserPrivate | undefined> => {
    const mapTable = this.MapTable.map
    if (mapTable.id == null) return undefined

    const query = querySelectSupabase(this.Table)
    const { data } = await this.supabase.from(this.Table).select(query).eq(mapTable.id, id).single()
    if (data == null) return undefined

    const userResult = BDService.getObjectFromTable(this.Table, data, true)
    return userPrivateSchema.parse(userResult)
  }

  getByUsername = async (username: string): Promise<IUserPrivate | undefined> => {
    const mapTable = this.MapTable.map
    if (mapTable.username == null) return undefined

    const query = querySelectSupabase(this.Table)
    const { data } = await this.supabase.from(this.Table).select(query).eq(mapTable.username, username).single()
    if (data == null) return undefined

    const userResult = BDService.getObjectFromTable(this.Table, data, true)
    return userPrivateSchema.parse(userResult)
  }

  getByUsernameForLogin = async (username: string): Promise<IUser | undefined> => {
    const table = this.Table
    const mapTable = TablasMap[table].map
    if (mapTable.username == null) return undefined

    const query = querySelectSupabase(this.Table)
    const { data } = await this.supabase.from(this.Table).select(query).eq(mapTable.username, username).single()
    if (data == null) return undefined

    const userResult = BDService.getObjectFromTable(this.Table, data, true)
    return userSchema.parse(userResult)
  }

  create = async (user: ICreateUser): Promise<IUserPrivate> => {
    const newUser: IUser = {
      ...user,
      id: randomUUID()
    }

    const values = getValuesToSupabase<IUser>(this.Table, newUser)
    const { error } = await this.supabase.from(this.Table).insert(values)
    if (error != null) throw new Error('Error al crear el usuario')

    return newUser
  }
}
