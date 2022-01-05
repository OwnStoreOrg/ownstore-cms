import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from './../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import IndexViewLayout, { IIndexViewItem } from '../../components/layout/IndexViewLayout'
import useLoginEffect from '../../hooks/useLoginEffect'
import { PAGE_SUMMARY } from '../../constants/constants'
import { getUserGlobalDetail } from '../../http/user'
import { useRouter } from 'next/router'
import ApplicationContext from '../../components/ApplicationContext'
import { filterInactiveItem } from '../../utils/common'
import {
  getUserAddressPageUrl,
  getUserCartPageUrl,
  getUserOrderPageUrl,
  getUserPageUrl,
  getUserDetailPageUrl,
  getUserWishlistPageUrl,
  getUserLoginHistoryPageUrl,
} from '../../utils/user'
import { IIndividualProductInfo } from '../../contract/product'
import { getFormattedDateTime } from '../../utils/dates'
import OrderInfo from '../../components/order/OrderInfo'
import NoContent from '../../components/NoContent'
import LayoutPagination from '../../components/layout/LayoutPagination'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UserOrder: NextPage<IProps> = props => {
  const [orders, setOrders] = useState([])
  const [fetching, setFetching] = useState(false)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any

  useLoginEffect(() => {
    if (updateQueryId) {
      setFetching(true)

      getUserGlobalDetail(updateQueryId, {
        orders: true,
      })
        .then(resp => {
          if (resp.orders) {
            setOrders(resp.orders)
          }
        })
        .finally(() => {
          setFetching(false)
        })
    }
  }, [])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getUserPageUrl(),
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
    },
  ]

  const renderOrders = () => {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map(order => (
            <OrderInfo key={order.id} orderInfo={order} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="">
      <PageLayout links={links}>
        <div>{orders.length ? renderOrders() : <NoContent />}</div>
      </PageLayout>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: null,
      layoutData: {
        seo: {
          title: 'User Order - CMS',
        },
        headerTitle: 'User Order',
      },
    },
  }
}

export default UserOrder
