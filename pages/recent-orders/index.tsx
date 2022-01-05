import React, { useEffect, useRef, useState } from 'react'
import { IGlobalLayoutProps } from './../_app'
import { NextPage, GetStaticProps } from 'next'
import useLoginEffect from '../../hooks/useLoginEffect'
import { PAGE_SUMMARY } from '../../constants/constants'
import { IOrderInfo } from '../../contract/order'
import { getRecentOrders } from '../../http/order'
import OrderInfo from '../../components/order/OrderInfo'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../../components/core/CoreButton'
import { RefreshIcon, StatusOnlineIcon } from '@heroicons/react/outline'
import PageLoader from '../../components/loader/PageLoader'
import PrivatePageLayout from '../../components/layout/PrivatePageLayout'
import appConfig from '../../config/appConfig'
import { useRouter } from 'next/router'
import { getLayoutFindParams } from '../../utils/common'
import LayoutPagination from '../../components/layout/LayoutPagination'
import { IFindParams } from '../../contract/common'
import NoContent from '../../components/NoContent'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const RecentOrders: NextPage<IProps> = props => {
  const [orders, setOrders] = useState<IOrderInfo[]>([])
  const [fetching, setFetching] = useState(false)

  const timerRef = useRef(null)

  const router = useRouter()

  const currentPage = Number(router.query.page || 1)

  useLoginEffect(() => {
    fetchOrders({
      ...getLayoutFindParams(router),
    })
  }, [router.asPath])

  useLoginEffect(() => {
    if (currentPage === 1 && appConfig.order.recentOrders.autoRefresh) {
      timerRef.current = setInterval(() => {
        fetchOrders({})
      }, appConfig.order.recentOrders.refreshIntervalInSeconds * 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [router.asPath])

  const fetchOrders = (params: IFindParams) => {
    setFetching(true)

    getRecentOrders(params)
      .then(resp => {
        setOrders(resp)
      })
      .finally(() => {
        setFetching(false)
      })
  }

  const renderOrders = () => {
    return (
      <div>
        {orders.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {orders.map(order => (
              <OrderInfo key={order.id} orderInfo={order} />
            ))}
          </div>
        ) : (
          <NoContent />
        )}
        <LayoutPagination />
      </div>
    )
  }

  return (
    <PrivatePageLayout>
      <div className="">
        <>
          {currentPage === 1 ? (
            <div className="flex justify-between items-center mb-4">
              <div className="flex">
                {appConfig.order.recentOrders.autoRefresh ? (
                  <>
                    <StatusOnlineIcon className="w-7 mr-1" />
                    <span>Refreshes every {appConfig.order.recentOrders.refreshIntervalInSeconds} seconds</span>
                  </>
                ) : null}
              </div>

              <CoreButton
                label={
                  <React.Fragment>
                    <RefreshIcon className="w-5 mr-1" />
                    <span>Refresh</span>
                  </React.Fragment>
                }
                size={CoreButtonSize.MEDIUM}
                type={CoreButtonType.SOLID_PRIMARY}
                className="text-sm"
                onClick={fetchOrders}
                loading={fetching}
              />
            </div>
          ) : null}

          {fetching ? <PageLoader message="Loading detail..." /> : <div>{renderOrders()}</div>}
        </>
      </div>
    </PrivatePageLayout>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: null,
      layoutData: {
        seo: {
          title: 'Recent Orders - CMS',
        },
        headerTitle: 'Recent Orders',
      },
    },
  }
}

export default RecentOrders
