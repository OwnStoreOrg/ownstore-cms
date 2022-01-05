import { ImageSourceType } from '../components/core/CoreImage'
import { IPageSummaryInfo } from '../components/layout/PageLayout'
import appConfig from '../config/appConfig'
import { prepareImageUrl } from '../utils/image'

export const SCREEN_SIZE = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
}

export const APP_LOGO = prepareImageUrl(`/images/logo.png`, ImageSourceType.ASSET)

export const REGEX_MAP = {
  NAME: /^[^0-9]{3,50}$/,
  EMAIL:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  PASSWORD: /^[a-zA-Z0-9]{3,30}$/,
  PHONE_NUMBER: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
  ADDRESS_LINE: /^.{1,100}$/,
  NOT_EMPTY: /(.|\s)*\S(.|\s)*/,
  ADDRESS_TYPE: /(HOME|WORK|OTHER)/,
}

export const PAGE_SUMMARY: Record<string, IPageSummaryInfo> = {
  SUPPORTED_REGIONS: {
    pageUrl: '',
    description: `Regions supported by the app. You can add countries and/or cities. Add cities if only a selected part of a
  country is spoorted. For eg. Let's say you want to accept orders only from Mumbai, then add India country and
  Mumbai city. Kindly make sure to add cities only of supported countries. There's no validation at system-level. `,
  },

  FAQ_TOPIC: {
    pageUrl: `${appConfig.global.webBaseUrl}/faq`,
    description: `Each FAQ has a topic. Select a topic first to add/update any child FAQ info.`,
  },

  FAQ: {
    pageUrl: `${appConfig.global.webBaseUrl}/faq/topic/{{FAQ_TOPIC_ID}}`,
    description: `Add/Update any FAQ info under topic Id {{FAQ_TOPIC_ID}}.`,
  },

  SECURITY_QUESTION: {
    pageUrl: '',
    description: `These are the questions shown to users when they try to protect their account.`,
  },

  CURRENCY: {
    pageUrl: '',
    description: `Currency supported by your app. Will used for product SKUs, payment, etc... You can add only 1.`,
  },

  PRIVACY_POLICY: {
    pageUrl: `${appConfig.global.webBaseUrl}/privacy-policy`,
    description: '',
  },

  TERMS_CONDITIONS: {
    pageUrl: `${appConfig.global.webBaseUrl}/terms-conditions`,
    description: '',
  },

  REFUND_POLICY: {
    pageUrl: `${appConfig.global.webBaseUrl}/refund-policy`,
    description: '',
  },
}
