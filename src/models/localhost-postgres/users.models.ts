import pool from '../../config/db'
import { KeysUser, TablasMap } from '../../schemas/mappings'
import { ICreateUser, IUser, IUserPrivate, userPrivateSchema, userSchema } from '../../schemas/user.schema'
import { BDService } from '../../services/bd.services'
import { ETablas } from '../../types/enums'
import { IUserModel } from '../definitions/users.models'

export class UserModelLocalPostgres implements IUserModel {
  getAll = async (): Promise<IUserPrivate[]> => {
    const result = await pool.query(`SELECT * FROM ${ETablas.User}`)
    return result.rows.map((row) => userPrivateSchema.parse(row))
  }

  getById = async (id: string): Promise<IUserPrivate | undefined> => {
    const table = ETablas.User
    const mapTable = TablasMap[table].map
    if (mapTable.id == null) return undefined

    const result = await pool.query(`SELECT * FROM ${table} WHERE ${mapTable.id} = $1`, [id])
    if (result.rowCount == null || result.rowCount === 0) return undefined

    return userPrivateSchema.parse(result.rows[0])
  }

  getByUsername = async (username: string): Promise<IUserPrivate | undefined> => {
    const table = ETablas.User
    const mapTable = TablasMap[table].map
    if (mapTable.username == null) return undefined

    const result = await pool.query(`SELECT * FROM ${table} WHERE ${mapTable.username} = $1`, [username])
    if (result.rowCount == null || result.rowCount === 0) return undefined
    return userPrivateSchema.parse(result.rows[0])
  }

  getByUsernameForLogin = async (username: string): Promise<IUser | undefined> => {
    const table = ETablas.User
    const mapTable = TablasMap[table].map
    if (mapTable.username == null) return undefined

    const result = await pool.query(`SELECT * FROM ${table} WHERE ${mapTable.username} = $1`, [username])
    if (result.rowCount == null || result.rowCount === 0) return undefined

    return userSchema.parse(result.rows[0])
  }

  create = async (user: ICreateUser): Promise<IUserPrivate> => {
    const dataInsert = BDService.queryInsert<KeysUser, ICreateUser>(ETablas.User, user)

    const result = await pool.query(dataInsert.query, dataInsert.values)
    if (result == null || result.rowCount === 0) throw new Error('Error al crear el usuario')

    const newUser = {
      id: result.rows[0],
      ...user
    }
    return newUser
  }
}
