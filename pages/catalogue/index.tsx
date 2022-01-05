import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import IndexViewLayout, { IIndexViewItem } from '../../components/layout/IndexViewLayout'
import useLoginEffect from '../../hooks/useLoginEffect'
import { getAllCatalogues } from '../../http/catalogue'
import { getCataloguePageUrl, getCatalogueSearchPageUrl, getCatalogueUpdatePageUrl } from '../../utils/catalogue'
import { getLayoutFindParams } from '../../utils/common'
import { useRouter } from 'next/router'
import LayoutPagination from '../../components/layout/LayoutPagination'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const Catalogue: NextPage<IProps> = props => {
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  const router = useRouter()

  useLoginEffect(() => {
    setFetching(true)

    getAllCatalogues({
      ...getLayoutFindParams(router),
    })
      .then(resp => {
        const newList: IIndexViewItem[] = resp.map(data => {
          return {
            id: data.id,
            label: data.name,
            editUrl: getCatalogueUpdatePageUrl(data.id),
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
      url: getCataloguePageUrl(),
      pagePaths: ['/catalogue'],
    },
    {
      label: 'Search',
      url: getCatalogueSearchPageUrl(),
    },
    {
      label: 'Add',
      url: getCatalogueUpdatePageUrl(),
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
          title: 'Catalogue - CMS',
        },
        headerTitle: 'Catalogue',
      },
    },
  }
}

export default Catalogue
