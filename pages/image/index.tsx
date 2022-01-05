import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import IndexViewLayout, { IIndexViewItem } from '../../components/layout/IndexViewLayout'
import useLoginEffect from '../../hooks/useLoginEffect'
import { getAllCatalogues } from '../../http/catalogue'
import { getCataloguePageUrl, getCatalogueSearchPageUrl, getCatalogueUpdatePageUrl } from '../../utils/catalogue'
import { getLayoutFindParams } from '../../utils/common'
import { useRouter } from 'next/router'
import LayoutPagination from '../../components/layout/LayoutPagination'
import { IImageInfo } from '../../contract/image'
import { getAllImages } from '../../http/image'
import { getImagePageUrl, getImageSearchPageUrl, getImageUpdatePageUrl } from '../../utils/image'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../../components/core/CoreButton'
import { PlusIcon } from '@heroicons/react/outline'
import NoContent from '../../components/NoContent'
import ImageInfo from '../../components/image/ImageInfo'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const Image: NextPage<IProps> = props => {
  const [images, setImages] = useState<IImageInfo[]>([])
  const [fetching, setFetching] = useState(false)

  const router = useRouter()

  useLoginEffect(() => {
    setFetching(true)

    getAllImages({
      ...getLayoutFindParams(router),
    })
      .then(resp => {
        setImages(resp)
      })
      .finally(() => {
        setFetching(false)
      })
  }, [router.asPath])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getImagePageUrl(),
      pagePaths: ['/image'],
    },
    {
      label: 'Search',
      url: getImageSearchPageUrl(),
    },
    {
      label: 'Add',
      url: getImageUpdatePageUrl(),
    },
  ]

  return (
    <div className="">
      <PageLayout links={links}>
        <div>
          <div className="flex justify-end mb-4">
            <CoreButton
              label={
                <React.Fragment>
                  <PlusIcon className="w-5 mr-1" />
                  <span>Add Image</span>
                </React.Fragment>
              }
              size={CoreButtonSize.MEDIUM}
              type={CoreButtonType.SOLID_SECONDARY}
              url={getImageUpdatePageUrl()}
            />
          </div>

          {!images.length ? (
            <NoContent message="Nothing to show." />
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {images.map(item => (
                <ImageInfo key={item.id} image={item} />
              ))}
            </div>
          )}

          <LayoutPagination />
        </div>
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
          title: 'Image - CMS',
        },
        headerTitle: 'Image',
      },
    },
  }
}

export default Image
