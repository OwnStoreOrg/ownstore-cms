import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from './../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import IndexViewLayout, { IIndexViewItem, IndexViewLayoutHeader } from '../../components/layout/IndexViewLayout'
import useLoginEffect from '../../hooks/useLoginEffect'
import { getAllSections } from '../../http/section'
import { getSectionItemsPageUrl, getSectionPageUrl, getSectionUpdatePageUrl } from '../../utils/section'
import { groupBy } from '../../utils/common'
import { ISectionInfo } from '../../contract/section'
import PageLoader from '../../components/loader/PageLoader'
import NoContent from '../../components/NoContent'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const Section: NextPage<IProps> = props => {
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  const prepareIndexViewItem = (sectionInfo: ISectionInfo): IIndexViewItem => {
    return {
      id: sectionInfo.id,
      label: `${sectionInfo.name}`,
      // description: sectionInfo.title,
      editUrl: getSectionUpdatePageUrl(sectionInfo.id),
      // viewUrl: getSectionItemsPageUrl(sectionInfo.id),
    }
  }

  useLoginEffect(() => {
    setFetching(true)

    getAllSections()
      .then(resp => {
        setList(resp)
      })
      .finally(() => {
        setFetching(false)
      })
  }, [])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getSectionPageUrl(),
    },
    {
      label: 'Add',
      url: getSectionUpdatePageUrl(),
    },
  ]

  const groupedList = groupBy<ISectionInfo>(list, elem => elem.type as any)

  return (
    <div className="">
      <PageLayout links={links}>
        {fetching ? (
          <PageLoader message="Loading detail..." />
        ) : Object.keys(groupedList).length === 0 ? (
          <NoContent />
        ) : (
          <>
            {Object.entries(groupedList).map(([sectionType, sections], index) => {
              return (
                <div key={index}>
                  <IndexViewLayoutHeader title={sectionType} />
                  <IndexViewLayout items={sections.map(prepareIndexViewItem)} showNotFound={false} />
                </div>
              )
            })}
          </>
        )}
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
          title: 'Section - CMS',
        },
        headerTitle: 'Section',
      },
    },
  }
}

export default Section
