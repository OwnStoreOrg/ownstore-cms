import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../../_app'
import { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import PageLayout from '../../../components/layout/PageLayout'
import { IPageLink } from '../../../components/layout/PageLinks'
import IndexViewLayout, { IIndexViewItem } from '../../../components/layout/IndexViewLayout'
import useLoginEffect from '../../../hooks/useLoginEffect'
import { getFAQsByTopicId } from '../../../http/faq'
import { getFAQPageUrl, getFAQTopicPageUrl, getFAQUpdatePageUrl } from '../../../utils/faq'
import { useRouter } from 'next/router'
import PageLoader from '../../../components/loader/PageLoader'
import { PAGE_SUMMARY } from '../../../constants/constants'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const FAQ: NextPage<IProps> = props => {
  const router = useRouter()

  if (router.isFallback) {
    return <PageLoader message="Loading page content..." />
  }

  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  const topicId = router.query.topicId as any

  useLoginEffect(() => {
    setFetching(true)

    getFAQsByTopicId(topicId)
      .then(resp => {
        const newList: IIndexViewItem[] = resp.map(data => {
          return {
            id: data.id,
            label: data.question,
            // description: data.answer,
            editUrl: getFAQUpdatePageUrl(topicId, data.id),
            isInactive: !data.isActive,
          }
        })

        setList(newList)
      })
      .finally(() => {
        setFetching(false)
      })
  }, [])

  const links: IPageLink[] = [
    {
      label: 'Topics',
      url: getFAQTopicPageUrl(),
    },
    {
      label: 'Questions',
      url: getFAQPageUrl(topicId),
    },
    {
      label: 'Add Question',
      url: getFAQUpdatePageUrl(topicId),
    },
  ]

  return (
    <div className="">
      <PageLayout
        links={links}
        summary={{
          ...PAGE_SUMMARY.FAQ,
          pageUrl: PAGE_SUMMARY.FAQ.pageUrl.replace('{{FAQ_TOPIC_ID}}', topicId),
          description: PAGE_SUMMARY.FAQ.description.replace('{{FAQ_TOPIC_ID}}', topicId),
        }}>
        <div>
          <IndexViewLayout items={list} showLoader={fetching} />
        </div>
      </PageLayout>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: null,
      layoutData: {
        seo: {
          title: 'FAQ - CMS',
        },
        headerTitle: 'FAQ',
      },
    },
  }
}

export default FAQ
