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
import { IOrderStatusInfo, IOrderStatusInfoUpdateParams } from '../../contract/order'
import { deleteOrderStatus, getOrderStatusById, updateOrderStatus } from '../../http/order'
import { getOrderStatusPageUrl, getOrderStatusUpdatePageUrl } from '../../utils/order'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateOrderStatusType: NextPage<IProps> = props => {
  const [orderStatus, setOrderStatus] = useState<IOrderStatusInfo | null>(null)
  const [fetching, setFetching] = useState(false)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any
  const id = orderStatus?.id

  useLoginEffect(() => {
    if (updateQueryId) {
      setFetching(true)

      getOrderStatusById(updateQueryId)
        .then(resp => {
          setOrderStatus(resp)
        })
        .finally(() => {
          setFetching(false)
        })
    } else {
      setOrderStatus(null)
    }
  }, [updateQueryId])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getOrderStatusPageUrl(),
    },
    {
      label: 'Add',
      url: getOrderStatusUpdatePageUrl(),
    },
  ]

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: orderStatus?.id.toString(),
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'name',
      value: orderStatus?.name,
      title: 'Name',
      placeholder: 'Name',
      type: 'INPUT',
    },
  ]

  const onSubmit = inputMap => {
    const params: IOrderStatusInfoUpdateParams = {
      name: inputMap['name'],
    }

    updateOrderStatus(id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getOrderStatusPageUrl(),
          },
          applicationContext,
          router
        )
      }
    })
  }

  const onDelete = () => {
    deleteOrderStatus(id)
      .then(resp => {
        if (resp.success) {
          onDeleteSuccess(
            {
              url: getOrderStatusPageUrl(),
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
          title: 'Order Status Type - Update - CMS',
        },
        headerTitle: 'Order Status Type - Update',
      },
    },
  }
}

export default UpdateOrderStatusType
