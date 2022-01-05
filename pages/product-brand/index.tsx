import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from './../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import IndexViewLayout, { IIndexViewItem } from '../../components/layout/IndexViewLayout'
import useLoginEffect from '../../hooks/useLoginEffect'
import { getAllProductBrands } from '../../http/product'
import { getProductBrandPageUrl, getProductBrandUpdatePageUrl } from '../../utils/product'
import LayoutPagination from '../../components/layout/LayoutPagination'
import { useRouter } from 'next/router'
import { getLayoutFindParams } from '../../utils/common'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const ProductBrand: NextPage<IProps> = props => {
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  const router = useRouter()

  useLoginEffect(() => {
    setFetching(true)

    getAllProductBrands({
      ...getLayoutFindParams(router),
    })
      .then(resp => {
        const newList: IIndexViewItem[] = resp.map(data => {
          return {
            id: data.id,
            label: data.name,
            description: data.description,
            editUrl: getProductBrandUpdatePageUrl(data.id),
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
      url: getProductBrandPageUrl(),
      pagePaths: ['/product-brand'],
    },
    {
      label: 'Add',
      url: getProductBrandUpdatePageUrl(),
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
          title: 'Product Brand - CMS',
        },
        headerTitle: 'Product Brand',
      },
    },
  }
}

export default ProductBrand
