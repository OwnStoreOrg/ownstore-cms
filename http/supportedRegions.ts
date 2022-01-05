import { SupportedRegionType } from '../contract/constants'
import {
  ISupportedRegionsInfo,
  ISupportedRegionInfoUpdateParams,
  ISupportedRegionInfoUpdate,
  ISupportedRegionInfoDelete,
  ISupportedRegionInfo,
} from '../contract/supportedRegions'
import { httpClient } from './httpClient'

export const getSupportedRegions = async (): Promise<ISupportedRegionsInfo> => {
  const result = await httpClient.get<ISupportedRegionsInfo>(`/supported-region/info`)
  return result
}

export const getSupportedRegionById = async (
  supportedRegionId: number,
  supportedRegionType: SupportedRegionType
): Promise<ISupportedRegionInfo> => {
  const result = await httpClient.get<ISupportedRegionInfo>(
    `/supported-region/type/${supportedRegionType}/info/${supportedRegionId}`
  )
  return result
}

export const updateSupportedRegion = async (
  supportedRegionId: number | null,
  supportedRegionType: SupportedRegionType,
  params: ISupportedRegionInfoUpdateParams
): Promise<ISupportedRegionInfoUpdate> => {
  const result = await httpClient.post<ISupportedRegionInfoUpdate>(
    `/supported-region/type/${supportedRegionType}/info/${supportedRegionId}`,
    params
  )
  return result
}

export const deleteSupportedRegion = async (
  supportedRegionId: number | null,
  supportedRegionType: SupportedRegionType
): Promise<ISupportedRegionInfoDelete> => {
  const result = await httpClient.delete<ISupportedRegionInfoDelete>(
    `/supported-region/type/${supportedRegionType}/info/${supportedRegionId}`
  )
  return result
}
