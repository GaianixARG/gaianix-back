import { randomUUID } from 'crypto'
import pool from '../../config/db'
import { TablasMap } from '../../schemas/mappings'
import { ICreateUser, IUser, IUserPrivate, userPrivateSchema, userSchema } from '../../schemas/user.schema'
import { BDService } from '../../services/bd.services'
import { ETablas } from '../../types/enums'
import { IUserModel } from '../definitions/users.models'

const querySelectUser = (): string => `
  SELECT * FROM "${ETablas.User}"
    ${BDService.queryJoin('INNER', ETablas.User, ETablas.Rol)}
`

export class UserModelLocalPostgres implements IUserModel {
  getAll = async (): Promise<IUserPrivate[]> => {
    const result = await pool.query(querySelectUser())
    return result.rows.map((row) => {
      const userResult = BDService.getObjectFromTable(ETablas.User, row)
      return userPrivateSchema.parse(userResult)
    })
  }

  getById = async (id: string): Promise<IUserPrivate | undefined> => {
    const table = ETablas.User
    const mapTable = TablasMap[table].map
    if (mapTable.id == null) return undefined

    const result = await pool.query(`${querySelectUser()} WHERE ${mapTable.id} = $1`, [id])
    if (result.rowCount == null || result.rowCount === 0) return undefined

    const userResult = BDService.getObjectFromTable(ETablas.User, result.rows[0])
    return userPrivateSchema.parse(userResult)
  }

  getByUsername = async (username: string): Promise<IUserPrivate | undefined> => {
    const table = ETablas.User
    const mapTable = TablasMap[table].map
    if (mapTable.username == null) return undefined

    const result = await pool.query(`${querySelectUser()} WHERE ${mapTable.username} = $1`, [username])
    if (result.rowCount == null || result.rowCount === 0) return undefined

    const userResult = BDService.getObjectFromTable(ETablas.User, result.rows[0])
    return userPrivateSchema.parse(userResult)
  }

  getByUsernameForLogin = async (username: string): Promise<IUser | undefined> => {
    const table = ETablas.User
    const mapTable = TablasMap[table].map
    if (mapTable.username == null) return undefined

    const result = await pool.query(`${querySelectUser()} WHERE ${mapTable.username} = $1`, [username])
    if (result.rowCount == null || result.rowCount === 0) return undefined

    const userResult = BDService.getObjectFromTable(ETablas.User, result.rows[0])
    return userSchema.parse(userResult)
  }

  create = async (user: ICreateUser): Promise<IUserPrivate> => {
    const newUser: IUser = {
      ...user,
      id: randomUUID()
    }

    const dataInsert = BDService.queryInsert<IUser>(ETablas.User, newUser)

    const result = await pool.query(dataInsert.query, dataInsert.values)
    if (result == null || result.rowCount === 0) throw new Error('Error al crear el usuario')
    return newUser
  }
}
