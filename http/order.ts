import { IFindParams } from '../contract/common'
import {
  IOrderDetail,
  IOrderInfo,
  IOrderStatusInfo,
  IOrderStatusInfoDelete,
  IOrderStatusInfoUpdate,
  IOrderStatusInfoUpdateParams,
  IRefundOrderDetail,
  IRefundOrderDetailParams,
  IUpdateOrderInfo,
  IUpdateOrderInfoParams,
} from '../contract/order'
import { httpClient } from './httpClient'

export const getRecentOrders = async (params: IFindParams): Promise<IOrderInfo[]> => {
  const result = await httpClient.get<IOrderInfo[]>(`/order/recent/info`, params)
  return result
}

export const getOrderById = async (orderId: number): Promise<IOrderDetail> => {
  const result = await httpClient.get<IOrderDetail>(`/order/detail/${orderId}`)
  return result
}

export const updateOrder = async (orderId: number, params: IUpdateOrderInfoParams): Promise<IUpdateOrderInfo> => {
  const result = await httpClient.post<IUpdateOrderInfo>(`/order/info/${orderId}`, params)
  return result
}

export const refundUserOrder = async (
  userId: number,
  orderId: number,
  params: IRefundOrderDetailParams
): Promise<IRefundOrderDetail> => {
  const result = await httpClient.post<IRefundOrderDetail>(`/order/user/${userId}/detail/${orderId}/refund`, params)
  return result
}

export const getAllOrderStatus = async (): Promise<IOrderStatusInfo[]> => {
  const result = await httpClient.get<IOrderStatusInfo[]>(`/order/status/info`)
  return result
}

export const getOrderStatusById = async (statusId: number): Promise<IOrderStatusInfo> => {
  const result = await httpClient.get<IOrderStatusInfo>(`/order/status/info/${statusId}`)
  return result
}

export const updateOrderStatus = async (
  statusId: number | null,
  params: IOrderStatusInfoUpdateParams
): Promise<IOrderStatusInfoUpdate> => {
  const result = await httpClient.post<IOrderStatusInfoUpdate>(
    `/order/status/info${statusId ? `/${statusId}` : ''}`,
    params
  )
  return result
}

export const deleteOrderStatus = async (statusId: number): Promise<IOrderStatusInfoDelete> => {
  const result = await httpClient.delete<IOrderStatusInfoDelete>(`/order/status/info/${statusId}`)
  return result
}
