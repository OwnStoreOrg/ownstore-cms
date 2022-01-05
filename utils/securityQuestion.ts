export const getSecurityQuestionPageUrl = () => {
  return '/security-question'
}

export const getSecurityQuestionUpdatePageUrl = (id?: number) => {
  return `/security-question/update${id ? `?id=${id}` : ''}`
}
