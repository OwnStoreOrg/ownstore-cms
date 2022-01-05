import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../../../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../../../components/layout/PageLayout'
import { IPageLink } from '../../../../components/layout/PageLinks'
import { useRouter } from 'next/router'
import useLoginEffect from '../../../../hooks/useLoginEffect'
import ApplicationContext from '../../../../components/ApplicationContext'
import { getIndividualProductDetail } from '../../../../http/product'
import {
  getIndividualProductAttributesUpdatePageUrl,
  getIndividualProductFeatureSectionsUpdatePageUrl,
  getIndividualProductImagesUpdatePageUrl,
  getIndividualProductPageUrl,
  getIndividualProductSKUUpdatePageUrl,
  getIndividualProductTagsUpdatePageUrl,
  getIndividualProductUpdatePageUrl,
} from '../../../../utils/product'
import { IIndividualProductDetail, IIndividualProductInfo, IProductInfo } from '../../../../contract/product'
import NoContent from '../../../../components/NoContent'
import ImageInfo from '../../../../components/image/ImageInfo'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const IndividualProductImages: NextPage<IProps> = props => {
  const [product, setProduct] = useState<IIndividualProductDetail | null>(null)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const productId = router.query.id as any

  useLoginEffect(() => {
    if (productId) {
      getIndividualProductDetail(productId).then(resp => {
        setProduct(resp)
      })
    }
  }, [productId])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getIndividualProductPageUrl(),
    },
  ]

  if (productId) {
    links.push({
      label: 'Basic Info',
      url: getIndividualProductUpdatePageUrl(productId),
    })
    links.push({
      label: 'SKU *',
      url: getIndividualProductSKUUpdatePageUrl(productId),
    })
    links.push({
      label: 'Tags',
      url: getIndividualProductTagsUpdatePageUrl(productId),
    })
    links.push({
      label: 'Attributes',
      url: getIndividualProductAttributesUpdatePageUrl(productId),
    })
    links.push({
      label: 'Feature Sections',
      url: getIndividualProductFeatureSectionsUpdatePageUrl(productId),
    })
    links.push({
      label: 'Images',
      url: getIndividualProductImagesUpdatePageUrl(productId),
    })
  } else {
    links.push({
      label: 'Add',
      url: getIndividualProductUpdatePageUrl(),
    })
  }

  return (
    <div className="">
      <PageLayout links={links}>
        {!product?.images ? (
          <NoContent message="Nothing to show." />
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {product.images.map(image => (
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
          title: 'Product Images - Update - CMS',
        },
        headerTitle: 'Product Images - Update',
      },
    },
  }
}

export default IndividualProductImages
