import { SupportedRegionType } from '../contract/constants'

export const getSupportedRegionsPageUrl = () => {
  return '/supported-regions'
}
export const getSupportedRegionsUpdatePageUrl = (supportedRegionType: SupportedRegionType, id?: number) => {
  return `/supported-regions/${supportedRegionType}/update${id ? `?id=${id}` : ''}`
}
