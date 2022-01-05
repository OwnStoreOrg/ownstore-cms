import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import IndexViewLayout, { IIndexViewItem } from '../../components/layout/IndexViewLayout'
import useLoginEffect from '../../hooks/useLoginEffect'
import { getAllFAQTopics } from '../../http/faq'
import { getFAQPageUrl, getFAQTopicPageUrl, getFAQTopicUpdatePageUrl } from '../../utils/faq'
import { PAGE_SUMMARY } from '../../constants/constants'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const FAQTopic: NextPage<IProps> = props => {
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  useLoginEffect(() => {
    setFetching(true)

    getAllFAQTopics()
      .then(resp => {
        const newList: IIndexViewItem[] = resp.map(data => {
          return {
            id: data.id,
            label: data.name,
            editUrl: getFAQTopicUpdatePageUrl(data.id),
            viewUrl: getFAQPageUrl(data.id),
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
      label: 'View',
      url: getFAQTopicPageUrl(),
    },
    {
      label: 'Add',
      url: getFAQTopicUpdatePageUrl(),
    },
  ]

  return (
    <div className="">
      <PageLayout links={links} summary={PAGE_SUMMARY.FAQ_TOPIC}>
        <div>
          <IndexViewLayout items={list} showLoader={fetching} />
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
          title: 'FAQ Topic - CMS',
        },
        headerTitle: 'FAQ Topic',
      },
    },
  }
}

export default FAQTopic
