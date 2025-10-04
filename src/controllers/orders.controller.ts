import { Request, Response } from 'express'
import { IOrder, ICreateOrder } from '../schemas/order.schema'
import sendData from './response.controller'
import { EHttpStatusCode } from '../types/enums'
import { getValidatedBody } from '../middlewares/validateBody'
import { getUserSession } from '../middlewares/auth'
import { IOrderModel } from '../models/definitions/orders.models'
import { IUserModel } from '../models/definitions/users.models'

export interface IOrderController {
  orderModel: IOrderModel
  userModel: IUserModel
}

export class OrderController {
  models: IOrderController

  constructor (models: IOrderController) {
    this.models = models
  }

  getOrders = async (_req: Request, res: Response): Promise<void> => {
    let orders: IOrder[] = []
    let exito: boolean = true
    try {
      orders = await this.models.orderModel.getAll()
    } catch (err) {
      exito = false
      console.log(err)
    } finally {
      sendData(res, EHttpStatusCode.OK, { exito, data: orders })
    }
  }

  getOrderById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id
    let order: IOrder | undefined
    let exito: boolean = true
    try {
      order = await this.models.orderModel.getById(id)
      if (order == null) exito = false
    } catch (err) {
      exito = false
      console.log(err)
    } finally {
      const status = exito ? EHttpStatusCode.OK : EHttpStatusCode.NOT_FOUND
      sendData(res, status, { exito: true, data: order })
    }
  }

  createOrder = async (req: Request, res: Response): Promise<void> => {
    const bodyOrder = getValidatedBody<ICreateOrder>(req)
    const userSession = getUserSession(req)
    const user = await this.models.userModel.getById(userSession.id)
    if (user == null) {
      sendData(res, EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Usuario inexistente' })
      return
    }

    const newOrder = await this.models.orderModel.create(bodyOrder, user)
    sendData(res, EHttpStatusCode.OK_CREATED, { exito: true, data: newOrder })
  }
}
