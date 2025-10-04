import { Request, Response, NextFunction } from 'express'
import { jwtService } from '../services/jwt.services'
import sendData from '../controllers/response.controller'
import { ECookie, EHttpStatusCode } from '../types/enums'
import { IUserPrivate } from '../schemas/user.schema'

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const accessToken = req.cookies[ECookie.ACCESS_TOKEN]

  if (accessToken === null) {
    sendData(res, EHttpStatusCode.UNAUTHORIZED, { message: 'Token requerido', exito: false })
    return
  }
  (req as any).session = { user: null }

  try {
    (req as any).session.user = jwtService.verifyToken(accessToken)
    next()
  } catch (err) {
    sendData(res, EHttpStatusCode.UNAUTHORIZED, { message: 'Token inválido o expirado', exito: false })
  }
}

export const getUserSession = (req: Request): IUserPrivate => {
  return (req as any).session.user as IUserPrivate
}
