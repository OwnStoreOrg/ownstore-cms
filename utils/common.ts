import { NextRouter, Router } from 'next/router'
import appConfig from '../config/appConfig'
import { IFindParams } from '../contract/common'

export const isBrowser = (): boolean => {
  return typeof window !== 'undefined'
}

export const isEmptyObject = (object: object) => Object.keys(object).length === 0

// Ref: last comment on this page: https://bugs.webkit.org/show_bug.cgi?id=153852#c43
export const disablePageScrolling = () => {
  const body = document.body
  document.body.style.overflow = 'hidden'
  const offsetY = window.pageYOffset
  body.style.top = `${-offsetY}px`
  body.style.width = '100vw'
  body.classList.add('js-modal-lock-position')
}

export const enablePageScrolling = () => {
  const body = document.body
  body.style.overflow = 'auto'
  const top = Number(body.style.top.replace('px', '')) || 0
  const offsetY = Math.abs(top)
  body.classList.remove('js-modal-lock-position')
  body.style.removeProperty('top')
  body.style.removeProperty('width')
  window.scrollTo(0, offsetY || 0)
}

export const addBlur = () => {
  const pageWrapper = document.getElementById('pageMain')
  const topNav = document.querySelector('.top-nav')

  const elements = [pageWrapper, topNav].filter(Boolean)

  elements.forEach(element => {
    element.classList.remove('no-blur')
    element.classList.add('blur')
  })
}

export const removeBlur = () => {
  const pageWrapper = document.getElementById('pageMain')
  const topNav = document.querySelector('.top-nav')

  const elements = [pageWrapper, topNav].filter(Boolean)

  elements.forEach(element => {
    element.classList.remove('blur')
    element.classList.add('no-blur')
  })
}

export const matchMinMaxMediaQuery = (min: number, max: number) => {
  return window.matchMedia(`(min-width: ${min}px) and (max-width: ${max}px)`).matches
}

export function filterInactiveItem<ItemType>(list: ItemType[]): ItemType[] {
  // @ts-ignore
  return list.filter(item => item.isActive)
}

export function groupBy<ListType>(
  list: ListType[],
  keyGetter: (elem: ListType) => keyof ListType
): Record<string, ListType[]> {
  const result: Record<string, ListType[]> = {}

  list.forEach(elem => {
    const key = keyGetter(elem) as any
    if (!result[key]) {
      result[key] = []
    }
    result[key].push(elem)
  })

  return result
}

export const calculatePercentage = (percent: number, number: number, precision?: number | null) => {
  const _percent = (percent / 100) * number
  return precision ? Number(_percent.toFixed(precision)) : _percent
}

export const updateUrlParam = (uri: string, key: string, value: string | null) => {
  // remove the hash part before operating on the uri
  const i = uri.indexOf('#')
  const hash = i === -1 ? '' : uri.substr(i)
  uri = i === -1 ? uri : uri.substr(0, i)

  const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i')
  const separator = uri.indexOf('?') !== -1 ? '&' : '?'

  if (value === null) {
    // remove key-value pair if value is specifically null
    uri = uri.replace(new RegExp(`([?&]?)${key}=[^&]*`, 'i'), '')
    if (uri.slice(-1) === '?') {
      uri = uri.slice(0, -1)
    }
    // replace first occurrence of & by ? if no ? is present
    if (uri.indexOf('?') === -1) uri = uri.replace(/&/, '?')
  } else if (uri.match(re)) {
    uri = uri.replace(re, `$1${key}=${value}$2`)
  } else {
    uri = `${uri + separator + key}=${value}`
  }
  return uri + hash
}

export const getLayoutFindParams = (router: NextRouter): IFindParams => {
  const currentPage = Number(router.query.page || 1)
  const limit = appConfig.global.paginationFetchLimit
  const offset = currentPage === 1 ? 0 : (currentPage - 1) * limit

  return {
    offset: offset,
    limit: limit,
  }
}
