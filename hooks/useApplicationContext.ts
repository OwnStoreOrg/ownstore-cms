import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getDeviceInfo } from '../utils/applicationContext'
import { deleteAdminAuthToken, getAdminAuthToken } from '../utils/admin'
import useApplicationContextReducer from './useApplicationContextReducer'
import useOrientation from './useOrientation'
import { isAdminVerified } from '../http/auth'
import { LoginStateType } from '../components/ApplicationContext'
import { getHomePageUrl } from '../utils/home'
import { getLoginPageUrl } from '../utils/login'

const useApplicationContext = () => {
  const { applicationContext, dispatchApplicationContext } = useApplicationContextReducer()
  const router = useRouter()

  const { isLandscapeMode } = useOrientation()

  const updateLoginState = (val: LoginStateType): void => {
    dispatchApplicationContext({
      type: 'UPDATE_LOGIN_STATE',
      payload: val,
    })
  }

  useEffect(() => {
    dispatchApplicationContext({
      type: 'UPDATE_DEVICE',
      payload: getDeviceInfo(),
    })
  }, [isLandscapeMode])

  useEffect(() => {
    const authToken = getAdminAuthToken()

    if (authToken) {
      isAdminVerified()
        .then(resp => {
          updateLoginState(LoginStateType.LOGGED_IN)
        })
        .catch(e => {
          console.error(e)
          updateLoginState(LoginStateType.LOGGED_OUT)
        })
    } else {
      updateLoginState(LoginStateType.LOGGED_OUT)
    }
  }, [])

  const logout = () => {
    deleteAdminAuthToken()
    updateLoginState(LoginStateType.LOGGED_OUT)
  }

  applicationContext.updaters = {
    updateLoginState: updateLoginState,
  }

  applicationContext.logout = logout

  return {
    applicationContext,
    dispatchApplicationContext,
  }
}

export default useApplicationContext
