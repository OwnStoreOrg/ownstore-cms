import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from './../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import FormLayout, { IFormLayoutInput } from '../../components/layout/FormLayout'
import { useRouter } from 'next/router'
import { toastSuccess } from '../../components/Toaster'
import Delete from '../../components/layout/Delete'
import useLoginEffect from '../../hooks/useLoginEffect'
import { IISecurityQuestionInfoUpdateParams, ISecurityQuestionInfo } from '../../contract/security'
import { deleteSecurityQuestion, getSecurityQuestionById, updateSecurityQuestion } from '../../http/securityQuestion'
import { getSecurityQuestionPageUrl, getSecurityQuestionUpdatePageUrl } from '../../utils/securityQuestion'
import ApplicationContext from '../../components/ApplicationContext'
import { onDeleteSuccess, onUpdateSuccess } from '../../utils/layout'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateSecurityQuestion: NextPage<IProps> = props => {
  const [question, setQuestion] = useState<ISecurityQuestionInfo | null>(null)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any
  const id = question?.id

  useLoginEffect(() => {
    if (updateQueryId) {
      getSecurityQuestionById(updateQueryId).then(resp => {
        setQuestion(resp)
      })
    } else {
      setQuestion(null)
    }
  }, [updateQueryId])

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

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: question?.id.toString(),
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'question',
      value: question?.question,
      title: 'Question',
      placeholder: 'Question',
      type: 'INPUT',
    },
  ]

  const onSubmit = inputMap => {
    const params: IISecurityQuestionInfoUpdateParams = {
      question: inputMap['question'],
    }

    updateSecurityQuestion(id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getSecurityQuestionPageUrl(),
          },
          applicationContext,
          router
        )
      }
    })
  }

  const onDelete = () => {
    deleteSecurityQuestion(id)
      .then(resp => {
        if (resp.success) {
          onDeleteSuccess(
            {
              url: getSecurityQuestionPageUrl(),
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
          title: 'Security Question - Update - CMS',
        },
        headerTitle: 'Security Question - Update',
      },
    },
  }
}

export default UpdateSecurityQuestion
