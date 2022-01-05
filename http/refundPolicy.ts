import { IStaticPageDetail, IStaticPageUpdate, IStaticPageUpdateParams } from '../contract/staticPage'
import { httpClient } from './httpClient'

export const getRefundPolicyDetail = async (): Promise<IStaticPageDetail> => {
  const result = await httpClient.get<IStaticPageDetail>(`/refund-policy/detail`)
  return result
}

export const updateRefundPolicyDetail = async (params: IStaticPageUpdateParams): Promise<IStaticPageUpdate> => {
  const result = await httpClient.post<IStaticPageUpdate>(`/refund-policy/detail`, params)
  return result
}
