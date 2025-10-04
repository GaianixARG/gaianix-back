import { ICreateUser, IUser, IUserPrivate } from '../../schemas/user.schema'

export interface IUserModel {
  getAll: () => Promise<IUserPrivate[]>
  getById: (id: string) => Promise<IUserPrivate | undefined>
  getByUsername: (username: string) => Promise<IUserPrivate | undefined>
  getByUsernameForLogin: (username: string) => Promise<IUser | undefined>
  create: (user: ICreateUser) => Promise<IUserPrivate>
}
