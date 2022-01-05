import { IFindParams } from '../contract/common'
import {
  IComboProductDetail,
  IComboProductDetailDelete,
  IComboProductDetailDeleteParams,
  IComboProductDetailUpdate,
  IComboProductDetailUpdateParams,
  IComboProductInfo,
  IIndividualProductDetail,
  IIndividualProductDetailDelete,
  IIndividualProductDetailDeleteParams,
  IIndividualProductDetailUpdate,
  IIndividualProductDetailUpdateParams,
  IIndividualProductInfo,
  IProductAttributeKeyInfo,
  IProductAttributeKeyInfoDelete,
  IProductAttributeKeyInfoUpdate,
  IProductAttributeKeyInfoUpdateParams,
  IProductBrandInfo,
  IProductBrandInfoDelete,
  IProductBrandInfoUpdate,
  IProductBrandInfoUpdateParams,
  IProductInfo,
  IProductsRelationInfo,
  IProductsRelationInfoDelete,
  IProductsRelationInfoUpdate,
  IProductsRelationInfoUpdateParams,
} from '../contract/product'
import { httpClient } from './httpClient'

export const getAllProductBrands = async (params: IFindParams): Promise<IProductBrandInfo[]> => {
  const result = await httpClient.get<IProductBrandInfo[]>(`/product/element/brand/info`, params)
  return result
}

export const getProductBrandById = async (brandId: number): Promise<IProductBrandInfo> => {
  const result = await httpClient.get<IProductBrandInfo>(`/product/element/brand/info/${brandId}`)
  return result
}

export const updateProductBrand = async (
  brandId: number | null,
  params: IProductBrandInfoUpdateParams
): Promise<IProductBrandInfoUpdate> => {
  const result = await httpClient.post<IProductBrandInfoUpdate>(
    `/product/element/brand/info${brandId ? `/${brandId}` : ''}`,
    params
  )
  return result
}

export const deleteProductBrand = async (brandId: number): Promise<IProductBrandInfoDelete> => {
  const result = await httpClient.delete<IProductBrandInfoDelete>(`/product/element/brand/info/${brandId}`)
  return result
}

export const getAllProductAttributeKeys = async (params: IFindParams): Promise<IProductAttributeKeyInfo[]> => {
  const result = await httpClient.get<IProductAttributeKeyInfo[]>(`/product/element/attribute-key/info`, params)
  return result
}

export const getProductAttributeKeyById = async (brandId: number): Promise<IProductAttributeKeyInfo> => {
  const result = await httpClient.get<IProductAttributeKeyInfo>(`/product/element/attribute-key/info/${brandId}`)
  return result
}

export const updateProductAttributeKey = async (
  brandId: number | null,
  params: IProductAttributeKeyInfoUpdateParams
): Promise<IProductAttributeKeyInfoUpdate> => {
  const result = await httpClient.post<IProductAttributeKeyInfoUpdate>(
    `/product/element/attribute-key/info${brandId ? `/${brandId}` : ''}`,
    params
  )
  return result
}

export const deleteProductAttributeKey = async (brandId: number): Promise<IProductAttributeKeyInfoDelete> => {
  const result = await httpClient.delete<IProductAttributeKeyInfoDelete>(
    `/product/element/attribute-key/info/${brandId}`
  )
  return result
}

export const getAllProductsRelations = async (params: IFindParams): Promise<IProductsRelationInfo[]> => {
  const result = await httpClient.get<IProductsRelationInfo[]>(`/product/element/relation/info`, params)
  return result
}

export const getProductsRelationById = async (brandId: number): Promise<IProductsRelationInfo> => {
  const result = await httpClient.get<IProductsRelationInfo>(`/product/element/relation/info/${brandId}`)
  return result
}

export const updateProductsRelation = async (
  relationId: number | null,
  params: IProductsRelationInfoUpdateParams
): Promise<IProductsRelationInfoUpdate> => {
  const result = await httpClient.post<IProductsRelationInfoUpdate>(
    `/product/element/relation/info${relationId ? `/${relationId}` : ''}`,
    params
  )
  return result
}

export const deleteProductsRelation = async (relationId: number): Promise<IProductsRelationInfoDelete> => {
  const result = await httpClient.delete<IProductsRelationInfoDelete>(`/product/element/relation/info/${relationId}`)
  return result
}

export const getAllIndividualProducts = async (params: IFindParams): Promise<IIndividualProductInfo[]> => {
  const result = await httpClient.get<IIndividualProductInfo[]>(`/product/individual/info`, params)
  return result
}

export const getIndividualProductDetail = async (id: number): Promise<IIndividualProductDetail> => {
  const result = await httpClient.get<IIndividualProductDetail>(`/product/individual/detail/${id}`)
  return result
}

export const updateIndividualProductDetail = async (
  id: number | null,
  params: IIndividualProductDetailUpdateParams
): Promise<IIndividualProductDetailUpdate> => {
  const result = await httpClient.post<IIndividualProductDetailUpdate>(
    `/product/individual/detail${id ? `/${id}` : ''}`,
    params
  )
  return result
}

export const deleteIndividualProductDetail = async (
  id: number,
  params: IIndividualProductDetailDeleteParams
): Promise<IIndividualProductDetailDelete> => {
  const result = await httpClient.delete<IIndividualProductDetailDelete>(`/product/individual/detail/${id}`, params)
  return result
}

export const searchIndividualProductByName = async (
  query: string,
  params: IFindParams
): Promise<IIndividualProductInfo[]> => {
  const result = await httpClient.get<IIndividualProductInfo[]>(`/product/individual/info/search/${query}`, params)
  return result
}

export const getAllComboProducts = async (params: IFindParams): Promise<IComboProductInfo[]> => {
  const result = await httpClient.get<IComboProductInfo[]>(`/product/combo/info`, params)
  return result
}

export const getComboProductDetail = async (id: number): Promise<IComboProductDetail> => {
  const result = await httpClient.get<IComboProductDetail>(`/product/combo/detail/${id}`)
  return result
}

export const updateComboProductDetail = async (
  id: number | null,
  params: IComboProductDetailUpdateParams
): Promise<IComboProductDetailUpdate> => {
  const result = await httpClient.post<IComboProductDetailUpdate>(`/product/combo/detail${id ? `/${id}` : ''}`, params)
  return result
}

export const deleteComboProductDetail = async (
  id: number,
  params: IComboProductDetailDeleteParams
): Promise<IComboProductDetailDelete> => {
  const result = await httpClient.delete<IComboProductDetailDelete>(`/product/combo/detail/${id}`, params)
  return result
}

export const searchComboProductByName = async (query: string, params: IFindParams): Promise<IComboProductInfo[]> => {
  const result = await httpClient.get<IComboProductInfo[]>(`/product/combo/info/search/${query}`, params)
  return result
}
