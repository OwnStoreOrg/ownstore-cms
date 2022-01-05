import { ImageSourceType } from '../components/core/CoreImage'
import appConfig from '../config/appConfig'

export const prepareImageUrl = (urlPath: string, source: ImageSourceType): string => {
  if (source === ImageSourceType.CLOUD) {
    return `${appConfig.global.imageBaseUrl}${urlPath || ''}`
  }
  if (source === ImageSourceType.ASSET) {
    return urlPath
  }
  return urlPath
}

export const getImagePageUrl = () => {
  return '/image'
}

export const getImageUpdatePageUrl = (id?: number) => {
  return `/image/update${id ? `?id=${id}` : ''}`
}

export const getImageSearchPageUrl = () => {
  return '/image/search'
}
