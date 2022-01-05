import appConfig from '../config/appConfig'
import cookie from 'js-cookie'

const authTokenKey = `${appConfig.global.app.key}-AUTH-TOKEN`

export const getAdminAuthToken = (): string | null => {
  return localStorage.getItem(authTokenKey)
}

export const setAdminAuthToken = (authToken: string) => {
  localStorage.setItem(authTokenKey, authToken)
}

export const deleteAdminAuthToken = () => {
  localStorage.removeItem(authTokenKey)
}
