import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import { useRouter } from 'next/router'
import SearchLayout, { SearchType } from '../../components/layout/SearchLayout'
import { IIndexViewItem } from '../../components/layout/IndexViewLayout'
import { getCatalogueById, searchCatalogueByName } from '../../http/catalogue'
import appConfig from '../../config/appConfig'
import { getBlogPageUrl, getBlogSearchPageUrl, getBlogUpdatePageUrl } from '../../utils/blog'
import { getBlogById, searchBlogByName } from '../../http/blog'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const BlogSearch: NextPage<IProps> = props => {
  const router = useRouter()

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getBlogPageUrl(),
    },
    {
      label: 'Search',
      url: getBlogSearchPageUrl(),
    },
    {
      label: 'Add',
      url: getBlogUpdatePageUrl(),
    },
  ]

  const getIndexList = (searchType: SearchType, value: string | number): Promise<IIndexViewItem[]> => {
    if (searchType === SearchType.NAME) {
      return searchBlogByName(value as string, {
        limit: appConfig.search.limit,
      }).then(resp => {
        const newList: IIndexViewItem[] = resp.map(data => {
          return {
            id: data.id,
            label: data.title,
            description: data.url,
            editUrl: getBlogUpdatePageUrl(data.id),
            isInactive: !data.isActive,
          }
        })
        return newList
      })
    }

    if (searchType === SearchType.ID) {
      return getBlogById(Number(value)).then(data => {
        const list: IIndexViewItem[] = [
          {
            id: data.id,
            label: data.title,
            description: data.url,
            editUrl: getBlogUpdatePageUrl(data.id),
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
          title: 'Blog - Search - CMS',
        },
        headerTitle: 'Blog - Search',
      },
    },
  }
}

export default BlogSearch
