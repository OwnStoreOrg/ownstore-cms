import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../../../_app'
import { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import PageLayout from '../../../../components/layout/PageLayout'
import { IPageLink } from '../../../../components/layout/PageLinks'
import { useRouter } from 'next/router'
import useLoginEffect from '../../../../hooks/useLoginEffect'
import ApplicationContext from '../../../../components/ApplicationContext'
import SectionItemUpdateForm, {
  SectionItemUpdateFormLayoutType,
} from '../../../../components/section/SectionItemUpdateForm'
import { ISectionInfo } from '../../../../contract/section'
import { getSectionById } from '../../../../http/section'
import PageLoader from '../../../../components/loader/PageLoader'
import {
  getSectionItemsAddPageUrl,
  getSectionItemsPageUrl,
  getSectionPageUrl,
  getSectionUpdatePageUrl,
} from '../../../../utils/section'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const AddSectionItems: NextPage<IProps> = props => {
  const [section, setSection] = useState<ISectionInfo>(null)
  const [fetching, setFetching] = useState(false)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const sectionId = router.query.sectionId as any

  useLoginEffect(() => {
    if (sectionId) {
      setFetching(true)

      getSectionById(sectionId)
        .then(resp => {
          setSection(resp)
        })
        .finally(() => {
          setFetching(false)
        })
    }
  }, [sectionId])

  const links: IPageLink[] = [
    {
      label: 'Sections',
      url: getSectionPageUrl(),
    },
    {
      label: 'Basic Info',
      url: getSectionUpdatePageUrl(sectionId),
    },
    {
      label: 'View Items',
      url: getSectionItemsPageUrl(sectionId),
    },
    {
      label: 'Add Item',
      url: getSectionItemsAddPageUrl(sectionId),
    },
  ]

  return (
    <div className="">
      <PageLayout links={links}>
        {!section ? (
          <PageLoader message="Loading content..." />
        ) : (
          <SectionItemUpdateForm layout={SectionItemUpdateFormLayoutType.PAGE} section={section} sectionItem={null} />
        )}
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
          title: 'Section Items - Add - CMS',
        },
        headerTitle: 'Section Items - Add',
      },
    },
  }
}

export default AddSectionItems
