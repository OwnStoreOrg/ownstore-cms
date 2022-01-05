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
import { getPrivacyPolicyDetail, updatePrivacyPolicyDetail } from '../../http/privacyPolicy'
import { getPrivacyPolicyPageUrl, getPrivacyPolicyUpdatePageUrl } from '../../utils/privacyPolicy'
import PageLoader from '../../components/loader/PageLoader'
import { IStaticPageDetail, IStaticPageUpdateParams } from '../../contract/staticPage'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdatePrivacyPolicy: NextPage<IProps> = props => {
  const [detail, setDetail] = useState<IStaticPageDetail>(null)

  useLoginEffect(() => {
    getPrivacyPolicyDetail().then(resp => {
      setDetail(resp)
    })
  }, [])

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getPrivacyPolicyPageUrl(),
    },
    {
      label: 'Edit',
      url: getPrivacyPolicyUpdatePageUrl(),
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

    updatePrivacyPolicyDetail(params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getPrivacyPolicyPageUrl(),
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
          title: 'Privacy Policy - Update - CMS',
        },
        headerTitle: 'Privacy Policy - Update',
      },
    },
  }
}

export default UpdatePrivacyPolicy
