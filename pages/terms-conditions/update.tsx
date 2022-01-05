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
import { getTnCDetail, updateTnCDetail } from '../../http/tnc'
import { getTnCPageUrl, getTnCUpdatePageUrl } from '../../utils/tnc'
import PageLoader from '../../components/loader/PageLoader'
import { IStaticPageDetail, IStaticPageUpdateParams } from '../../contract/staticPage'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateTnC: NextPage<IProps> = props => {
  const [detail, setDetail] = useState<IStaticPageDetail>(null)

  useLoginEffect(() => {
    getTnCDetail().then(resp => {
      setDetail(resp)
    })
  }, [])

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getTnCPageUrl(),
    },
    {
      label: 'Edit',
      url: getTnCUpdatePageUrl(),
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

    updateTnCDetail(params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getTnCPageUrl(),
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
          title: 'Terms & Conditions - Update - CMS',
        },
        headerTitle: 'Terms & Conditions - Update',
      },
    },
  }
}

export default UpdateTnC
