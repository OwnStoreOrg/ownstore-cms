export const getCurrencyPageUrl = () => {
  return '/currency'
}

export const getCurrencyUpdatePageUrl = (id?: number) => {
  return `/currency/update${id ? `?id=${id}` : ''}`
}
