import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import FormLayout, { IFormLayoutInput } from '../../components/layout/FormLayout'
import { useRouter } from 'next/router'
import { toastSuccess } from '../../components/Toaster'
import Delete from '../../components/layout/Delete'
import useLoginEffect from '../../hooks/useLoginEffect'
import { onDeleteSuccess, onUpdateSuccess } from '../../utils/layout'
import ApplicationContext from '../../components/ApplicationContext'
import NoContent from '../../components/NoContent'
import PageLoader from '../../components/loader/PageLoader'
import { IProductsRelationInfo, IProductsRelationInfoUpdateParams } from '../../contract/product'
import { deleteProductsRelation, getProductsRelationById, updateProductsRelation } from '../../http/product'
import { getProductRelationsPageUrl, getProductRelationsUpdatePageUrl } from '../../utils/product'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateProductRelations: NextPage<IProps> = props => {
  const [relation, setRelation] = useState<IProductsRelationInfo | null>(null)
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any
  const id = relation?.id

  useLoginEffect(() => {
    if (updateQueryId) {
      setFetching(true)

      getProductsRelationById(updateQueryId)
        .then(resp => {
          setRelation(resp)
        })
        .finally(() => {
          setFetching(false)
        })
    } else {
      setRelation(null)
    }
  }, [updateQueryId])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getProductRelationsPageUrl(),
    },
    {
      label: 'Add',
      url: getProductRelationsUpdatePageUrl(),
    },
  ]

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: relation?.id.toString(),
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'name',
      value: relation?.name,
      title: 'Name',
      subTitle: 'Name of the relation',
      placeholder: 'Name',
      type: 'INPUT',
    },
    {
      key: 'description',
      value: relation?.description,
      title: 'Description',
      subTitle: 'About this relation',
      placeholder: 'Description',
      type: 'TEXTAREA',
      textAreaProps: {
        className: 'h-[200px]',
      },
      optional: true,
    },
    {
      key: 'productIds',
      value: relation?.productIds,
      title: 'Product IDs',
      subTitle: `Add a comma to separate products. Use 'I:<number>' for individual products and 'C:<number>' for combo.`,
      placeholder: 'Product IDs',
      type: 'TEXTAREA',
      textAreaProps: {
        className: 'h-[200px]',
      },
    },
  ]

  const onSubmit = inputMap => {
    const params: IProductsRelationInfoUpdateParams = {
      name: inputMap['name'],
      description: inputMap['description'] || null,
      productIds: inputMap['productIds'] || null,
    }

    updateProductsRelation(id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getProductRelationsPageUrl(),
          },
          applicationContext,
          router
        )
      }
    })
  }

  const onDelete = () => {
    deleteProductsRelation(id)
      .then(resp => {
        if (resp.success) {
          onDeleteSuccess(
            {
              url: getProductRelationsPageUrl(),
            },
            applicationContext,
            router
          )
        }
      })
      .catch(console.error)
  }

  return (
    <div className="" key={id}>
      <PageLayout links={links}>
        {fetching ? (
          <PageLoader message="Fetching detail..." />
        ) : (
          <>
            {id ? <Delete onDelete={onDelete} /> : null}
            <FormLayout inputs={formInputs} onSubmit={onSubmit} />
          </>
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
          title: 'Product Relations - Update - CMS',
        },
        headerTitle: 'Product Relations - Update',
      },
    },
  }
}

export default UpdateProductRelations
