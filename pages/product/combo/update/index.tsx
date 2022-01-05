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
import { IComboProductDetail, IComboProductDetailUpdateParams } from '../../../../contract/product'
import { getComboProductDetail, updateComboProductDetail } from '../../../../http/product'
import {
  getComboProductAttributesUpdatePageUrl,
  getComboProductFeatureSectionsUpdatePageUrl,
  getComboProductImagesUpdatePageUrl,
  getComboProductPageUrl,
  getComboProductSKUUpdatePageUrl,
  getComboProductTagsUpdatePageUrl,
  getComboProductUpdatePageUrl,
} from '../../../../utils/product'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateComboProduct: NextPage<IProps> = props => {
  const [product, setProduct] = useState<IComboProductDetail | null>(null)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any
  const id = product?.id

  useLoginEffect(() => {
    if (updateQueryId) {
      getComboProductDetail(updateQueryId).then(resp => {
        setProduct(resp)
      })
    } else {
      setProduct(null)
    }
  }, [updateQueryId])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getComboProductPageUrl(),
    },
  ]

  if (updateQueryId) {
    links.push({
      label: 'Basic Info',
      url: getComboProductUpdatePageUrl(updateQueryId),
    })
    links.push({
      label: 'SKU *',
      url: getComboProductSKUUpdatePageUrl(updateQueryId),
    })
    links.push({
      label: 'Tags',
      url: getComboProductTagsUpdatePageUrl(updateQueryId),
    })
    links.push({
      label: 'Attributes',
      url: getComboProductAttributesUpdatePageUrl(updateQueryId),
    })
    links.push({
      label: 'Feature Sections',
      url: getComboProductFeatureSectionsUpdatePageUrl(updateQueryId),
    })
    links.push({
      label: 'Images',
      url: getComboProductImagesUpdatePageUrl(updateQueryId),
    })
  } else {
    links.push({
      label: 'Add',
      url: getComboProductUpdatePageUrl(),
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
    const params: IComboProductDetailUpdateParams = {
      basic: {
        name: inputMap['name'],
        shortName: inputMap['shortName'] || null,
        description: inputMap['description'],
        seo: {
          title: inputMap['seoTitle'] || null,
          description: inputMap['seoDescription'] || null,
          keywords: inputMap['seoKeywords'] ? inputMap['seoKeywords'].split(',') : null,
        },
        imageIds: inputMap['imageIds'],
        position: Number(inputMap['position']),
        isActive: inputMap['isActive'],
      },
      //
      productsRelationId: inputMap['productsRelationId'] || null,
      sku: null,
      tags: null,
      attributes: null,
      featureSections: null,
    }

    updateComboProductDetail(id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getComboProductPageUrl(),
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
          title: 'Combo Product - Update - CMS',
        },
        headerTitle: 'Combo Product - Update',
      },
    },
  }
}

export default UpdateComboProduct
