import { IStaticPageDetail, IStaticPageUpdate, IStaticPageUpdateParams } from '../contract/staticPage'
import { httpClient } from './httpClient'

export const getShippingPolicyDetail = async (): Promise<IStaticPageDetail> => {
  const result = await httpClient.get<IStaticPageDetail>(`/shipping-policy/detail`)
  return result
}

export const updateShippingPolicyDetail = async (params: IStaticPageUpdateParams): Promise<IStaticPageUpdate> => {
  const result = await httpClient.post<IStaticPageUpdate>(`/shipping-policy/detail`, params)
  return result
}
