import {
  ICatalogueInfo,
  ICatalogueInfoDelete,
  ICatalogueInfoUpdate,
  ICatalogueInfoUpdateParams,
} from '../contract/catalogue'
import { IFindParams } from '../contract/common'
import { httpClient } from './httpClient'

export const getAllCatalogues = async (params: IFindParams): Promise<ICatalogueInfo[]> => {
  const result = await httpClient.get<ICatalogueInfo[]>(`/catalogue/info`, params)
  return result
}

export const getCatalogueById = async (catalogueId: number): Promise<ICatalogueInfo> => {
  const result = await httpClient.get<ICatalogueInfo>(`/catalogue/info/${catalogueId}`)
  return result
}

export const updateCatalogue = async (
  catalogueId: number | null,
  params: ICatalogueInfoUpdateParams
): Promise<ICatalogueInfoUpdate> => {
  const result = await httpClient.post<ICatalogueInfoUpdate>(
    `/catalogue/info${catalogueId ? `/${catalogueId}` : ''}`,
    params
  )
  return result
}

export const deleteCatalogue = async (catalogueId: number): Promise<ICatalogueInfoDelete> => {
  const result = await httpClient.delete<ICatalogueInfoDelete>(`/catalogue/info/${catalogueId}`)
  return result
}

export const searchCatalogueByName = async (query: string, params: IFindParams): Promise<ICatalogueInfo[]> => {
  const result = await httpClient.get<ICatalogueInfo[]>(`/catalogue/info/search/${query}`, params)
  return result
}
