import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from './../_app'
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
import { IProductBrandInfo, IProductBrandInfoUpdateParams } from '../../contract/product'
import { deleteProductBrand, getProductBrandById, updateProductBrand } from '../../http/product'
import { getProductBrandPageUrl, getProductBrandUpdatePageUrl } from '../../utils/product'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateProductBrand: NextPage<IProps> = props => {
  const [brand, setBrand] = useState<IProductBrandInfo | null>(null)
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any
  const id = brand?.id

  useLoginEffect(() => {
    if (updateQueryId) {
      setFetching(true)

      getProductBrandById(updateQueryId)
        .then(resp => {
          setBrand(resp)
        })
        .finally(() => {
          setFetching(false)
        })
    } else {
      setBrand(null)
    }
  }, [updateQueryId])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getProductBrandPageUrl(),
    },
    {
      label: 'Add',
      url: getProductBrandUpdatePageUrl(),
    },
  ]

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: brand?.id.toString(),
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'name',
      value: brand?.name,
      title: 'Name',
      subTitle: 'Name of the brand',
      placeholder: 'Name',
      type: 'INPUT',
    },
    {
      key: 'description',
      value: brand?.description,
      title: 'Description',
      subTitle: 'About this brand',
      placeholder: 'Description',
      type: 'TEXTAREA',
      textAreaProps: {
        className: 'h-[200px]',
      },
      optional: true,
    },
  ]

  const onSubmit = inputMap => {
    const params: IProductBrandInfoUpdateParams = {
      name: inputMap['name'],
      description: inputMap['description'] || null,
    }

    updateProductBrand(id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getProductBrandPageUrl(),
          },
          applicationContext,
          router
        )
      }
    })
  }

  const onDelete = () => {
    deleteProductBrand(id)
      .then(resp => {
        if (resp.success) {
          onDeleteSuccess(
            {
              url: getProductBrandPageUrl(),
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
          title: 'Product Brand - Update - CMS',
        },
        headerTitle: 'Product Brand - Update',
      },
    },
  }
}

export default UpdateProductBrand
