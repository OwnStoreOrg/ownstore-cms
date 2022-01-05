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
import { getImagePageUrl, getImageSearchPageUrl, getImageUpdatePageUrl } from '../../utils/image'
import { getImageById, searchImageByName } from '../../http/image'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const CatalogueSearch: NextPage<IProps> = props => {
  const router = useRouter()

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getImagePageUrl(),
    },
    {
      label: 'Search',
      url: getImageSearchPageUrl(),
    },
    {
      label: 'Add',
      url: getImageUpdatePageUrl(),
    },
  ]

  const getIndexList = (searchType: SearchType, value: string | number): Promise<IIndexViewItem[]> => {
    if (searchType === SearchType.NAME) {
      return searchImageByName(value as string, {
        limit: appConfig.search.limit,
      }).then(resp => {
        const newList: IIndexViewItem[] = resp.map(data => {
          return {
            id: data.id,
            label: data.name,
            viewUrl: getImageUpdatePageUrl(data.id),
          }
        })
        return newList
      })
    }

    if (searchType === SearchType.ID) {
      return getImageById(Number(value)).then(resp => {
        const list: IIndexViewItem[] = [
          {
            id: resp.id,
            label: resp.name,
            viewUrl: getImageUpdatePageUrl(resp.id),
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
          title: 'Image - Search - CMS',
        },
        headerTitle: 'Image - Search',
      },
    },
  }
}

export default CatalogueSearch
