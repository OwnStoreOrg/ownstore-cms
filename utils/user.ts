export const getUserPageUrl = () => {
  return '/user'
}

export const getUserSearchPageUrl = () => {
  return '/user/search'
}

export const getUserDetailPageUrl = (id: number) => {
  return `/user/detail?id=${id}`
}

export const getUserAddressPageUrl = (id: number) => {
  return `/user/address?id=${id}`
}

export const getUserWishlistPageUrl = (id: number) => {
  return `/user/wishlist?id=${id}`
}

export const getUserCartPageUrl = (id: number) => {
  return `/user/cart?id=${id}`
}

export const getUserOrderPageUrl = (id: number) => {
  return `/user/order?id=${id}`
}

export const getUserLoginHistoryPageUrl = (id: number) => {
  return `/user/login-history?id=${id}`
}
