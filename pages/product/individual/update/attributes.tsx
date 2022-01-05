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
import {
  IIndividualProductDetail,
  IIndividualProductDetailDeleteParams,
  IIndividualProductDetailUpdateParams,
  IProductAttributeInfo,
  IProductAttributeInfoUpdateParams,
  IProductTagInfo,
} from '../../../../contract/product'
import {
  deleteIndividualProductDetail,
  getIndividualProductDetail,
  updateIndividualProductDetail,
} from '../../../../http/product'
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
import IndexViewLayout, { IIndexViewItem } from '../../../../components/layout/IndexViewLayout'
import ProductTagUpdateModal from '../../../../components/product/ProductTagUpdateModal'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../../../../components/core/CoreButton'
import { PlusIcon } from '@heroicons/react/outline'
import ProductAttributeUpdateModal from '../../../../components/product/ProductAttributeUpdateModal'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateIndividualProductAttributes: NextPage<IProps> = props => {
  const [product, setProduct] = useState<IIndividualProductDetail | null>(null)
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  const [selectedItem, setSelectedItem] = useState<IProductAttributeInfo>(null)
  const [showModal, setShowModal] = useState(false)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any
  const id = product?.id

  useLoginEffect(() => {
    if (updateQueryId) {
      setFetching(true)
      getIndividualProductDetail(updateQueryId)
        .then(resp => {
          setProduct(resp)
          const newList: IIndexViewItem[] = resp.attributes.map(data => {
            return {
              id: data.id,
              label: data.value,
              isInactive: !data.isActive,
            }
          })

          setList(newList)
        })
        .finally(() => {
          setFetching(false)
        })
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

  const handItemClick = (e: any, item: IIndexViewItem) => {
    e.preventDefault()
    setSelectedItem(product.attributes.find(l => l.id === item.id))
    setShowModal(true)
  }

  const onSubmit = (inputMap: any) => {
    let newAttributes: IProductAttributeInfo[] = []

    const exists = product.attributes.find(attribute => Number(attribute.id) === Number(inputMap.id))

    if (exists) {
      newAttributes = [...(product.attributes || [])].map(attribute => {
        if (inputMap.id && inputMap.id === attribute.id) {
          return {
            ...attribute,
            key: {
              id: inputMap.keyId || null,
              name: attribute.key?.name || '',
            },
            value: inputMap.value,
            position: inputMap.position,
            isActive: inputMap.isActive,
          }
        }
        return attribute
      })
    } else {
      newAttributes = [
        ...(product.attributes || []),
        {
          id: inputMap.id || null,
          key: {
            id: inputMap.keyId || null,
            name: '',
          },
          value: inputMap.value,
          position: inputMap.position,
          isActive: inputMap.isActive,
        },
      ]
    }

    const params: IIndividualProductDetailUpdateParams = {
      basic: null,
      brandId: null,
      productsRelationId: null,
      sku: null,
      tags: null,
      attributes: newAttributes.map(attribute => ({
        id: attribute.id || null,
        keyId: attribute.key?.id || null,
        value: attribute.value,
        position: attribute.position,
        isActive: attribute.isActive,
      })),
      featureSections: null,
    }

    updateIndividualProductDetail(id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess({}, applicationContext, router)
        router.reload()
      }
    })
  }

  const onDelete = (attribute: IProductAttributeInfo) => {
    const params: IIndividualProductDetailDeleteParams = {
      tags: null,
      attributes: [attribute.id],
      featureSections: [],
    }

    deleteIndividualProductDetail(id, params).then(resp => {
      if (resp.success) {
        onDeleteSuccess({}, applicationContext, router)
        router.reload()
      }
    })
  }

  return (
    <div className="" key={id}>
      <PageLayout links={links}>
        {updateQueryId ? (
          <div className="flex justify-end mb-4">
            <CoreButton
              label={
                <React.Fragment>
                  <PlusIcon className="w-5 mr-1" />
                  <span>Add Attribute</span>
                </React.Fragment>
              }
              size={CoreButtonSize.MEDIUM}
              type={CoreButtonType.SOLID_SECONDARY}
              onClick={() => setShowModal(true)}
            />
          </div>
        ) : null}
        <IndexViewLayout items={list} showNotFound showLoader={fetching} onClick={handItemClick} />
      </PageLayout>

      {showModal ? (
        <ProductAttributeUpdateModal
          attribute={selectedItem}
          dismissModal={() => {
            setSelectedItem(null)
            setShowModal(false)
          }}
          onUpdate={onSubmit}
          onDelete={onDelete}
        />
      ) : null}
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: null,
      layoutData: {
        seo: {
          title: 'Product Attributes - Update - CMS',
        },
        headerTitle: 'Product Attributes - Update',
      },
    },
  }
}

export default UpdateIndividualProductAttributes
