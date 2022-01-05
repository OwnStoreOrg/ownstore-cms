import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import IndexViewLayout, { IIndexViewItem } from '../../components/layout/IndexViewLayout'
import useLoginEffect from '../../hooks/useLoginEffect'
import { getAllOrderStatus } from '../../http/order'
import { getOrderStatusPageUrl, getOrderStatusUpdatePageUrl } from '../../utils/order'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const OrderStatusType: NextPage<IProps> = props => {
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  useLoginEffect(() => {
    setFetching(true)

    getAllOrderStatus()
      .then(resp => {
        const newList: IIndexViewItem[] = resp.map(data => {
          return {
            id: data.id,
            label: data.name,
            editUrl: getOrderStatusUpdatePageUrl(data.id),
          }
        })

        setList(newList)
      })
      .finally(() => {
        setFetching(false)
      })
  }, [])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getOrderStatusPageUrl(),
    },
    {
      label: 'Add',
      url: getOrderStatusUpdatePageUrl(),
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
          title: 'Order Status Type - CMS',
        },
        headerTitle: 'Order Status Type',
      },
    },
  }
}

export default OrderStatusType
