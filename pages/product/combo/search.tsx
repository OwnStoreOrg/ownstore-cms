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
  getComboProductPageUrl,
  getComboProductSearchPageUrl,
  getComboProductUpdatePageUrl,
} from '../../../utils/product'
import { getComboProductDetail, searchComboProductByName } from '../../../http/product'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const ComboProductSearch: NextPage<IProps> = props => {
  const router = useRouter()

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getComboProductPageUrl(),
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

  const getIndexList = (searchType: SearchType, value: string | number): Promise<IIndexViewItem[]> => {
    if (searchType === SearchType.NAME) {
      return searchComboProductByName(value as string, {
        limit: appConfig.search.limit,
      }).then(resp => {
        const newList: IIndexViewItem[] = resp.map(data => {
          return {
            id: data.id,
            label: data.name,
            viewUrl: getComboProductUpdatePageUrl(data.id),
            isInactive: !data.isActive,
          }
        })
        return newList
      })
    }

    if (searchType === SearchType.ID) {
      return getComboProductDetail(Number(value)).then(resp => {
        const list: IIndexViewItem[] = [
          {
            id: resp.id,
            label: resp.name,
            viewUrl: getComboProductUpdatePageUrl(resp.id),
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
          title: 'Combo Product - Search - CMS',
        },
        headerTitle: 'Combo Product - Search',
      },
    },
  }
}

export default ComboProductSearch
