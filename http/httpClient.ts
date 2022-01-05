import debug from 'debug'
import appConfig from '../config/appConfig'
import ApiError, { ApiRequestParams } from '../error/ApiError'
import { deleteAdminAuthToken, getAdminAuthToken } from '../utils/admin'
import { isBrowser } from '../utils/common'
import { getHomePageUrl } from '../utils/home'
import { getLoginPageUrl } from '../utils/login'

declare let window: any

const log = debug('http')

const callApi = async <T>(requestParams: ApiRequestParams): Promise<T> => {
  const { method, path, data, headers } = requestParams

  const finalHeaders = headers || {}

  if (method !== 'get' && data) {
    finalHeaders['Content-Type'] = 'application/json'
  }

  if (isBrowser()) {
    const authToken = getAdminAuthToken()
    if (authToken) {
      finalHeaders['x-admin-access-token'] = authToken
    }
  }

  const options: any = {
    method,
    headers: finalHeaders,
  }

  let finalUrl = appConfig.global.apiBaseUrl + path

  if (method === 'get') {
    const queryParams = ['_cache=n']

    for (const key in data) {
      const value = data[key]

      if (Array.isArray(value)) {
        value.forEach(v => {
          queryParams.push(encodeURIComponent(key) + '=' + encodeURIComponent(v))
        })
      } else {
        queryParams.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
      }
    }
    finalUrl = `${finalUrl}?${queryParams.join('&')}`
  } else {
    options['body'] = JSON.stringify(data)
  }

  let response
  let responseBody

  try {
    response = await fetch(finalUrl, options)
  } catch (err) {
    throw new ApiError(requestParams, {
      status: 500,
      message: err.message,
      code: 'HTTP_CALL_FAILED',
      data: null,
    })
  }

  log(response.status, finalUrl)

  try {
    responseBody = await response.json().then(data => data as T)
  } catch (err) {
    throw new ApiError(requestParams, {
      status: response.status,
      message: `Error while parsing API response: ${err.message}`,
      code: 'INVALID_RESPONSE',
      data: null,
    })
  }

  if (response.status >= 200 && response.status < 300) {
    return responseBody
  }

  if (responseBody.code === 'INVALID_TOKEN') {
    window.APP.logout()
    window.location.href = `${getLoginPageUrl()}?backUrl=${window.location.pathname}${window.location.search}`
    return
  }

  throw new ApiError(requestParams, {
    status: response.status,
    message: responseBody.message,
    code: responseBody.code,
    data: responseBody.data,
  })
}

export const httpClient = {
  async get<T>(path: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    return callApi({
      method: 'get',
      path,
      data: params,
      headers,
    })
  },
  async post<T>(path: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    return callApi({
      method: 'post',
      path,
      data: params,
      headers,
    })
  },
  async put<T>(path: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    return callApi({
      method: 'put',
      path,
      data: params,
      headers,
    })
  },
  async delete<T>(path: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    return callApi({
      method: 'delete',
      path,
      data: params,
      headers,
    })
  },
}
