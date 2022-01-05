import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from './../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import IndexViewLayout, { IIndexViewItem } from '../../components/layout/IndexViewLayout'
import useLoginEffect from '../../hooks/useLoginEffect'
import { PAGE_SUMMARY } from '../../constants/constants'
import { getAllUsers } from '../../http/user'
import { getUserPageUrl, getUserDetailPageUrl, getUserSearchPageUrl } from '../../utils/user'
import { useRouter } from 'next/router'
import { getLayoutFindParams } from '../../utils/common'
import LayoutPagination from '../../components/layout/LayoutPagination'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const User: NextPage<IProps> = props => {
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  const router = useRouter()

  useLoginEffect(() => {
    setFetching(true)

    getAllUsers({
      ...getLayoutFindParams(router),
    })
      .then(resp => {
        const newList: IIndexViewItem[] = resp.map(data => {
          return {
            id: data.id,
            label: data.email,
            description: data.name,
            editUrl: getUserDetailPageUrl(data.id),
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
      url: getUserPageUrl(),
      pagePaths: ['/user'],
    },
    {
      label: 'Search',
      url: getUserSearchPageUrl(),
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
          title: 'User - CMS',
        },
        headerTitle: 'User',
      },
    },
  }
}

export default User
