import { Request, Response } from 'express'
import { IOrder, ICreateOrder, IUpdateStatusOrder } from '../schemas/order.schema'
import sendData from './response.controller'
import { EHttpStatusCode, EOrderType } from '../types/enums'
import { getValidatedBody } from '../middlewares/validateBody'
import { getUserSession } from '../middlewares/auth'
import { IOrderModel } from '../models/definitions/orders.models'
import { IUserModel } from '../models/definitions/users.models'
import { ILoteModel } from '../models/definitions/lote.models'

export interface IOrderController {
  orderModel: IOrderModel
  userModel: IUserModel
  loteModel: ILoteModel
}

export class OrderController {
  models: IOrderController

  constructor (models: IOrderController) {
    this.models = models
  }

  getOrders = async (req: Request, res: Response): Promise<void> => {
    let orders: IOrder[] = []
    let exito: boolean = true
    try {
      const typeParam = req.query.type
      if (typeParam == null) orders = await this.models.orderModel.getAll()
      else {
        const type = typeParam as EOrderType
        orders = await this.models.orderModel.getByType(type)
      }
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

    try {
      const user = await this.models.userModel.getById(userSession.id)
      if (user == null) {
        sendData(res, EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Usuario inexistente' })
        return
      }

      const lote = await this.models.loteModel.getById(bodyOrder.lote.id)
      if (lote == null) {
        sendData(res, EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Debe seleccionar un lote' })
        return
      }

      const newOrder = await this.models.orderModel.create(bodyOrder, user, lote)
      sendData(res, EHttpStatusCode.OK_CREATED, { exito: true, data: newOrder })
    } catch (err) {
      console.log(err)
      sendData(res, EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Error al crear la orden' })
    }
  }

  updateOrder = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id
    const bodyOrder = getValidatedBody<IOrder>(req)

    let exito = true
    try {
      if (id !== bodyOrder.id) {
        sendData(res, EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Orden invalida' })
        return
      }

      const lote = await this.models.loteModel.getById(bodyOrder.lote.id)
      if (lote == null) {
        sendData(res, EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Debe seleccionar un lote' })
        return
      }

      const { codigo, dateOfCreation, creator, ...restOfOrder } = bodyOrder

      restOfOrder.lote = lote
      await this.models.orderModel.update(restOfOrder)
    } catch (error) {
      console.log(error)
      exito = false
    } finally {
      sendData(res,
        exito ? EHttpStatusCode.OK_NO_CONTENT : EHttpStatusCode.BAD_REQUEST,
        exito ? undefined : { exito, message: 'Error al editar la orden' }
      )
    }
  }

  updateStatusOrder = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id
    const bodyOrder = getValidatedBody<IUpdateStatusOrder>(req)

    let exito = true
    try {
      if (id !== bodyOrder.id) {
        sendData(res, EHttpStatusCode.BAD_REQUEST, { exito: false, message: 'Orden invalida' })
        return
      }
      await this.models.orderModel.updateStatus(bodyOrder.id, bodyOrder.status)
    } catch (error) {
      exito = false
    } finally {
      sendData(res,
        exito ? EHttpStatusCode.OK_NO_CONTENT : EHttpStatusCode.BAD_REQUEST,
        exito ? undefined : { exito, message: 'Error al actualizar el estado de la orden' }
      )
    }
  }

  removeOrder = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id

    let exito = true
    try {
      await this.models.orderModel.remove(id)
    } catch (error) {
      exito = false
      console.log(error)
    } finally {
      sendData(res,
        exito ? EHttpStatusCode.OK_NO_CONTENT : EHttpStatusCode.BAD_REQUEST,
        exito ? undefined : { exito, message: 'Error al eliminar la orden' }
      )
    }
  }
}
