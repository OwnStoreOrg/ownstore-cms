import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import { useRouter } from 'next/router'
import SearchLayout, { SearchType } from '../../components/layout/SearchLayout'
import { IIndexViewItem } from '../../components/layout/IndexViewLayout'
import appConfig from '../../config/appConfig'
import { getUserDetailPageUrl, getUserPageUrl, getUserSearchPageUrl } from '../../utils/user'
import { getUserGlobalDetail, searchUserByName } from '../../http/user'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UserSearch: NextPage<IProps> = props => {
  const router = useRouter()

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getUserPageUrl(),
    },
    {
      label: 'Search',
      url: getUserSearchPageUrl(),
    },
  ]

  const getIndexList = (searchType: SearchType, value: string | number): Promise<IIndexViewItem[]> => {
    if (searchType === SearchType.NAME) {
      return searchUserByName(value as string, {
        limit: appConfig.search.limit,
      }).then(resp => {
        const newList: IIndexViewItem[] = resp.map(data => {
          return {
            id: data.id,
            label: data.name || data.email,
            editUrl: getUserDetailPageUrl(data.id),
            isInactive: !data.isActive,
          }
        })
        return newList
      })
    }

    if (searchType === SearchType.ID) {
      return getUserGlobalDetail(Number(value), {}).then(resp => {
        const data = resp.userDetail
        const list: IIndexViewItem[] = [
          {
            id: data.id,
            label: data.name || data.email,
            editUrl: getUserDetailPageUrl(data.id),
            isInactive: !data.isActive,
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
          title: 'User - Search - CMS',
        },
        headerTitle: 'User - Search',
      },
    },
  }
}

export default UserSearch
