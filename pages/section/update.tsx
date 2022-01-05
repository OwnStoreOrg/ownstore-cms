import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import FormLayout, { IFormLayoutInput } from '../../components/layout/FormLayout'
import { useRouter } from 'next/router'
import Delete from '../../components/layout/Delete'
import useLoginEffect from '../../hooks/useLoginEffect'
import { onDeleteSuccess, onUpdateSuccess } from '../../utils/layout'
import ApplicationContext from '../../components/ApplicationContext'
import { ISectionInfo, ISectionInfoUpdateParams } from '../../contract/section'
import { deleteSection, getAllSections, getSectionById, updateSection } from '../../http/section'
import {
  getSectionItemsAddPageUrl,
  getSectionItemsPageUrl,
  getSectionPageUrl,
  getSectionUpdatePageUrl,
} from '../../utils/section'
import { SectionType } from '../../contract/constants'
import CoreLink from '../../components/core/CoreLink'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateSection: NextPage<IProps> = props => {
  const [section, setSection] = useState<ISectionInfo | null>(null)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any
  const id = section?.id

  useLoginEffect(() => {
    if (updateQueryId) {
      getSectionById(updateQueryId).then(resp => {
        setSection(resp)
      })
    } else {
      setSection(null)
    }
  }, [updateQueryId])

  let links: IPageLink[] = []

  if (updateQueryId) {
    links = [
      {
        label: 'Sections',
        url: getSectionPageUrl(),
      },
      {
        label: 'Basic Info',
        url: getSectionUpdatePageUrl(updateQueryId),
      },
      {
        label: 'View Items',
        url: getSectionItemsPageUrl(updateQueryId),
      },
      {
        label: 'Add Item',
        url: getSectionItemsAddPageUrl(updateQueryId),
      },
    ]
  } else {
    links = [
      {
        label: 'View',
        url: getSectionPageUrl(),
      },
      {
        label: 'Add',
        url: getSectionUpdatePageUrl(),
      },
    ]
  }

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: section?.id.toString(),
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'name',
      value: section?.name,
      title: 'Name',
      subTitle: 'Name of the section. Used for slug preparation and unique identification',
      placeholder: 'Name',
      type: 'INPUT',
    },
    {
      key: 'title',
      value: section?.title,
      title: 'Title',
      subTitle: 'Header for the section',
      placeholder: 'Title',
      type: 'INPUT',
      optional: true,
    },
    {
      key: 'subTitle',
      value: section?.subTitle,
      title: 'SubTitle',
      subTitle: 'Sub-header for the section',
      placeholder: 'SubTitle',
      type: 'INPUT',
      optional: true,
    },
    {
      key: 'showMoreUrl',
      value: section?.showMoreUrl,
      title: 'Show more URL',
      subTitle: 'A link will be shown for users to view more',
      placeholder: 'URL',
      type: 'INPUT',
      optional: true,
    },
    {
      key: 'showDivider',
      value: section?.showDivider || false,
      title: 'Show divider',
      subTitle: 'Show divider at the bottom. This is for UI',
      placeholder: 'Show',
      type: 'CHECKBOX',
      optional: true,
    },
    {
      key: 'type',
      value: section?.type,
      title: 'Type',
      subTitle: 'Type of the section',
      placeholder: 'Type',
      type: 'SELECT',
      selectProps: {
        options: Object.entries(SectionType).map(([key, value]) => ({
          id: value,
          label: value,
          value: value,
          selected: section?.type === value,
        })),
      },
    },
  ]

  const onSubmit = inputMap => {
    const params: ISectionInfoUpdateParams = {
      name: inputMap['name'],
      title: inputMap['title'] || null,
      subTitle: inputMap['subTitle'] || null,
      showMoreUrl: inputMap['showMoreUrl'] || null,
      showDivider: inputMap['showDivider'] || null,
      type: inputMap['type'],
    }

    updateSection(id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getSectionPageUrl(),
          },
          applicationContext,
          router
        )
      }
    })
  }

  const onDelete = () => {
    deleteSection(id)
      .then(resp => {
        if (resp.success) {
          onDeleteSuccess(
            {
              url: getSectionPageUrl(),
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
          title: 'Section - Update - CMS',
        },
        headerTitle: 'Section - Update',
      },
    },
  }
}

export default UpdateSection
