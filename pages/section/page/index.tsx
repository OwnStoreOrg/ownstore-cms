import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from './../../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../../components/layout/PageLayout'
import { IPageLink } from '../../../components/layout/PageLinks'
import IndexViewLayout, { IIndexViewItem, IndexViewLayoutHeader } from '../../../components/layout/IndexViewLayout'
import useLoginEffect from '../../../hooks/useLoginEffect'
import { getAllPageSections } from '../../../http/section'
import { getPageSectionsPageUrl, getPageSectionsUpdatePageUrl } from '../../../utils/section'
import { useRouter } from 'next/router'
import { PageSectionType } from '../../../contract/constants'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../../../components/core/CoreButton'
import { PlusIcon } from '@heroicons/react/outline'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const PageSections: NextPage<IProps> = props => {
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  const router = useRouter()
  const pageType = router.query.pageType

  useLoginEffect(() => {
    if (pageType) {
      setFetching(true)

      getAllPageSections(pageType as PageSectionType)
        .then(resp => {
          const newList = resp.map(r => {
            return {
              id: r.id,
              label: `${r.name}`,
              editUrl: getPageSectionsUpdatePageUrl(pageType as PageSectionType, r.pageSection.id),
            }
          })

          setList(newList)
        })
        .finally(() => {
          setFetching(false)
        })
    }
  }, [pageType])

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

  return (
    <div className="">
      <PageLayout links={links}>
        <div className="flex justify-end mb-4">
          <CoreButton
            label={
              <React.Fragment>
                <PlusIcon className="w-5 mr-1" />
                <span>Add Section</span>
              </React.Fragment>
            }
            size={CoreButtonSize.MEDIUM}
            type={CoreButtonType.SOLID_SECONDARY}
            url={getPageSectionsUpdatePageUrl(pageType as PageSectionType)}
          />
        </div>
        <IndexViewLayout items={list} showLoader={fetching} />
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
          title: 'Page Sections - CMS',
        },
        headerTitle: 'Page Sections',
      },
    },
  }
}

export default PageSections
