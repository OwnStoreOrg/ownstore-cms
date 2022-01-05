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
  IComboProductDetail,
  IComboProductDetailUpdateParams,
  IComboProductDetailDeleteParams,
  IProductTagInfo,
} from '../../../../contract/product'
import { deleteComboProductDetail, getComboProductDetail, updateComboProductDetail } from '../../../../http/product'
import {
  getComboProductAttributesUpdatePageUrl,
  getComboProductFeatureSectionsUpdatePageUrl,
  getComboProductImagesUpdatePageUrl,
  getComboProductPageUrl,
  getComboProductSKUUpdatePageUrl,
  getComboProductTagsUpdatePageUrl,
  getComboProductUpdatePageUrl,
} from '../../../../utils/product'
import NoContent from '../../../../components/NoContent'
import IndexViewLayout, { IIndexViewItem } from '../../../../components/layout/IndexViewLayout'
import ProductTagUpdateModal from '../../../../components/product/ProductTagUpdateModal'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../../../../components/core/CoreButton'
import { PlusIcon } from '@heroicons/react/outline'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateComboProductTags: NextPage<IProps> = props => {
  const [product, setProduct] = useState<IComboProductDetail | null>(null)
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  const [selectedItem, setSelectedItem] = useState<IProductTagInfo>(null)
  const [showModal, setShowModal] = useState(false)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any
  const id = product?.id

  useLoginEffect(() => {
    if (updateQueryId) {
      setFetching(true)
      getComboProductDetail(updateQueryId)
        .then(resp => {
          setProduct(resp)
          const newList: IIndexViewItem[] = resp.tags.map(data => {
            return {
              id: data.id,
              label: data.label,
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

  const handItemClick = (e: any, item: IIndexViewItem) => {
    e.preventDefault()
    setSelectedItem(product.tags.find(l => l.id === item.id))
    setShowModal(true)
  }

  const onSubmit = (inputMap: any) => {
    let newTags: IProductTagInfo[] = []

    const exists = product.tags.find(tag => Number(tag.id) === Number(inputMap.id))

    if (exists) {
      newTags = [...(product.tags || [])].map(attribute => {
        if (inputMap.id && inputMap.id === attribute.id) {
          return {
            ...attribute,
            label: inputMap.label,
            iconType: inputMap.iconType,
            position: inputMap.position,
            isActive: inputMap.isActive,
          }
        }
        return attribute
      })
    } else {
      newTags = [
        ...(product.tags || []),
        {
          id: inputMap.id || null,
          label: inputMap.label,
          iconType: inputMap.iconType,
          position: inputMap.position,
          isActive: inputMap.isActive,
        },
      ]
    }

    const params: IComboProductDetailUpdateParams = {
      basic: null,
      productsRelationId: null,
      sku: null,
      tags: newTags.map(tag => ({
        id: tag.id || null,
        label: tag.label,
        iconType: tag.iconType,
        position: tag.position,
        isActive: tag.isActive,
      })),
      attributes: null,
      featureSections: null,
    }

    updateComboProductDetail(id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess({}, applicationContext, router)
        router.reload()
      }
    })
  }

  const onDelete = (tag: IProductTagInfo) => {
    const params: IComboProductDetailDeleteParams = {
      tags: [tag.id],
      attributes: [],
      featureSections: [],
    }

    deleteComboProductDetail(id, params).then(resp => {
      if (resp.success) {
        onDeleteSuccess({}, applicationContext, router)
        router.reload()
      }
    })
  }

  return (
    <div className="" key={id}>
      <PageLayout links={links}>
        <div className="flex justify-end mb-4">
          <CoreButton
            label={
              <React.Fragment>
                <PlusIcon className="w-5 mr-1" />
                <span>Add Tag</span>
              </React.Fragment>
            }
            size={CoreButtonSize.MEDIUM}
            type={CoreButtonType.SOLID_SECONDARY}
            onClick={() => setShowModal(true)}
          />
        </div>
        <IndexViewLayout items={list} showNotFound showLoader={fetching} onClick={handItemClick} />
      </PageLayout>

      {showModal ? (
        <ProductTagUpdateModal
          tag={selectedItem}
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
          title: 'Combo Product Tags - Update - CMS',
        },
        headerTitle: 'Combo Product Tags - Update',
      },
    },
  }
}

export default UpdateComboProductTags
