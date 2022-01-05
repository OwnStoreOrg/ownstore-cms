import { IStaticPageDetail, IStaticPageUpdate, IStaticPageUpdateParams } from '../contract/staticPage'
import { httpClient } from './httpClient'

export const getPrivacyPolicyDetail = async (): Promise<IStaticPageDetail> => {
  const result = await httpClient.get<IStaticPageDetail>(`/privacy-policy/detail`)
  return result
}

export const updatePrivacyPolicyDetail = async (params: IStaticPageUpdateParams): Promise<IStaticPageUpdate> => {
  const result = await httpClient.post<IStaticPageUpdate>(`/privacy-policy/detail`, params)
  return result
}
