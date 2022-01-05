import { IComboProductInfo, IIndividualProductInfo, IProductInfo } from '../contract/product'

export const shouldDisableProduct = (productInfo: IProductInfo) => {
  const product = productInfo as IIndividualProductInfo | IComboProductInfo
  return !product.isActive || product.sku.availableQuantity < 1 || product.sku.comingSoon
}

// product items
export const getProductBrandPageUrl = () => {
  return '/product-brand'
}

export const getProductBrandUpdatePageUrl = (id?: number) => {
  return `/product-brand/update${id ? `?id=${id}` : ''}`
}

export const getProductAttributeKeyPageUrl = () => {
  return '/product-attribute-key'
}

export const getProductAttributeKeyUpdatePageUrl = (id?: number) => {
  return `/product-attribute-key/update${id ? `?id=${id}` : ''}`
}

export const getProductRelationsPageUrl = () => {
  return '/product-relations'
}

export const getProductRelationsUpdatePageUrl = (id?: number) => {
  return `/product-relations/update${id ? `?id=${id}` : ''}`
}

// individual products
export const getIndividualProductPageUrl = () => {
  return '/product/individual'
}

export const getIndividualProductSearchPageUrl = () => {
  return '/product/individual/search'
}

export const getIndividualProductUpdatePageUrl = (id?: number) => {
  return `/product/individual/update${id ? `?id=${id}` : ''}`
}

export const getIndividualProductSKUUpdatePageUrl = (id: number) => {
  return `/product/individual/update/sku?id=${id}`
}

export const getIndividualProductTagsUpdatePageUrl = (id: number) => {
  return `/product/individual/update/tags?id=${id}`
}

export const getIndividualProductAttributesUpdatePageUrl = (id: number) => {
  return `/product/individual/update/attributes?id=${id}`
}

export const getIndividualProductFeatureSectionsUpdatePageUrl = (id: number) => {
  return `/product/individual/update/feature-sections?id=${id}`
}

export const getIndividualProductImagesUpdatePageUrl = (id: number) => {
  return `/product/individual/update/images?id=${id}`
}

// combo products
export const getComboProductPageUrl = () => {
  return '/product/combo'
}

export const getComboProductSearchPageUrl = () => {
  return '/product/combo/search'
}

export const getComboProductUpdatePageUrl = (id?: number) => {
  return `/product/combo/update${id ? `?id=${id}` : ''}`
}

export const getComboProductSKUUpdatePageUrl = (id: number) => {
  return `/product/combo/update/sku?id=${id}`
}

export const getComboProductTagsUpdatePageUrl = (id: number) => {
  return `/product/combo/update/tags?id=${id}`
}

export const getComboProductAttributesUpdatePageUrl = (id: number) => {
  return `/product/combo/update/attributes?id=${id}`
}

export const getComboProductFeatureSectionsUpdatePageUrl = (id: number) => {
  return `/product/combo/update/feature-sections?id=${id}`
}

export const getComboProductImagesUpdatePageUrl = (id: number) => {
  return `/product/combo/update/images?id=${id}`
}
