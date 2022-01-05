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
  IProductFeatureSectionInfo,
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
import CoreButton, { CoreButtonSize, CoreButtonType } from '../../../../components/core/CoreButton'
import { PlusIcon } from '@heroicons/react/outline'
import ProductFeatureSectionUpdateModal from '../../../../components/product/ProductFeatureSectionUpdateModal'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateComboProductFeatureSections: NextPage<IProps> = props => {
  const [product, setProduct] = useState<IComboProductDetail | null>(null)
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  const [selectedItem, setSelectedItem] = useState<IProductFeatureSectionInfo>(null)
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
          const newList: IIndexViewItem[] = resp.featureSections.map(data => {
            return {
              id: data.id,
              label: data.title,
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
    setSelectedItem(product.featureSections.find(l => l.id === item.id))
    setShowModal(true)
  }

  const onSubmit = (inputMap: any) => {
    let newSections: IProductFeatureSectionInfo[] = []

    const exists = product.featureSections.find(section => Number(section.id) === Number(inputMap.id))

    if (exists) {
      newSections = [...(product.featureSections || [])].map(section => {
        if (inputMap.id && inputMap.id === section.id) {
          return {
            ...section,
            title: inputMap.title,
            body: inputMap.body,
            position: inputMap.position,
            isActive: inputMap.isActive,
          }
        }
        return section
      })
    } else {
      newSections = [
        ...(product.featureSections || []),
        {
          id: inputMap.id || null,
          title: inputMap.title,
          body: inputMap.body,
          position: inputMap.position,
          isActive: inputMap.isActive,
        },
      ]
    }

    const params: IComboProductDetailUpdateParams = {
      basic: null,
      productsRelationId: null,
      sku: null,
      tags: null,
      attributes: null,
      featureSections: newSections.map(section => ({
        id: section.id || null,
        title: section.title,
        body: section.body,
        position: section.position,
        isActive: section.isActive,
      })),
    }

    updateComboProductDetail(id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess({}, applicationContext, router)
        router.reload()
      }
    })
  }

  const onDelete = (attribute: IProductFeatureSectionInfo) => {
    const params: IComboProductDetailDeleteParams = {
      tags: null,
      attributes: null,
      featureSections: [attribute.id],
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
        {updateQueryId ? (
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
              onClick={() => setShowModal(true)}
            />
          </div>
        ) : null}
        <IndexViewLayout items={list} showNotFound showLoader={fetching} onClick={handItemClick} />
      </PageLayout>

      {showModal ? (
        <ProductFeatureSectionUpdateModal
          featureSection={selectedItem}
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
          title: 'Combo Product Feature Sections - Update - CMS',
        },
        headerTitle: 'Combo Product Feature Sections - Update',
      },
    },
  }
}

export default UpdateComboProductFeatureSections
