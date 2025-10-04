import jwt, { SignOptions } from 'jsonwebtoken'
import { config } from '../config/env'
import { ECookie } from '../types/enums'
import { TokenPerExpiresIn } from '../config/cookie'

export const jwtService = {
  generateToken: (payload: object, typeToken: ECookie) => {
    if (payload == null || config.jwtSecret === '') return ''
    const options: SignOptions = { expiresIn: TokenPerExpiresIn[typeToken] }
    return jwt.sign(payload, config.jwtSecret, options)
  },
  verifyToken: (token: string) => {
    return jwt.verify(token, config.jwtSecret)
  }
}
