import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from './../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import IndexViewLayout, { IIndexViewItem } from '../../components/layout/IndexViewLayout'
import useLoginEffect from '../../hooks/useLoginEffect'
import { PAGE_SUMMARY } from '../../constants/constants'
import { getUserGlobalDetail, getUserLoginHistory } from '../../http/user'
import { useRouter } from 'next/router'
import ApplicationContext from '../../components/ApplicationContext'
import { filterInactiveItem, getLayoutFindParams } from '../../utils/common'
import {
  getUserAddressPageUrl,
  getUserCartPageUrl,
  getUserOrderPageUrl,
  getUserPageUrl,
  getUserDetailPageUrl,
  getUserWishlistPageUrl,
  getUserLoginHistoryPageUrl,
} from '../../utils/user'
import { getFormattedDateTime } from '../../utils/dates'
import { IUserLoginAttributesInfo } from '../../contract/user'
import classNames from 'classnames'
import CoreImage from '../../components/core/CoreImage'
import uaParser from 'ua-parser-js'
import PageLoader from '../../components/loader/PageLoader'
import NoContent from '../../components/NoContent'
import LayoutPagination from '../../components/layout/LayoutPagination'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UserLoginHistory: NextPage<IProps> = props => {
  const [list, setList] = useState<IUserLoginAttributesInfo[]>([])
  const [fetching, setFetching] = useState(false)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any

  useLoginEffect(() => {
    if (updateQueryId) {
      setFetching(true)

      getUserLoginHistory(updateQueryId, {
        ...getLayoutFindParams(router),
      })
        .then(resp => {
          setList(resp)
        })
        .finally(() => {
          setFetching(false)
        })
    }
  }, [router.asPath])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getUserPageUrl(),
      pagePaths: ['/user'],
    },
    {
      label: 'Detail',
      url: getUserDetailPageUrl(updateQueryId),
    },
    {
      label: 'Address',
      url: getUserAddressPageUrl(updateQueryId),
    },
    {
      label: 'Wishlist',
      url: getUserWishlistPageUrl(updateQueryId),
    },
    {
      label: 'Cart',
      url: getUserCartPageUrl(updateQueryId),
    },
    {
      label: 'Orders',
      url: getUserOrderPageUrl(updateQueryId),
    },
    {
      label: 'Login History',
      url: getUserLoginHistoryPageUrl(updateQueryId),
      pagePaths: ['/user/login-history'],
    },
  ]

  const renderItem = (title: ReactNode, subTitle: ReactNode, className?: string) => {
    return (
      <div className={classNames('flex items-center py-[1.5px]', className)}>
        <div className="font-medium font-primary-medium mr-1">{title}:</div>
        <div>{subTitle}</div>
      </div>
    )
  }

  const renderHistory = () => {
    return (
      <div>
        {list.length ? (
          <div>
            {list.map((attributes, index) => {
              const uaResult = uaParser(attributes.userAgent)
              const { browser, os, device } = uaResult

              return (
                <div key={index}>
                  <div
                    className={classNames(
                      index !== list.length - 1 ? 'border-b border-gray300' : '',
                      index === 0 ? 'pb-3' : 'py-3'
                    )}>
                    <div>
                      {renderItem('Login Time', getFormattedDateTime(attributes.loginAt))}
                      {renderItem('Session Expiry Time', getFormattedDateTime(attributes.sessionExpiry))}
                      {renderItem('Type', attributes.loginType)}
                      {renderItem(
                        'Platform',
                        <div className="flex items-center">
                          <span className="ml-1 text-sm">({attributes.platform.toLowerCase()})</span>
                        </div>
                      )}
                      {renderItem(
                        'Login Using',
                        <div className="flex items-center">
                          <span className="ml-1 text-sm">({attributes.loginSource.toLowerCase()})</span>
                        </div>
                      )}
                      {renderItem('IP Address', attributes.ipAddress)}
                      {renderItem('Browser', browser.name)}
                      {renderItem('Operating System', os.name)}
                      {device.type ? renderItem('Device Type', device.type) : null}
                      {device.model ? renderItem('Device Model', device.model) : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <NoContent />
        )}
        <LayoutPagination />
      </div>
    )
  }

  return (
    <div className="">
      <PageLayout links={links}>{fetching ? <PageLoader message="Fetching detail..." /> : renderHistory()}</PageLayout>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: null,
      layoutData: {
        seo: {
          title: 'User Login History - CMS',
        },
        headerTitle: 'User Login History',
      },
    },
  }
}

export default UserLoginHistory
