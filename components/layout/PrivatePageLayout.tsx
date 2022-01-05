import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { getLoginPageUrl } from '../../utils/login'
import ApplicationContext, { LoginStateType } from '../ApplicationContext'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import PageLoader from '../loader/PageLoader'
import NoContent, { NoContentType } from '../NoContent'

interface IPrivatePageLayoutProps {}

const PrivatePageLayout: React.FC<IPrivatePageLayoutProps> = props => {
  const { children } = props

  const applicationContext = useContext(ApplicationContext)
  const { loginState } = applicationContext

  const router = useRouter()

  if (loginState === LoginStateType.NONE) {
    return <PageLoader message="Loading the page for you." />
  }

  if (loginState === LoginStateType.LOGGED_IN) {
    return <>{children}</>
  }

  return (
    <div>
      <NoContent message="Access to this page is denied without login." type={NoContentType.LOGIN} />
      <div className="text-center">
        <CoreButton
          label="Login to continue"
          size={CoreButtonSize.MEDIUM}
          type={CoreButtonType.SOLID_PRIMARY}
          url={`${getLoginPageUrl()}?backUrl=${router.asPath}`}
        />
      </div>
    </div>
  )
}

export default PrivatePageLayout
