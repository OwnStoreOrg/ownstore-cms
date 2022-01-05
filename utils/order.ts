export const getRecentOrdersPageUrl = () => {
  return '/recent-orders'
}

export const getOrderPageUrl = (id: number) => {
  return `/order?id=${id}`
}

export const getOrderUpdatePageUrl = (id: number) => {
  return `/order/update?id=${id}`
}

export const getOrderStatusPageUrl = () => {
  return '/order-status-type'
}

export const getOrderStatusUpdatePageUrl = (id?: number) => {
  return `/order-status-type/update${id ? `?id=${id}` : ''}`
}
