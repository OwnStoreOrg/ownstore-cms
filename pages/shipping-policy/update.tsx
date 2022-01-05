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
import { getShippingPolicyDetail, updateShippingPolicyDetail } from '../../http/shippingPolicy'
import { getShippingPolicyPageUrl, getShippingPolicyUpdatePageUrl } from '../../utils/shippingPolicy'
import PageLoader from '../../components/loader/PageLoader'
import { IStaticPageDetail, IStaticPageUpdateParams } from '../../contract/staticPage'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateShippingPolicy: NextPage<IProps> = props => {
  const [detail, setDetail] = useState<IStaticPageDetail>(null)

  useLoginEffect(() => {
    getShippingPolicyDetail().then(resp => {
      setDetail(resp)
    })
  }, [])

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

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

    updateShippingPolicyDetail(params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getShippingPolicyPageUrl(),
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
          title: 'Shipping Policy - Update - CMS',
        },
        headerTitle: 'Shipping Policy - Update',
      },
    },
  }
}

export default UpdateShippingPolicy
