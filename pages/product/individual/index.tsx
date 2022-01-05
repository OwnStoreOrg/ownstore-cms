import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../../components/layout/PageLayout'
import { IPageLink } from '../../../components/layout/PageLinks'
import IndexViewLayout, { IIndexViewItem } from '../../../components/layout/IndexViewLayout'
import useLoginEffect from '../../../hooks/useLoginEffect'
import { getAllIndividualProducts } from '../../../http/product'
import {
  getIndividualProductPageUrl,
  getIndividualProductSearchPageUrl,
  getIndividualProductUpdatePageUrl,
} from '../../../utils/product'
import LayoutPagination from '../../../components/layout/LayoutPagination'
import { useRouter } from 'next/router'
import { getLayoutFindParams } from '../../../utils/common'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const IndividualProduct: NextPage<IProps> = props => {
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  const router = useRouter()

  useLoginEffect(() => {
    setFetching(true)

    getAllIndividualProducts({
      ...getLayoutFindParams(router),
    })
      .then(resp => {
        const newList: IIndexViewItem[] = resp.map(data => {
          return {
            id: data.id,
            label: data.name,
            description: data.catalogue.name,
            editUrl: getIndividualProductUpdatePageUrl(data.id),
            isInactive: !data.isActive,
          }
        })

        setList(newList)
      })
      .finally(() => {
        setFetching(false)
      })
  }, [router.asPath])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getIndividualProductPageUrl(),
      pagePaths: ['/product/individual'],
    },
    {
      label: 'Search',
      url: getIndividualProductSearchPageUrl(),
    },
    {
      label: 'Add',
      url: getIndividualProductUpdatePageUrl(),
    },
  ]

  return (
    <div className="">
      <PageLayout links={links}>
        <div>
          <IndexViewLayout items={list} showLoader={fetching} />
          <LayoutPagination />
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
          title: 'Product - CMS',
        },
        headerTitle: 'Product',
      },
    },
  }
}

export default IndividualProduct
