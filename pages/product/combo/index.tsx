import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../../components/layout/PageLayout'
import { IPageLink } from '../../../components/layout/PageLinks'
import IndexViewLayout, { IIndexViewItem } from '../../../components/layout/IndexViewLayout'
import useLoginEffect from '../../../hooks/useLoginEffect'
import { getAllComboProducts } from '../../../http/product'
import {
  getComboProductPageUrl,
  getComboProductSearchPageUrl,
  getComboProductUpdatePageUrl,
} from '../../../utils/product'
import { useRouter } from 'next/router'
import LayoutPagination from '../../../components/layout/LayoutPagination'
import { getLayoutFindParams } from '../../../utils/common'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const ComboProduct: NextPage<IProps> = props => {
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  const router = useRouter()

  useLoginEffect(() => {
    setFetching(true)

    getAllComboProducts({
      ...getLayoutFindParams(router),
    })
      .then(resp => {
        const newList: IIndexViewItem[] = resp.map(data => {
          return {
            id: data.id,
            label: data.name,
            editUrl: getComboProductUpdatePageUrl(data.id),
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
      url: getComboProductPageUrl(),
      pagePaths: ['/product/combo'],
    },
    {
      label: 'Search',
      url: getComboProductSearchPageUrl(),
    },
    {
      label: 'Add',
      url: getComboProductUpdatePageUrl(),
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
          title: 'Combo Product - CMS',
        },
        headerTitle: 'Combo Product',
      },
    },
  }
}

export default ComboProduct
