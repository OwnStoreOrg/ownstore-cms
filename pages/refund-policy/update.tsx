import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import FormLayout, { IFormLayoutInput } from '../../components/layout/FormLayout'
import { useRouter } from 'next/router'
import useLoginEffect from '../../hooks/useLoginEffect'
import { onUpdateSuccess } from '../../utils/layout'
import ApplicationContext from '../../components/ApplicationContext'
import { getRefundPolicyDetail, updateRefundPolicyDetail } from '../../http/refundPolicy'
import { getRefundPolicyPageUrl, getRefundPolicyUpdatePageUrl } from '../../utils/refundPolicy'
import PageLoader from '../../components/loader/PageLoader'
import { IStaticPageDetail, IStaticPageUpdateParams } from '../../contract/staticPage'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateRefundPolicy: NextPage<IProps> = props => {
  const [detail, setDetail] = useState<IStaticPageDetail>(null)

  useLoginEffect(() => {
    getRefundPolicyDetail().then(resp => {
      setDetail(resp)
    })
  }, [])

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getRefundPolicyPageUrl(),
    },
    {
      label: 'Edit',
      url: getRefundPolicyUpdatePageUrl(),
    },
  ]

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'title',
      value: detail?.title,
      title: 'Title',
      placeholder: 'Title',
      type: 'INPUT',
    },
    {
      key: 'body',
      value: detail?.body,
      title: 'Body',
      subTitle: 'Raw HTML body',
      placeholder: 'Body',
      type: 'TEXTAREA',
      textAreaProps: {
        className: 'h-[500px]',
      },
    },
  ]

  const onSubmit = inputMap => {
    const params: IStaticPageUpdateParams = {
      title: inputMap['title'],
      body: inputMap['body'],
    }

    updateRefundPolicyDetail(params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getRefundPolicyPageUrl(),
          },
          applicationContext,
          router
        )
      }
    })
  }

  return (
    <div className="" key={detail?.title}>
      <PageLayout links={links}>
        {!detail ? <PageLoader message="Loading detail..." /> : <FormLayout inputs={formInputs} onSubmit={onSubmit} />}
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
          title: 'Refund Policy - Update - CMS',
        },
        headerTitle: 'Refund Policy - Update',
      },
    },
  }
}

export default UpdateRefundPolicy
