import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import IndexViewLayout, { IIndexViewItem } from '../../components/layout/IndexViewLayout'
import useLoginEffect from '../../hooks/useLoginEffect'
import { getAllBlogs } from '../../http/blog'
import { getBlogPageUrl, getBlogSearchPageUrl, getBlogUpdatePageUrl } from '../../utils/blog'
import { useRouter } from 'next/router'
import { getLayoutFindParams } from '../../utils/common'
import LayoutPagination from '../../components/layout/LayoutPagination'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const Blog: NextPage<IProps> = props => {
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  const router = useRouter()

  useLoginEffect(() => {
    setFetching(true)

    getAllBlogs({
      ...getLayoutFindParams(router),
    })
      .then(resp => {
        const newList: IIndexViewItem[] = resp.map(data => {
          return {
            id: data.id,
            label: data.title,
            description: data.url,
            editUrl: getBlogUpdatePageUrl(data.id),
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
      url: getBlogPageUrl(),
      pagePaths: ['/blog'],
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
          title: 'Blog - CMS',
        },
        headerTitle: 'Blog',
      },
    },
  }
}

export default Blog
