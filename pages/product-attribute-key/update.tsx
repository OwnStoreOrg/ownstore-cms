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
import { IProductAttributeKeyInfo, IProductAttributeKeyInfoUpdateParams } from '../../contract/product'
import { deleteProductAttributeKey, getProductAttributeKeyById, updateProductAttributeKey } from '../../http/product'
import { getProductAttributeKeyPageUrl, getProductAttributeKeyUpdatePageUrl } from '../../utils/product'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateProductAttributeKey: NextPage<IProps> = props => {
  const [attributeKey, setAttributeKey] = useState<IProductAttributeKeyInfo | null>(null)
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any
  const id = attributeKey?.id

  useLoginEffect(() => {
    if (updateQueryId) {
      setFetching(true)

      getProductAttributeKeyById(updateQueryId)
        .then(resp => {
          setAttributeKey(resp)
        })
        .finally(() => {
          setFetching(false)
        })
    } else {
      setAttributeKey(null)
    }
  }, [updateQueryId])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getProductAttributeKeyPageUrl(),
    },
    {
      label: 'Add',
      url: getProductAttributeKeyUpdatePageUrl(),
    },
  ]

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: attributeKey?.id.toString(),
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'name',
      value: attributeKey?.name,
      title: 'Name',
      subTitle: 'Something which attributes the product',
      placeholder: 'Name',
      type: 'INPUT',
    },
  ]

  const onSubmit = inputMap => {
    const params: IProductAttributeKeyInfoUpdateParams = {
      name: inputMap['name'],
    }

    updateProductAttributeKey(id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getProductAttributeKeyPageUrl(),
          },
          applicationContext,
          router
        )
      }
    })
  }

  const onDelete = () => {
    deleteProductAttributeKey(id)
      .then(resp => {
        if (resp.success) {
          onDeleteSuccess(
            {
              url: getProductAttributeKeyPageUrl(),
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
          title: 'Product Attribute Keys - Update - CMS',
        },
        headerTitle: 'Product Attribute Keys - Update',
      },
    },
  }
}

export default UpdateProductAttributeKey
