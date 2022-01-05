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

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UserAddress: NextPage<IProps> = props => {
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any

  useLoginEffect(() => {
    if (updateQueryId) {
      setFetching(true)

      getUserGlobalDetail(updateQueryId, {})
        .then(resp => {
          const newList: IIndexViewItem[] = resp.userDetail.addresses.map(data => {
            return {
              id: data.id,
              label: `${data.name} - ${data.phoneNumber}`,
              description: `${data.addressLine} - ${data.area} - ${data.city} - ${data.country} - ${data.areaCode} - ${data.addressType}`,
              isInactive: !data.isActive,
            }
          })

          setList(newList)
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

  return (
    <div className="">
      <PageLayout links={links}>
        <div>
          <IndexViewLayout items={list} showLoader={fetching} />
        </div>
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
          title: 'User Address - CMS',
        },
        headerTitle: 'User Address',
      },
    },
  }
}

export default UserAddress
