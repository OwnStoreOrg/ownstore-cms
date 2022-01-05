import { IFindParams } from '../contract/common'
import { IImageInfo, IImageInfoUpdate, IImageInfoUpdateParams } from '../contract/image'
import { httpClient } from './httpClient'

export const getAllImages = async (params: IFindParams): Promise<IImageInfo[]> => {
  const result = await httpClient.get<IImageInfo[]>(`/image/info`, params)
  return result
}

export const getImageById = async (imageId: number): Promise<IImageInfo> => {
  const result = await httpClient.get<IImageInfo>(`/image/info/${imageId}`)
  return result
}

export const updateImage = async (
  imageId: number | null,
  params: IImageInfoUpdateParams
): Promise<IImageInfoUpdate> => {
  const result = await httpClient.post<IImageInfoUpdate>(`/image/info${imageId ? `/${imageId}` : ''}`, params)
  return result
}

export const searchImageByName = async (query: string, params: IFindParams): Promise<IImageInfo[]> => {
  const result = await httpClient.get<IImageInfo[]>(`/image/info/search/${query}`, params)
  return result
}
