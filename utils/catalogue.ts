export const getCataloguePageUrl = () => {
  return '/catalogue'
}

export const getCatalogueUpdatePageUrl = (id?: number) => {
  return `/catalogue/update${id ? `?id=${id}` : ''}`
}

export const getCatalogueImagesPageUrl = (id: number) => {
  return `/catalogue/images?id=${id}`
}

export const getCatalogueSearchPageUrl = () => {
  return '/catalogue/search'
}
