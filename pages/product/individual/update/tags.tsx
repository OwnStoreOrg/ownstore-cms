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
  IProductTagInfo,
  IProductTagInfoUpdateParams,
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
import { ProductTagIconType, ProductType } from '../../../../contract/constants'
import {
  BadgeCheckIcon,
  GlobeAltIcon,
  LightningBoltIcon,
  SparklesIcon,
  StarIcon,
  TagIcon,
} from '@heroicons/react/solid'

const ICON_MAP = {
  [ProductTagIconType.STAR]: StarIcon,
  [ProductTagIconType.TAG]: TagIcon,
  [ProductTagIconType.VERIFIED]: BadgeCheckIcon,
  [ProductTagIconType.SPARKLE]: SparklesIcon,
  [ProductTagIconType.LIGHTNING_BOLT]: LightningBoltIcon,
  [ProductTagIconType.GLOBE]: GlobeAltIcon,
  [ProductTagIconType.NONE]: null,
}

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateIndividualProductTags: NextPage<IProps> = props => {
  const [product, setProduct] = useState<IIndividualProductDetail | null>(null)
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
      getIndividualProductDetail(updateQueryId)
        .then(resp => {
          setProduct(resp)
          const newList: IIndexViewItem[] = resp.tags.map(data => {
            const Icon = ICON_MAP[data.iconType]

            return {
              id: data.id,
              label: (
                <div className="flex items-center">
                  <span>{data.label}</span>
                  <span>
                    <Icon className="w-5 ml-1" />
                  </span>
                </div>
              ),
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

    const params: IIndividualProductDetailUpdateParams = {
      basic: null,
      brandId: null,
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

    updateIndividualProductDetail(id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess({}, applicationContext, router)
        router.reload()
      }
    })
  }

  const onDelete = (tag: IProductTagInfo) => {
    const params: IIndividualProductDetailDeleteParams = {
      tags: [tag.id],
      attributes: [],
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

        <div className="mt-10">
          <div className="font-medium font-primary-medium mb-1">Type and Icon mapping</div>
          {Object.entries(ICON_MAP).map(([name, Icon]) =>
            Icon ? (
              <div key={name} className="flex items-center text-sm">
                {name}: <Icon className="w-5 ml-1" />
              </div>
            ) : null
          )}
        </div>
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
          title: 'Product Tags - Update - CMS',
        },
        headerTitle: 'Product Tags - Update',
      },
    },
  }
}

export default UpdateIndividualProductTags
