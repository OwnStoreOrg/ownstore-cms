import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import { ArrowLeftIcon, SearchIcon, PlusIcon, HomeIcon, LoginIcon, LogoutIcon } from '@heroicons/react/outline'
import CoreLink from '../core/CoreLink'
import { getHomePageUrl } from '../../utils/home'
import classnames from 'classnames'
import ApplicationContext from '../ApplicationContext'
import { getLoginPageUrl } from '../../utils/login'

interface ISnackbarProps {
  title?: React.ReactNode
  backUrl?: string
}

const Snackbar: React.FC<ISnackbarProps> = props => {
  const { title, backUrl } = props

  const router = useRouter()

  const applicationContext = useContext(ApplicationContext)
  const { isLoggedIn } = applicationContext

  const handleBackIconClick = () => {
    backUrl ? router.push(backUrl) : router.back()
  }

  const isLoginPage = router.pathname === getLoginPageUrl()

  return (
    <div className="bg-white h-12 sticky top-0 left-0 right-0 flex items-center justify-between text-mineShaft px-3 z-10 shadow-md">
      <div className={classnames('flex items-center w-[90%]')}>
        {!isLoginPage ? (
          <div className="mr-3" onClick={handleBackIconClick}>
            <ArrowLeftIcon className="w-6" />
          </div>
        ) : null}
        <div className="w-11/12">
          <div className="text-base truncate">{title}</div>
        </div>
      </div>
      <div className="flex items-center">
        <span className="text-mineShaft">
          {isLoggedIn ? <LogoutIcon className="w-6" /> : <LoginIcon className="w-6" />}
        </span>
        {!isLoginPage ? (
          <CoreLink url={getHomePageUrl()} className="text-mineShaft">
            <HomeIcon className="w-5 ml-3" />
          </CoreLink>
        ) : null}
      </div>
    </div>
  )
}

export default Snackbar
