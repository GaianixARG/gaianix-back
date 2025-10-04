import { Response } from 'express'
import { EHttpStatusCode } from '../types/enums'
import { IResponseData } from '../types/response.types'

export const sendData = (response: Response, status: EHttpStatusCode, data: IResponseData): Response<any, Record<string, any>> => {
  return response.status(status).send(data)
}

export default sendData
