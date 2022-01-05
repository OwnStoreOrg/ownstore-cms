import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../../_app'
import { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import PageLayout from '../../../components/layout/PageLayout'
import { IPageLink } from '../../../components/layout/PageLinks'
import FormLayout, { IFormLayoutInput } from '../../../components/layout/FormLayout'
import { useRouter } from 'next/router'
import { toastSuccess } from '../../../components/Toaster'
import Delete from '../../../components/layout/Delete'
import useLoginEffect from '../../../hooks/useLoginEffect'
import { IFAQInfo, IFAQInfoUpdateParams, IFAQTopicInfo, IFAQTopicInfoUpdateParams } from '../../../contract/faq'
import { deleteFAQ, deleteFAQTopic, getFAQById, getFAQTopicById, updateFAQ, updateFAQTopic } from '../../../http/faq'
import { getFAQPageUrl, getFAQTopicPageUrl, getFAQTopicUpdatePageUrl, getFAQUpdatePageUrl } from '../../../utils/faq'
import { CoreTextInputType } from '../../../components/core/CoreInput'
import PageLoader from '../../../components/loader/PageLoader'
import ApplicationContext from '../../../components/ApplicationContext'
import { onDeleteSuccess, onUpdateSuccess } from '../../../utils/layout'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateFAQ: NextPage<IProps> = props => {
  const router = useRouter()

  if (router.isFallback) {
    return <PageLoader message="Loading page content..." />
  }

  const [faqInfo, setFaqInfo] = useState<IFAQInfo | null>(null)

  const topicId = router.query.topicId as any
  const updateQueryId = router.query.id as any
  const id = faqInfo?.id

  const applicationContext = useContext(ApplicationContext)

  useLoginEffect(() => {
    if (updateQueryId) {
      getFAQById(updateQueryId).then(resp => {
        setFaqInfo(resp)
      })
    } else {
      setFaqInfo(null)
    }
  }, [updateQueryId])

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

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: faqInfo?.id.toString(),
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'question',
      value: faqInfo?.question,
      title: 'Question',
      placeholder: 'Question',
      type: 'INPUT',
    },
    {
      key: 'answer',
      value: faqInfo?.answer,
      title: 'Answer',
      placeholder: 'Answer',
      type: 'TEXTAREA',
      textAreaProps: {
        className: 'h-[200px]',
      },
    },
    {
      key: 'position',
      value: faqInfo?.position,
      title: 'Position',
      placeholder: 'Position',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'isActive',
      value: faqInfo?.isActive || false,
      title: 'Active',
      placeholder: 'Active',
      type: 'CHECKBOX',
    },
  ]

  const onSubmit = inputMap => {
    const params: IFAQInfoUpdateParams = {
      topicId: topicId,
      question: inputMap['question'],
      answer: inputMap['answer'],
      isActive: inputMap['isActive'],
      position: inputMap['position'],
    }

    updateFAQ(id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getFAQPageUrl(topicId),
          },
          applicationContext,
          router
        )
      }
    })
  }

  const onDelete = () => {
    deleteFAQ(id)
      .then(resp => {
        if (resp.success) {
          onDeleteSuccess(
            {
              url: getFAQPageUrl(topicId),
            },
            applicationContext,
            router
          )
        }
      })
      .catch(console.error)
  }

  return (
    <div className="" key={id}>
      <PageLayout links={links}>
        {id ? <Delete onDelete={onDelete} /> : null}
        <FormLayout inputs={formInputs} onSubmit={onSubmit} />
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
          title: 'FAQ - Update - CMS',
        },
        headerTitle: 'FAQ - Update',
      },
    },
  }
}

export default UpdateFAQ
