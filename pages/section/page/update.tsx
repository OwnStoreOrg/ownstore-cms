import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../../components/layout/PageLayout'
import { IPageLink } from '../../../components/layout/PageLinks'
import FormLayout, { IFormLayoutInput } from '../../../components/layout/FormLayout'
import { useRouter } from 'next/router'
import Delete from '../../../components/layout/Delete'
import useLoginEffect from '../../../hooks/useLoginEffect'
import { onDeleteSuccess, onUpdateSuccess } from '../../../utils/layout'
import ApplicationContext from '../../../components/ApplicationContext'
import { IPageSectionInfoUpdateParams, ISectionInfo } from '../../../contract/section'
import { deletePageSection, getPageSectionById, updatePageSection } from '../../../http/section'
import { getPageSectionsPageUrl, getPageSectionsUpdatePageUrl } from '../../../utils/section'
import { CoreTextInputType } from '../../../components/core/CoreInput'
import { PageSectionType } from '../../../contract/constants'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdatePageSection: NextPage<IProps> = props => {
  const [section, setSection] = useState<ISectionInfo | null>(null)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any
  const pageType = (router.query.pageType || null) as any

  const id = section?.id

  useLoginEffect(() => {
    if (updateQueryId) {
      getPageSectionById(updateQueryId, pageType as PageSectionType).then(resp => {
        setSection(resp)
      })
    } else {
      setSection(null)
    }
  }, [updateQueryId])

  const links: IPageLink[] = [
    {
      label: 'Home Sections',
      url: getPageSectionsPageUrl(PageSectionType.HOME),
    },
    {
      label: 'Individual Product Sections',
      url: getPageSectionsPageUrl(PageSectionType.INDIVIDUAL_PRODUCT),
    },
    {
      label: 'Combo Product Sections',
      url: getPageSectionsPageUrl(PageSectionType.COMBO_PRODUCT),
    },
    {
      label: 'Explore Sections',
      url: getPageSectionsPageUrl(PageSectionType.EXPLORE),
    },
    {
      label: 'Error Sections',
      url: getPageSectionsPageUrl(PageSectionType.ERROR),
    },
    {
      label: 'Search Sections',
      url: getPageSectionsPageUrl(PageSectionType.SEARCH),
    },
  ]

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: section?.pageSection.id.toString(),
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'sectionId',
      value: section?.id.toString(),
      title: 'Section ID',
      placeholder: 'Section ID',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'position',
      value: section?.position,
      title: 'Position',
      subTitle: 'Position in the section row',
      placeholder: 'Position',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'title',
      value: section?.title,
      title: 'Title',
      subTitle: 'Override default section header for this page',
      placeholder: 'Title',
      type: 'INPUT',
      optional: true,
    },
    {
      key: 'subTitle',
      value: section?.subTitle,
      title: 'SubTitle',
      subTitle: 'Override default section sub-header for this page',
      placeholder: 'SubTitle',
      type: 'INPUT',
      optional: true,
    },
    {
      key: 'showMoreUrl',
      value: section?.showMoreUrl,
      title: 'Show more URL',
      subTitle: 'Override default section more URL for this page',
      placeholder: 'URL',
      type: 'INPUT',
      optional: true,
    },
    {
      key: 'showDivider',
      value: section?.showDivider,
      title: 'Show divider',
      subTitle: 'Override default section divider rule for this page',
      placeholder: 'Show',
      type: 'CHECKBOX',
      optional: true,
    },
  ]

  const onSubmit = inputMap => {
    const params: IPageSectionInfoUpdateParams = {
      sectionId: inputMap['sectionId'],
      position: inputMap['position'],
      title: inputMap['title'] || null,
      subTitle: inputMap['subTitle'] || null,
      showMoreUrl: inputMap['showMoreUrl'] || null,
      showDivider: inputMap['showDivider'] === undefined ? null : inputMap['showDivider'],
    }

    updatePageSection(section?.pageSection.id || null, pageType, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getPageSectionsPageUrl(pageType),
          },
          applicationContext,
          router
        )
      }
    })
  }

  const onDelete = () => {
    deletePageSection(section.pageSection.id, pageType)
      .then(resp => {
        if (resp.success) {
          onDeleteSuccess(
            {
              url: getPageSectionsPageUrl(pageType),
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
          title: 'Page Section - Update - CMS',
        },
        headerTitle: 'Page Section - Update',
      },
    },
  }
}

export default UpdatePageSection
