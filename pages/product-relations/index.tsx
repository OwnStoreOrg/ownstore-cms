import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import IndexViewLayout, { IIndexViewItem } from '../../components/layout/IndexViewLayout'
import useLoginEffect from '../../hooks/useLoginEffect'
import { getAllProductsRelations } from '../../http/product'
import { getProductRelationsPageUrl, getProductRelationsUpdatePageUrl } from '../../utils/product'
import { useRouter } from 'next/router'
import { getLayoutFindParams } from '../../utils/common'
import LayoutPagination from '../../components/layout/LayoutPagination'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const ProductRelations: NextPage<IProps> = props => {
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  const router = useRouter()

  useLoginEffect(() => {
    setFetching(true)

    getAllProductsRelations({
      ...getLayoutFindParams(router),
    })
      .then(resp => {
        const newList: IIndexViewItem[] = resp.map(data => {
          return {
            id: data.id,
            label: data.name,
            editUrl: getProductRelationsUpdatePageUrl(data.id),
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
      url: getProductRelationsPageUrl(),
      pagePaths: ['/product-relations'],
    },
    {
      label: 'Add',
      url: getProductRelationsUpdatePageUrl(),
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
          title: 'Product Relations - CMS',
        },
        headerTitle: 'Product Relations',
      },
    },
  }
}

export default ProductRelations
