import { ZodError, ZodType } from 'zod'
import { Request, Response, NextFunction } from 'express'
import { EHttpStatusCode } from '../types/enums'
import sendData from '../controllers/response.controller'

export const validateBody =
  <T extends ZodType>(schema: T) => (req: Request, res: Response, next: NextFunction) => {
    try {
      (req as any).validatedBody = schema.parse(req.body)

      next()
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => issue.path.join('.') + ' ' + issue.message)
        sendData(res, EHttpStatusCode.BAD_REQUEST, { message: `Datos incorrectos en ${errorMessages.join(' - ')}`, exito: false })
      } else {
        sendData(res, EHttpStatusCode.INTERNAL_SERVER_ERROR, { message: 'Internal Server Error', exito: false })
      }
    }
  }

export const getValidatedBody = <T extends {}>(req: Request): T => {
  return ((req as any).validatedBody as T)
}
