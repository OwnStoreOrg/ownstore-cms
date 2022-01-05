export const getFAQTopicPageUrl = () => {
  return '/faq-topic'
}

export const getFAQTopicUpdatePageUrl = (id?: number) => {
  return `/faq-topic/update${id ? `?id=${id}` : ''}`
}

export const getFAQPageUrl = (topicId: number) => {
  return `/faq-topic/${topicId}`
}

export const getFAQUpdatePageUrl = (topicId: number, id?: number) => {
  return `/faq-topic/${topicId}/update${id ? `?id=${id}` : ''}`
}
