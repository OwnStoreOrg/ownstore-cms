import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../../../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../../../components/layout/PageLayout'
import { IPageLink } from '../../../../components/layout/PageLinks'
import { useRouter } from 'next/router'
import useLoginEffect from '../../../../hooks/useLoginEffect'
import ApplicationContext from '../../../../components/ApplicationContext'
import { getComboProductDetail } from '../../../../http/product'
import {
  getComboProductAttributesUpdatePageUrl,
  getComboProductFeatureSectionsUpdatePageUrl,
  getComboProductImagesUpdatePageUrl,
  getComboProductPageUrl,
  getComboProductSKUUpdatePageUrl,
  getComboProductTagsUpdatePageUrl,
  getComboProductUpdatePageUrl,
} from '../../../../utils/product'
import { IComboProductDetail } from '../../../../contract/product'
import NoContent from '../../../../components/NoContent'
import ImageInfo from '../../../../components/image/ImageInfo'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const ComboProductImages: NextPage<IProps> = props => {
  const [product, setProduct] = useState<IComboProductDetail | null>(null)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const productId = router.query.id as any

  useLoginEffect(() => {
    if (productId) {
      getComboProductDetail(productId).then(resp => {
        setProduct(resp)
      })
    }
  }, [productId])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getComboProductPageUrl(),
    },
  ]

  if (productId) {
    links.push({
      label: 'Basic Info',
      url: getComboProductUpdatePageUrl(productId),
    })
    links.push({
      label: 'SKU *',
      url: getComboProductSKUUpdatePageUrl(productId),
    })
    links.push({
      label: 'Tags',
      url: getComboProductTagsUpdatePageUrl(productId),
    })
    links.push({
      label: 'Attributes',
      url: getComboProductAttributesUpdatePageUrl(productId),
    })
    links.push({
      label: 'Feature Sections',
      url: getComboProductFeatureSectionsUpdatePageUrl(productId),
    })
    links.push({
      label: 'Images',
      url: getComboProductImagesUpdatePageUrl(productId),
    })
  } else {
    links.push({
      label: 'Add',
      url: getComboProductUpdatePageUrl(),
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
          title: 'Combo Product Images - Update - CMS',
        },
        headerTitle: 'Combo Product Images - Update',
      },
    },
  }
}

export default ComboProductImages
