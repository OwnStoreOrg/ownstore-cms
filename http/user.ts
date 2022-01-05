import { IFindParams } from '../contract/common'
import {
  IUserDetail,
  IUserGlobalDetail,
  IUserGlobalDetailParams,
  IUserInfo,
  IUserInfoUpdate,
  IUserInfoUpdateParams,
  IUserLoginAttributesInfo,
} from '../contract/user'
import { httpClient } from './httpClient'

export const getAllUsers = async (params: IFindParams): Promise<IUserInfo[]> => {
  const result = await httpClient.get<IUserInfo[]>(`/user/info`, params)
  return result
}

export const getUserGlobalDetail = async (
  userId: number,
  params: IUserGlobalDetailParams
): Promise<IUserGlobalDetail> => {
  const result = await httpClient.get<IUserGlobalDetail>(`/user/${userId}/detail/global`, params)
  return result
}

export const searchUserByName = async (query: string, params: IFindParams): Promise<IUserInfo[]> => {
  const result = await httpClient.get<IUserInfo[]>(`/user/info/search/${query}`, params)
  return result
}

export const updateUserInfo = async (userId: number, params: IUserInfoUpdateParams): Promise<IUserInfoUpdate> => {
  const result = await httpClient.put<IUserInfoUpdate>(`/user/${userId}/info`, params)
  return result
}

export const getUserLoginHistory = async (userId: number, params: IFindParams): Promise<IUserLoginAttributesInfo[]> => {
  const result = await httpClient.get<IUserLoginAttributesInfo[]>(`/user/${userId}/login-history/info`, params)
  return result
}
