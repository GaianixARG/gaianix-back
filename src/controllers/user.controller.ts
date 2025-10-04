import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { jwtService } from '../services/jwt.services'
import responseData, { sendData } from './response.controller'
import { ECookie, EHttpStatusCode } from '../types/enums'
import { getValidatedBody } from '../middlewares/validateBody'
import { ICreateUser, ILoginUser } from '../schemas/user.schema'
import { getConfigCookie } from '../config/cookie'
import { getUserSession } from '../middlewares/auth'
import { IUserModel } from '../models/definitions/users.models'

export interface IUserController {
  userModel: IUserModel
}

export class UserController {
  models: IUserController
  constructor (models: IUserController) {
    this.models = models
  }

  login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = getValidatedBody<ILoginUser>(req)
    try {
      const user = await this.models.userModel.getByUsernameForLogin(username)
      if (user == null) throw new Error('Credenciales inválidas')

      const isValid = bcrypt.compareSync(password, user.password)
      if (!isValid) throw new Error('Credenciales inválidas')

      const { password: passwordRest, ...restOfUser } = user

      const accessToken = jwtService.generateToken({ id: user.id, username: user.username, role: user.role }, ECookie.ACCESS_TOKEN)
      // const refresh_token = jwtService.generateToken({ id: user.id, username: user.username, role: user.role }, ECookie.REFRESH_TOKEN)

      res
        .cookie(ECookie.ACCESS_TOKEN, accessToken, getConfigCookie(ECookie.ACCESS_TOKEN))
        // .cookie(ECookie.REFRESH_TOKEN, refresh_token, getConfigCookie(ECookie.REFRESH_TOKEN))
        .send({ exito: true, data: { accessToken, user: restOfUser } })
    } catch (error) {
      console.log(error)
      responseData(res,
        EHttpStatusCode.UNAUTHORIZED,
        { message: 'Credenciales inválidas', exito: false }
      )
    }
  }

  logout = (_req: Request, res: Response): void => {
    res.clearCookie(ECookie.ACCESS_TOKEN).send(
      { message: 'Logout exitoso (borrar token en cliente) }', exito: true })
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const body = getValidatedBody<ICreateUser>(req)
    const userExistente = await this.models.userModel.getByUsername(body.username)
    if (userExistente != null) {
      sendData(res, EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Ya existe un usuario con el mismo nombre' })
      return
    }

    const newUser = await this.models.userModel.create(body)
    sendData(res,
      EHttpStatusCode.OK_CREATED,
      {
        exito: true,
        data: newUser
      }
    )
  }

  me = async (req: Request, res: Response): Promise<void> => {
    const session = getUserSession(req)
    const user = await this.models.userModel.getById(session.id)
    sendData(res, EHttpStatusCode.OK, {
      exito: true,
      data: user
    })
  }
}
