import usersData from '../../data/users.json'
import { ICreateUser, IUser, IUserPrivate } from '../../schemas/user.schema'
import { IUserModel } from '../definitions/users.models'

const users: IUser[] = usersData as IUser[]

export class UserModelFileSystem implements IUserModel {
  getAll = async (): Promise<IUserPrivate[]> => users.map(x => {
    const { password, ...restOfUser } = x
    return restOfUser
  })

  getById = async (id: string): Promise<IUserPrivate | undefined> => {
    const user = users.find(x => x.id === id)
    if (user == null) return undefined
    const { password, ...restOfUser } = user
    return restOfUser
  }

  getByUsername = async (username: string): Promise<IUserPrivate | undefined> => {
    const user = users.find(x => x.username === username)
    if (user == null) return undefined
    const { password, ...restOfUser } = user
    return restOfUser
  }

  getByUsernameForLogin = async (username: string): Promise<IUser | undefined> => users.find(x => x.username === username)

  create = async (user: ICreateUser): Promise<IUserPrivate> => {
    const newUser = {
      id: 'asdasd',
      ...user
    }
    users.push(newUser)
    return newUser
  }
}
