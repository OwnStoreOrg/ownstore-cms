import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import { getCataloguePageUrl, getCatalogueSearchPageUrl, getCatalogueUpdatePageUrl } from '../../utils/catalogue'
import { useRouter } from 'next/router'
import SearchLayout, { SearchType } from '../../components/layout/SearchLayout'
import { IIndexViewItem } from '../../components/layout/IndexViewLayout'
import { getCatalogueById, searchCatalogueByName } from '../../http/catalogue'
import appConfig from '../../config/appConfig'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const CatalogueSearch: NextPage<IProps> = props => {
  const router = useRouter()

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getCataloguePageUrl(),
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

  const getIndexList = (searchType: SearchType, value: string | number): Promise<IIndexViewItem[]> => {
    if (searchType === SearchType.NAME) {
      return searchCatalogueByName(value as string, {
        limit: appConfig.search.limit,
      }).then(resp => {
        const newList: IIndexViewItem[] = resp.map(data => {
          return {
            id: data.id,
            label: data.name,
            viewUrl: getCatalogueUpdatePageUrl(data.id),
            isInactive: !data.isActive,
          }
        })
        return newList
      })
    }

    if (searchType === SearchType.ID) {
      return getCatalogueById(Number(value)).then(resp => {
        const list: IIndexViewItem[] = [
          {
            id: resp.id,
            label: resp.name,
            viewUrl: getCatalogueUpdatePageUrl(resp.id),
            isInactive: !resp.isActive,
          },
        ]
        return list
      })
    }

    return new Promise(res => res([]))
  }

  return (
    <div className="">
      <PageLayout links={links}>
        <SearchLayout getIndexList={getIndexList} />
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
          title: 'Catalogue - Search - CMS',
        },
        headerTitle: 'Catalogue - Search',
      },
    },
  }
}

export default CatalogueSearch
