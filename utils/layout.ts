import { NextRouter } from 'next/router'
import { IApplicationContextProps } from '../components/ApplicationContext'
import { toastSuccess } from '../components/Toaster'
import appConfig from '../config/appConfig'

export const onUpdateSuccess = (
  params: { url?: string },
  applicationContext: IApplicationContextProps,
  router: NextRouter
) => {
  toastSuccess('Updated successfully!')
  if (appConfig.global.redirectToIndexViewAfterUpdate && params.url) {
    router.push(params.url)
  }
}

export const onDeleteSuccess = (
  params: { url?: string },
  applicationContext: IApplicationContextProps,
  router: NextRouter
) => {
  toastSuccess('Deleted successfully!')
  if (appConfig.global.redirectToIndexViewAfterDelete && params.url) {
    router.push(params.url)
  }
}
