import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import IndexViewLayout, { IIndexViewItem } from '../../components/layout/IndexViewLayout'
import useLoginEffect from '../../hooks/useLoginEffect'
import { getAllProductAttributeKeys, getAllProductBrands } from '../../http/product'
import {
  getProductAttributeKeyPageUrl,
  getProductAttributeKeyUpdatePageUrl,
  getProductBrandPageUrl,
  getProductBrandUpdatePageUrl,
} from '../../utils/product'
import { useRouter } from 'next/router'
import { getLayoutFindParams } from '../../utils/common'
import LayoutPagination from '../../components/layout/LayoutPagination'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const ProductAttributeKey: NextPage<IProps> = props => {
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  const router = useRouter()

  useLoginEffect(() => {
    setFetching(true)

    getAllProductAttributeKeys({
      ...getLayoutFindParams(router),
    })
      .then(resp => {
        const newList: IIndexViewItem[] = resp.map(data => {
          return {
            id: data.id,
            label: data.name,
            editUrl: getProductAttributeKeyUpdatePageUrl(data.id),
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
      url: getProductAttributeKeyPageUrl(),
      pagePaths: ['/product-attribute-key'],
    },
    {
      label: 'Add',
      url: getProductAttributeKeyUpdatePageUrl(),
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
          title: 'Product Attribute Keys - CMS',
        },
        headerTitle: 'Product Attribute Keys',
      },
    },
  }
}

export default ProductAttributeKey
