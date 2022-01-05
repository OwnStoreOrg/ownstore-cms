import { Dispatch, useEffect, useReducer, useState } from 'react'
import {
  defaultApplicationContext,
  IApplicationContextProps,
  IDeviceInfo,
  LoginStateType,
} from '../components/ApplicationContext'

export type ApplicationContextAction =
  | {
      type: 'UPDATE_DEVICE'
      payload: IDeviceInfo
    }
  | {
      type: 'UPDATE_LOGIN_STATE'
      payload: LoginStateType
    }
  | {
      type: 'RESET'
    }

const applicationReducer = (
  state: IApplicationContextProps,
  action: ApplicationContextAction
): IApplicationContextProps => {
  switch (action.type) {
    case 'UPDATE_DEVICE': {
      return {
        ...state,
        device: action.payload,
      }
    }

    case 'UPDATE_LOGIN_STATE': {
      return {
        ...state,
        loginState: action.payload,
      }
    }

    case 'RESET': {
      const { device } = state
      return {
        ...defaultApplicationContext,
        device: device,
      }
    }

    default:
      return state
  }
}

const useApplicationContextReducer = (): {
  applicationContext: IApplicationContextProps
  dispatchApplicationContext: Dispatch<ApplicationContextAction>
} => {
  const [applicationContext, dispatchApplicationContext] = useReducer(applicationReducer, defaultApplicationContext)

  return {
    applicationContext: {
      ...applicationContext,
      isLoggedIn: applicationContext.loginState === LoginStateType.LOGGED_IN,
    },
    dispatchApplicationContext,
  }
}

export default useApplicationContextReducer
