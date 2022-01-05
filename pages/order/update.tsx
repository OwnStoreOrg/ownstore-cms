import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from './../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import { getCurrencyPageUrl, getCurrencyUpdatePageUrl } from '../../utils/currency'
import FormLayout, { IFormLayoutInput } from '../../components/layout/FormLayout'
import { useRouter } from 'next/router'
import { toastSuccess } from '../../components/Toaster'
import Delete from '../../components/layout/Delete'
import useLoginEffect from '../../hooks/useLoginEffect'
import { onDeleteSuccess, onUpdateSuccess } from '../../utils/layout'
import ApplicationContext from '../../components/ApplicationContext'
import NoContent from '../../components/NoContent'
import PageLoader from '../../components/loader/PageLoader'
import { IOrderDetail, IOrderStatusInfo, IUpdateOrderInfoParams } from '../../contract/order'
import { getAllOrderStatus, getOrderById, updateOrder } from '../../http/order'
import { getOrderPageUrl, getOrderUpdatePageUrl } from '../../utils/order'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../../components/core/CoreButton'
import { XIcon } from '@heroicons/react/outline'
import CancelOrderModal from '../../components/order/CancelOrderModal'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateOrder: NextPage<IProps> = props => {
  const [order, setOrder] = useState<IOrderDetail | null>(null)
  const [fetching, setFetching] = useState(false)
  const [orderStatusList, setOrderStatusList] = useState<IOrderStatusInfo[]>([])
  const [showCancelOrderModal, toggleCancelOrderModal] = useState(false)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any
  const id = order?.id

  useLoginEffect(() => {
    if (updateQueryId) {
      setFetching(true)

      getOrderById(updateQueryId)
        .then(resp => {
          setOrder(resp)
        })
        .finally(() => {
          setFetching(false)
        })

      getAllOrderStatus().then(resp => {
        setOrderStatusList(resp)
      })
    }
  }, [updateQueryId])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getOrderPageUrl(updateQueryId),
    },
    {
      label: 'Update',
      url: getOrderUpdatePageUrl(updateQueryId),
    },
  ]

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: order?.id.toString(),
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'orderStatusId',
      value: order ? order.orderStatusHistory[0].status.id : '',
      title: 'Type',
      placeholder: 'Type',
      type: 'SELECT',
      selectProps: {
        options: orderStatusList.map(value => ({
          id: value.id,
          label: value.name,
          value: value.id as any,
          selected: order ? order.orderStatusHistory[0].status.id === value.id : false,
        })),
      },
    },
    {
      key: 'statusText',
      value: order?.statusText,
      title: 'Status Text',
      placeholder: 'Status Text',
      type: 'TEXTAREA',
      textAreaProps: {
        className: 'h-[100px]',
      },
      optional: true,
    },
  ]

  const onSubmit = inputMap => {
    const params: IUpdateOrderInfoParams = {
      statusText: inputMap['statusText'] || null,
      orderStatusId: inputMap['orderStatusId'],
      cancellationReason: null,
    }

    updateOrder(id, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getOrderPageUrl(updateQueryId),
          },
          applicationContext,
          router
        )
      }
    })
  }

  const isCancelled = order ? !!order.orderCancellation : false

  return (
    <div className="" key={id}>
      <PageLayout links={links}>
        {fetching ? (
          <PageLoader message="Fetching detail..." />
        ) : (
          <>
            {!order ? (
              <NoContent />
            ) : (
              <>
                <div className="flex justify-end mb-4">
                  <CoreButton
                    label={
                      <React.Fragment>
                        <XIcon className="w-5 mr-1" />
                        <span>{isCancelled ? 'Order Cancelled' : 'Cancel Order'}</span>
                      </React.Fragment>
                    }
                    size={CoreButtonSize.MEDIUM}
                    type={CoreButtonType.SOLID_SECONDARY}
                    disabled={isCancelled}
                    onClick={() => toggleCancelOrderModal(true)}
                  />
                </div>
                <FormLayout inputs={formInputs} onSubmit={onSubmit} />
              </>
            )}
          </>
        )}

        {showCancelOrderModal ? (
          <CancelOrderModal orderDetail={order} dismissModal={() => toggleCancelOrderModal(false)} />
        ) : null}
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
          title: 'Order - Update - CMS',
        },
        headerTitle: 'Order - Update',
      },
    },
  }
}

export default UpdateOrder
