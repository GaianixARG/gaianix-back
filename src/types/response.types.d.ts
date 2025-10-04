import { Response } from "express"
import { EHttpStatusCode } from "./enums"

export interface IResponseData {
    exito: boolean,
    message?: string,
    data?: object
}