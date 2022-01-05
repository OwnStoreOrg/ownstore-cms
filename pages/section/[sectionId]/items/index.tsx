import React, { useState } from 'react'
import { IGlobalLayoutProps } from '../../../_app'
import { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import PageLayout from '../../../../components/layout/PageLayout'
import { IPageLink } from '../../../../components/layout/PageLinks'
import { useRouter } from 'next/router'
import useLoginEffect from '../../../../hooks/useLoginEffect'
import { ISectionInfo, ISectionInfoUpdateParams, SectionInfoItem } from '../../../../contract/section'
import {
  getSectionItemDisplayInfo,
  getSectionItems,
  getSectionItemsAddPageUrl,
  getSectionItemsPageUrl,
  getSectionPageUrl,
  getSectionUpdatePageUrl,
} from '../../../../utils/section'
import IndexViewLayout, { IIndexViewItem } from '../../../../components/layout/IndexViewLayout'
import { getSectionById } from '../../../../http/section'
import PageLoader from '../../../../components/loader/PageLoader'
import SectionItemUpdateModal from '../../../../components/section/SectionItemUpdateModal'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const SectionItems: NextPage<IProps> = props => {
  const router = useRouter()

  if (router.isFallback) {
    return <PageLoader message="Loading page content..." />
  }

  const [section, setSection] = useState<ISectionInfo>(null)
  const [list, setList] = useState<SectionInfoItem[]>([])
  const [fetching, setFetching] = useState(false)

  const [selectedItem, setSelectedItem] = useState(null)

  const sectionId = router.query.sectionId as any

  useLoginEffect(() => {
    setFetching(true)

    getSectionById(sectionId)
      .then(resp => {
        setSection(resp)
        setList(getSectionItems(resp))
      })
      .finally(() => {
        setFetching(false)
      })
  }, [])

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

  const handItemClick = (e: any, item: IIndexViewItem) => {
    e.preventDefault()
    setSelectedItem(list.find(l => l.id === item.id))
  }

  return (
    <div className="">
      <PageLayout links={links}>
        <div>
          <IndexViewLayout
            items={list.map(item => {
              const displayInfo = getSectionItemDisplayInfo(section.type, item)
              return {
                id: item.id,
                label: displayInfo.title,
                description: displayInfo.description,
                isInactive: !item.isActive,
              }
            })}
            showLoader={fetching}
            onClick={handItemClick}
          />
        </div>

        {selectedItem ? (
          <SectionItemUpdateModal
            sectionItem={selectedItem}
            section={section}
            dismissModal={() => setSelectedItem(null)}
          />
        ) : null}
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
          title: 'Section Items - CMS',
        },
        headerTitle: 'Section Items',
      },
    },
  }
}

export default SectionItems
