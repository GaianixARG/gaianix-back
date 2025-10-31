import { CookieOptions } from 'express'
import { ECookie } from '../types/enums'
import { config } from './env'

// EN MS
const CookiePerMaxAge: Record<ECookie, number> = {
  [ECookie.ACCESS_TOKEN]: 1000 * 60 * 60, // valido una hora (ms)
  [ECookie.REFRESH_TOKEN]: 1000 * 60 * 60 * 24 * 7 // valido 7 dias (ms)
}

// EN SEGUNDOS
export const TokenPerExpiresIn: Record<ECookie, number> = {
  [ECookie.ACCESS_TOKEN]: 60 * 60, // valido una hora. (s)
  [ECookie.REFRESH_TOKEN]: 60 * 60 * 24 * 7 // valido 7 dias (s)
}

export const getConfigCookie = (cookie: ECookie): CookieOptions => {
  return {
    httpOnly: true, // solo se puede acceder desde el servidor
    secure: config.nodeEnv === 'production', // solo se puede acceder en HTTPS
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax', // solo accesible en el mismo dominio
    maxAge: CookiePerMaxAge[cookie]
  }
}
