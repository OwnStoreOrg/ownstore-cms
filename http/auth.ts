import { IAdminVerified, IAdminVerify, IAdminVerifyParams } from '../contract/admin'
import { httpClient } from './httpClient'

export const verifyAdmin = async (params: IAdminVerifyParams): Promise<IAdminVerify> => {
  const result = await httpClient.post<IAdminVerify>(`/admin/verify`, params)
  return result
}

export const isAdminVerified = async (): Promise<IAdminVerified> => {
  const result = await httpClient.get<IAdminVerified>(`/admin/is-verified`)
  return result
}
