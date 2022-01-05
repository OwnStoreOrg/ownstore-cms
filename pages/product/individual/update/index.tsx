import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../../../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../../../components/layout/PageLayout'
import { IPageLink } from '../../../../components/layout/PageLinks'
import FormLayout, { IFormLayoutInput } from '../../../../components/layout/FormLayout'
import { useRouter } from 'next/router'
import useLoginEffect from '../../../../hooks/useLoginEffect'
import { onDeleteSuccess, onUpdateSuccess } from '../../../../utils/layout'
import ApplicationContext from '../../../../components/ApplicationContext'
import { CoreTextInputType } from '../../../../components/core/CoreInput'
import { IIndividualProductDetail, IIndividualProductDetailUpdateParams } from '../../../../contract/product'
import { getIndividualProductDetail, updateIndividualProductDetail } from '../../../../http/product'
import {
  getIndividualProductAttributesUpdatePageUrl,
  getIndividualProductFeatureSectionsUpdatePageUrl,
  getIndividualProductImagesUpdatePageUrl,
  getIndividualProductPageUrl,
  getIndividualProductSKUUpdatePageUrl,
  getIndividualProductTagsUpdatePageUrl,
  getIndividualProductUpdatePageUrl,
} from '../../../../utils/product'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateIndividualProduct: NextPage<IProps> = props => {
  const [product, setProduct] = useState<IIndividualProductDetail | null>(null)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any
  const id = product?.id

  useLoginEffect(() => {
    if (updateQueryId) {
      getIndividualProductDetail(updateQueryId).then(resp => {
        setProduct(resp)
      })
    } else {
      setProduct(null)
    }
  }, [updateQueryId])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getIndividualProductPageUrl(),
    },
  ]

  if (updateQueryId) {
    links.push({
      label: 'Basic Info',
      url: getIndividualProductUpdatePageUrl(updateQueryId),
    })
    links.push({
      label: 'SKU *',
      url: getIndividualProductSKUUpdatePageUrl(updateQueryId),
    })
    links.push({
      label: 'Tags',
      url: getIndividualProductTagsUpdatePageUrl(updateQueryId),
    })
    links.push({
      label: 'Attributes',
      url: getIndividualProductAttributesUpdatePageUrl(updateQueryId),
    })
    links.push({
      label: 'Feature Sections',
      url: getIndividualProductFeatureSectionsUpdatePageUrl(updateQueryId),
    })
    links.push({
      label: 'Images',
      url: getIndividualProductImagesUpdatePageUrl(updateQueryId),
    })
  } else {
    links.push({
      label: 'Add',
      url: getIndividualProductUpdatePageUrl(),
    })
  }

  const infoFormInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: product?.id,
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'name',
      value: product?.name,
      title: 'Name',
      subTitle: 'Name of the product. Also used for slug preparation',
      placeholder: 'Name',
      type: 'INPUT',
    },
    {
      key: 'shortName',
      value: product?.shortName,
      title: 'Short name',
      placeholder: 'Short name',
      optional: true,
      type: 'INPUT',
    },
    {
      key: 'description',
      value: product?.description,
      title: 'Description',
      placeholder: 'Description',
      type: 'TEXTAREA',
      textAreaProps: {
        className: 'h-[300px]',
      },
    },
    {
      key: 'seoTitle',
      value: product?.seo.title,
      title: 'SEO Title',
      subTitle: 'Optional title for SEO',
      placeholder: 'SEO Title',
      type: 'INPUT',
      optional: true,
    },
    {
      key: 'seoDescription',
      value: product?.seo.description,
      title: 'SEO Description',
      subTitle: 'Optional description for SEO',
      placeholder: 'SEO Description',
      type: 'INPUT',
      optional: true,
    },
    {
      key: 'seoKeywords',
      value: product?.seo.keywords?.join(','),
      title: 'SEO Keywords',
      subTitle: 'Optional keywords for SEO. Use comma (,) to add multiple',
      placeholder: 'SEO Keywords',
      type: 'TEXTAREA',
      textAreaProps: {
        className: 'h-[100px]',
      },
      optional: true,
    },
    {
      key: 'catalogueId',
      value: product?.catalogue.id,
      title: 'Catalogue ID',
      subTitle: 'Catalogue of the product',
      placeholder: 'Catalogue ID',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'imageIds',
      value: product?.images.map(image => image.id).join(','),
      title: 'Image IDs',
      subTitle: 'Image IDs separated by a comma (,). Add atleast 2 images for better UX (app logo also works).',
      placeholder: 'Image IDs',
      textAreaProps: {
        className: 'h-[100px]',
      },
      type: 'TEXTAREA',
    },
    {
      key: 'position',
      value: product?.position,
      title: 'Position',
      subTitle: 'General position of the product',
      placeholder: 'Position',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'isActive',
      value: product?.isActive || false,
      title: 'Active',
      subTitle: 'Disable product',
      placeholder: 'Active',
      type: 'CHECKBOX',
    },
    //
    {
      key: 'brandId',
      value: product?.brand?.id,
      title: 'Brand ID',
      subTitle: 'Brand associated with this product',
      placeholder: 'Brand ID',
      optional: true,
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'productsRelationId',
      value: product?.productsRelation?.id,
      title: 'Products Relation ID',
      subTitle: 'Relation associated with this product',
      placeholder: 'Products Relation ID',
      optional: true,
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
  ]

  const onInfoSubmit = inputMap => {
    const params: IIndividualProductDetailUpdateParams = {
      basic: {
        name: inputMap['name'],
        shortName: inputMap['shortName'] || null,
        description: inputMap['description'],
        seo: {
          title: inputMap['seoTitle'] || null,
          description: inputMap['seoDescription'] || null,
          keywords: inputMap['seoKeywords'] ? inputMap['seoKeywords'].split(',') : null,
        },
        catalogueId: Number(inputMap['catalogueId']),
        imageIds: inputMap['imageIds'],
        position: Number(inputMap['position']),
        isActive: inputMap['isActive'],
      },
      //
      brandId: inputMap['brandId'] || null,
      productsRelationId: inputMap['productsRelationId'] || null,
      sku: null,
      tags: null,
      attributes: null,
      featureSections: null,
    }

    updateIndividualProductDetail(id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getIndividualProductPageUrl(),
          },
          applicationContext,
          router
        )
      }
    })
  }

  return (
    <div className="" key={id}>
      <PageLayout links={links}>
        <FormLayout inputs={infoFormInputs} onSubmit={onInfoSubmit} />
        {/* {id ? (
          <CoreLink url={getCatalogueImagesPageUrl(id)} className="underline font-medium font-primary-medium">
            View/Edit Images
          </CoreLink>
        ) : null} */}
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
          title: 'Product - Update - CMS',
        },
        headerTitle: 'Product - Update',
      },
    },
  }
}

export default UpdateIndividualProduct
