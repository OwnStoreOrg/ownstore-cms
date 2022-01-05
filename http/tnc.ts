import { IStaticPageDetail, IStaticPageUpdate, IStaticPageUpdateParams } from '../contract/staticPage'
import { httpClient } from './httpClient'

export const getTnCDetail = async (): Promise<IStaticPageDetail> => {
  const result = await httpClient.get<IStaticPageDetail>(`/tnc/detail`)
  return result
}

export const updateTnCDetail = async (params: IStaticPageUpdateParams): Promise<IStaticPageUpdate> => {
  const result = await httpClient.post<IStaticPageUpdate>(`/tnc/detail`, params)
  return result
}
