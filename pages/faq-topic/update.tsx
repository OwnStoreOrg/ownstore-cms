import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import FormLayout, { IFormLayoutInput } from '../../components/layout/FormLayout'
import { useRouter } from 'next/router'
import { toastSuccess } from '../../components/Toaster'
import Delete from '../../components/layout/Delete'
import useLoginEffect from '../../hooks/useLoginEffect'
import { IFAQTopicInfo, IFAQTopicInfoUpdateParams } from '../../contract/faq'
import { deleteFAQTopic, getFAQTopicById, updateFAQTopic } from '../../http/faq'
import { getFAQTopicPageUrl, getFAQTopicUpdatePageUrl } from '../../utils/faq'
import { CoreTextInputType } from '../../components/core/CoreInput'
import ApplicationContext from '../../components/ApplicationContext'
import { onDeleteSuccess, onUpdateSuccess } from '../../utils/layout'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateFAQTopic: NextPage<IProps> = props => {
  const [faqTopic, setFAQTopicInfo] = useState<IFAQTopicInfo | null>(null)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any
  const id = faqTopic?.id

  useLoginEffect(() => {
    if (updateQueryId) {
      getFAQTopicById(updateQueryId).then(resp => {
        setFAQTopicInfo(resp)
      })
    } else {
      setFAQTopicInfo(null)
    }
  }, [updateQueryId])

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

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: faqTopic?.id.toString(),
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'name',
      value: faqTopic?.name,
      title: 'Name',
      placeholder: 'Name',
      type: 'INPUT',
    },
    {
      key: 'position',
      value: faqTopic?.position,
      title: 'Position',
      placeholder: 'Position',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'isActive',
      value: faqTopic?.isActive || false,
      title: 'Active',
      placeholder: 'Active',
      type: 'CHECKBOX',
    },
  ]

  const onSubmit = inputMap => {
    const params: IFAQTopicInfoUpdateParams = {
      name: inputMap['name'],
      isActive: inputMap['isActive'],
      position: inputMap['position'],
    }

    updateFAQTopic(id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getFAQTopicPageUrl(),
          },
          applicationContext,
          router
        )
      }
    })
  }

  const onDelete = () => {
    deleteFAQTopic(id)
      .then(resp => {
        if (resp.success) {
          onDeleteSuccess(
            {
              url: getFAQTopicPageUrl(),
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

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: null,
      layoutData: {
        seo: {
          title: 'FAQ Topic - Update - CMS',
        },
        headerTitle: 'FAQ Topic - Update',
      },
    },
  }
}

export default UpdateFAQTopic
