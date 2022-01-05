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
import NoContent from '../../../../components/NoContent'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateIndividualProductSKU: NextPage<IProps> = props => {
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
      key: 'productId',
      value: id,
      disabled: true,
      title: 'Product ID',
      placeholder: 'Product ID',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'name',
      value: product?.name,
      title: 'Product Name',
      placeholder: 'Product Name',
      type: 'INPUT',
      disabled: true,
    },
    // sku
    {
      key: 'id',
      value: product?.sku?.id,
      disabled: true,
      title: '#ID',
      placeholder: '#ID',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
      dividerTopTitle: 'SKU Details',
    },
    {
      key: 'skuName',
      value: product?.sku?.name,
      title: 'SKU Name',
      subTitle: 'Unique name of product SKU',
      placeholder: 'SKU Name',
      type: 'INPUT',
    },
    {
      key: 'retailPrice',
      value: product?.sku?.retailPrice,
      title: 'Retail Price',
      subTitle: 'Default price of the product',
      placeholder: 'Retail Price',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'salePrice',
      value: product?.sku?.salePrice,
      title: 'Sale Price',
      subTitle: 'When marked as on sale, this price will be shown/used',
      placeholder: 'Sale Price',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'onSale',
      value: product?.sku?.onSale || false,
      title: 'On Sale',
      type: 'CHECKBOX',
    },
    {
      key: 'saleDiscountPercentage',
      value: product?.sku?.saleDiscountPercentage,
      title: 'Sale Discount Percentage',
      subTitle: 'Price discount in percentage numbers. This has 2nd priority',
      placeholder: 'Sale Discount Percentage',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
      optional: true,
    },
    {
      key: 'saleDiscountFlat',
      value: product?.sku?.saleDiscountFlat,
      title: 'Sale Discount Flat',
      subTitle: 'Price discount in flat numbers. This has 1st priority',
      placeholder: 'Sale Discount Flat',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
      optional: true,
    },
    {
      key: 'availableQuantity',
      value: product?.sku?.availableQuantity,
      title: 'Available Quantity',
      subTitle: 'No of products left',
      placeholder: 'Available Quantity',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'comingSoon',
      value: product?.sku?.comingSoon || false,
      title: 'Coming Soon',
      subTitle: 'Use this to mark product as not ready for sale',
      type: 'CHECKBOX',
    },
    {
      key: 'currencyId',
      value: product?.sku?.currency?.id,
      title: 'Currency ID',
      subTitle: 'Currency of the product',
      placeholder: 'Currency ID',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
  ]

  const onInfoSubmit = inputMap => {
    const params: IIndividualProductDetailUpdateParams = {
      basic: null,
      brandId: null,
      productsRelationId: null,
      sku: {
        id: inputMap['id'] || null,
        name: inputMap['skuName'],
        retailPrice: inputMap['retailPrice'],
        salePrice: inputMap['salePrice'],
        onSale: inputMap['onSale'],
        saleDiscountPercentage: inputMap['saleDiscountPercentage'] || null,
        saleDiscountFlat: inputMap['saleDiscountFlat'] || null,
        availableQuantity: inputMap['availableQuantity'],
        comingSoon: inputMap['comingSoon'],
        currencyId: inputMap['currencyId'],
      },
      tags: null,
      attributes: null,
      featureSections: null,
    }

    updateIndividualProductDetail(id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getIndividualProductUpdatePageUrl(id),
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
        {!updateQueryId ? (
          <NoContent />
        ) : (
          <div>
            <div className="text-primaryTextBold font-primary-medium font-medium mb-5">
              SKU details are compulsory for the product.
            </div>
            <FormLayout inputs={infoFormInputs} onSubmit={onInfoSubmit} />
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
          title: 'Product SKU - Update - CMS',
        },
        headerTitle: 'Product SKU - Update',
      },
    },
  }
}

export default UpdateIndividualProductSKU
