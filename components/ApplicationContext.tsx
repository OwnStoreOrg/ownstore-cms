import React from 'react'
import { SCREEN_SIZE } from '../constants/constants'

export type DEVICE_PROFILE = keyof typeof SCREEN_SIZE

export enum LoginStateType {
  NONE = 'NONE',
  LOGGED_IN = 'LOGGED_IN',
  LOGGED_OUT = 'LOGGED_OUT',
}

export interface IDeviceInfo {
  isDesktop: boolean
  isMobile: boolean

  isTouchDevice: boolean
  isLandscapeMode: boolean

  profile: DEVICE_PROFILE

  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
  is2Xl: boolean
}

export interface IApplicationContextProps {
  loginState: LoginStateType
  isLoggedIn: boolean

  device: IDeviceInfo

  updaters: {
    updateLoginState: (val: LoginStateType) => void
  }

  logout: () => void
}

export const defaultApplicationContext: IApplicationContextProps = {
  loginState: LoginStateType.NONE,
  isLoggedIn: false,

  device: {
    isDesktop: true,
    isMobile: true,

    isTouchDevice: false,
    isLandscapeMode: false,

    profile: 'XL',

    isSm: true,
    isMd: false,
    isLg: false,
    isXl: false,
    is2Xl: false,
  },

  updaters: {
    updateLoginState: val => null,
  },

  logout: () => null,
}

const ApplicationContext = React.createContext<IApplicationContextProps>(defaultApplicationContext)

export default ApplicationContext
