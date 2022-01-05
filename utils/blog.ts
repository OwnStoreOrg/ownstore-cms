export const getBlogPageUrl = () => {
  return '/blog'
}

export const getBlogSearchPageUrl = () => {
  return '/blog/search'
}

export const getBlogUpdatePageUrl = (id?: number) => {
  return `/blog/update${id ? `?id=${id}` : ''}`
}
