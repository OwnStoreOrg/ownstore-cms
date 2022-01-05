import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from './../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import { getCurrencyPageUrl, getCurrencyUpdatePageUrl } from '../../utils/currency'
import IndexViewLayout, { IIndexViewItem } from '../../components/layout/IndexViewLayout'
import { getAllCurrencies } from '../../http/currency'
import useLoginEffect from '../../hooks/useLoginEffect'
import { getSecurityQuestionPageUrl, getSecurityQuestionUpdatePageUrl } from '../../utils/securityQuestion'
import { getAllSecurityQuestions } from '../../http/securityQuestion'
import { PAGE_SUMMARY } from '../../constants/constants'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const SecurityQuestion: NextPage<IProps> = props => {
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  useLoginEffect(() => {
    setFetching(true)

    getAllSecurityQuestions()
      .then(resp => {
        const newList: IIndexViewItem[] = resp.map(data => {
          return {
            id: data.id,
            label: data.question,
            editUrl: getSecurityQuestionUpdatePageUrl(data.id),
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
      url: getSecurityQuestionPageUrl(),
    },
    {
      label: 'Add',
      url: getSecurityQuestionUpdatePageUrl(),
    },
  ]

  return (
    <div className="">
      <PageLayout links={links} summary={PAGE_SUMMARY.SECURITY_QUESTION}>
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
          title: 'Security Question - CMS',
        },
        headerTitle: 'Security Question',
      },
    },
  }
}

export default SecurityQuestion
