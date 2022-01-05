import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import { useRouter } from 'next/router'
import useLoginEffect from '../../hooks/useLoginEffect'
import ApplicationContext from '../../components/ApplicationContext'
import { getCatalogueById } from '../../http/catalogue'
import { getCatalogueImagesPageUrl, getCataloguePageUrl, getCatalogueUpdatePageUrl } from '../../utils/catalogue'
import { ICatalogueInfo } from '../../contract/catalogue'
import NoContent from '../../components/NoContent'
import ImageInfo from '../../components/image/ImageInfo'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const CatalogueImages: NextPage<IProps> = props => {
  const [catalogue, setCatalogue] = useState<ICatalogueInfo | null>(null)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const catalogueId = router.query.id as any

  useLoginEffect(() => {
    if (catalogueId) {
      getCatalogueById(catalogueId).then(resp => {
        setCatalogue(resp)
      })
    }
  }, [catalogueId])

  const links: IPageLink[] = [
    {
      label: 'Catalogues',
      url: getCataloguePageUrl(),
    },
    {
      label: 'Basic Info',
      url: getCatalogueUpdatePageUrl(catalogueId),
    },
    {
      label: 'Images',
      url: getCatalogueImagesPageUrl(catalogueId),
    },
  ]

  return (
    <div className="">
      <PageLayout links={links}>
        {!catalogue?.images ? (
          <NoContent message="Nothing to show." />
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {catalogue.images.map(image => (
              <ImageInfo key={image.id} image={image} />
            ))}
          </div>
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
          title: 'Catalogue Images - Update - CMS',
        },
        headerTitle: 'Catalogue Images - Update',
      },
    },
  }
}

export default CatalogueImages
