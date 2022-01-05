import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from './../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import { getCurrencyPageUrl, getCurrencyUpdatePageUrl } from '../../utils/currency'
import IndexViewLayout, { IIndexViewItem } from '../../components/layout/IndexViewLayout'
import { getAllCurrencies } from '../../http/currency'
import useLoginEffect from '../../hooks/useLoginEffect'
import { PAGE_SUMMARY } from '../../constants/constants'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const Currency: NextPage<IProps> = props => {
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  useLoginEffect(() => {
    setFetching(true)

    getAllCurrencies()
      .then(resp => {
        const newList: IIndexViewItem[] = resp.map(data => {
          return {
            id: data.id,
            label: data.name,
            description: data.isoCode,
            editUrl: getCurrencyUpdatePageUrl(data.id),
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
      url: getCurrencyPageUrl(),
    },
    {
      label: 'Add',
      url: getCurrencyUpdatePageUrl(),
    },
  ]

  return (
    <div className="">
      <PageLayout links={links} summary={PAGE_SUMMARY.CURRENCY}>
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
          title: 'Currency - CMS',
        },
        headerTitle: 'Currency',
      },
    },
  }
}

export default Currency
