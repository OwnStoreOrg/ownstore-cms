import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../../components/layout/PageLayout'
import { IPageLink } from '../../../components/layout/PageLinks'
import { useRouter } from 'next/router'
import SearchLayout, { SearchType } from '../../../components/layout/SearchLayout'
import { IIndexViewItem } from '../../../components/layout/IndexViewLayout'
import appConfig from '../../../config/appConfig'
import {
  getIndividualProductPageUrl,
  getIndividualProductSearchPageUrl,
  getIndividualProductUpdatePageUrl,
} from '../../../utils/product'
import { getIndividualProductDetail, searchIndividualProductByName } from '../../../http/product'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const IndividualProductSearch: NextPage<IProps> = props => {
  const router = useRouter()

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getIndividualProductPageUrl(),
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

  const getIndexList = (searchType: SearchType, value: string | number): Promise<IIndexViewItem[]> => {
    if (searchType === SearchType.NAME) {
      return searchIndividualProductByName(value as string, {
        limit: appConfig.search.limit,
      }).then(resp => {
        const newList: IIndexViewItem[] = resp.map(data => {
          return {
            id: data.id,
            label: data.name,
            viewUrl: getIndividualProductUpdatePageUrl(data.id),
            isInactive: !data.isActive,
          }
        })
        return newList
      })
    }

    if (searchType === SearchType.ID) {
      return getIndividualProductDetail(Number(value)).then(resp => {
        const list: IIndexViewItem[] = [
          {
            id: resp.id,
            label: resp.name,
            viewUrl: getIndividualProductUpdatePageUrl(resp.id),
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
          title: 'Product - Search - CMS',
        },
        headerTitle: 'Product - Search',
      },
    },
  }
}

export default IndividualProductSearch
