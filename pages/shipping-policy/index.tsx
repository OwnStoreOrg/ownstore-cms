import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { NextPage, GetStaticProps } from 'next'
import useLoginEffect from '../../hooks/useLoginEffect'
import EscapeHTML from '../../components/EscapeHTML'
import { IPageLink } from '../../components/layout/PageLinks'
import PageLayout from '../../components/layout/PageLayout'
import { getShippingPolicyDetail } from '../../http/shippingPolicy'
import { getShippingPolicyPageUrl, getShippingPolicyUpdatePageUrl } from '../../utils/shippingPolicy'
import PageLoader from '../../components/loader/PageLoader'
import { PAGE_SUMMARY } from '../../constants/constants'
import { IStaticPageDetail } from '../../contract/staticPage'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const ShippingPolicy: NextPage<IProps> = props => {
  const [detail, setDetail] = useState<IStaticPageDetail>(null)

  useLoginEffect(() => {
    getShippingPolicyDetail().then(resp => {
      setDetail(resp)
    })
  }, [])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getShippingPolicyPageUrl(),
    },
    {
      label: 'Edit',
      url: getShippingPolicyUpdatePageUrl(),
    },
  ]

  return (
    <div className="">
      <PageLayout links={links} summary={PAGE_SUMMARY.Shipping_POLICY}>
        {!detail ? (
          <PageLoader message="Loading detail..." />
        ) : (
          <div className="mt-4">
            <div className="mb-3">
              <div className="font-medium font-primary-medium">{detail.title}</div>
            </div>

            <div className="html-body">
              <EscapeHTML element="div" html={detail.body} />
            </div>
          </div>
        )}
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
          title: 'Shipping Policy - CMS',
        },
        headerTitle: 'Shipping Policy',
      },
    },
  }
}

export default ShippingPolicy
