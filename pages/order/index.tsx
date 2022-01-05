import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from './../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import { useRouter } from 'next/router'
import useLoginEffect from '../../hooks/useLoginEffect'
import ApplicationContext from '../../components/ApplicationContext'
import PageLoader from '../../components/loader/PageLoader'
import { IOrderDetail } from '../../contract/order'
import { getOrderById } from '../../http/order'
import { getOrderPageUrl, getOrderUpdatePageUrl } from '../../utils/order'
import NoContent from '../../components/NoContent'
import classNames from 'classnames'
import { getFormattedDateTime } from '../../utils/dates'
import CartSummary from '../../components/cart/CartSummary'
import CoreLink from '../../components/core/CoreLink'
import { getUserAddressPageUrl, getUserDetailPageUrl } from '../../utils/user'
import { ExternalLinkIcon, LinkIcon } from '@heroicons/react/outline'
import IndexViewLayout from '../../components/layout/IndexViewLayout'
import { IIndividualProductInfo } from '../../contract/product'
import { ProductType } from '../../contract/constants'
import { getComboProductUpdatePageUrl, getIndividualProductUpdatePageUrl } from '../../utils/product'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const Order: NextPage<IProps> = props => {
  const [order, setOrder] = useState<IOrderDetail | null>(null)
  const [fetching, setFetching] = useState(false)

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

  const renderItem = (title: ReactNode, subTitle: ReactNode, className?: string, href?: string) => {
    return (
      <CoreLink
        url={href}
        className={classNames('mb-4 block', href ? 'cursor-pointer' : 'cursor-auto hover:text-inherit', className)}>
        <div className="uppercase text-xs font-medium font-primary-medium flex items-center">
          {title} {href ? <LinkIcon className="w-4 ml-1" /> : null}
        </div>
        <div className="text-primaryTextBold text-base">{subTitle}</div>
      </CoreLink>
    )
  }

  const renderOrder = () => {
    const recentOrderHistory = order.orderStatusHistory[0]

    return (
      <div>
        <div className="mb-6">
          {renderItem('Order No', order.id)}
          {renderItem(
            'Status',
            <span>
              {recentOrderHistory.status.name}
              <CoreLink
                url={getOrderUpdatePageUrl(updateQueryId)}
                className="font-medium font-primary-medium text-primaryTextBold cursor-pointer ml-1 text-sm">
                (Update)
              </CoreLink>
            </span>
          )}
          {renderItem(
            'Status Text',
            <span>
              {order.statusText}
              <CoreLink
                url={getOrderUpdatePageUrl(updateQueryId)}
                className="font-medium font-primary-medium text-primaryTextBold cursor-pointer ml-1 text-sm">
                (Update)
              </CoreLink>
            </span>
          )}
          {renderItem('Created', getFormattedDateTime(order.createdDateTime))}
          {renderItem('Updated', getFormattedDateTime(order.updatedDateTime))}
          {renderItem('User ID', order.user.id, '', getUserDetailPageUrl(order.user.id))}
          {renderItem('Address ID', order.address.id, '', getUserAddressPageUrl(order.user.id))}
          {renderItem('Phone Number', order.address.phoneNumber)}
          {renderItem(
            'Deliver To',
            [
              order.address.addressLine,
              `${order.address.area}${order.address.areaCode ? ` - ${order.address.areaCode}` : ''}`,
              order.address.city,
              order.address.country,
            ]
              .filter(Boolean)
              .join(', ')
          )}
          {renderItem('Payment Method', order.paymentMethod)}
          {order.orderCancellation ? (
            <>
              <hr className="text-gray300 my-4" />
              {renderItem('Cancelled Date', getFormattedDateTime(order.orderCancellation.createdDateTime))}
              {renderItem('Cancellation Reason', order.orderCancellation.reason)}
            </>
          ) : null}
          {renderItem('Third Party Payment ID', order.thirdPartyPaymentId)}
        </div>

        <div>
          <div className="text-primaryTextBold text-base lg:text-lg font-medium font-primary-medium mb-2">Products</div>
          <IndexViewLayout
            items={order.cart.cartItems.map(cartItem => {
              const product = cartItem.product as IIndividualProductInfo

              return {
                id: cartItem.id,
                label: product.name,
                description: <span>x{cartItem.quantity}</span>,
                viewUrl:
                  cartItem.product.type === ProductType.INDIVIDUAL
                    ? getIndividualProductUpdatePageUrl(product.id)
                    : getComboProductUpdatePageUrl(product.id),
              }
            })}
          />
        </div>

        <div className="md:w-7/12 mt-6">
          <CartSummary
            retailAmount={order.retailAmount}
            saleAmount={order.saleAmount}
            discountAmount={order.discountAmount}
            deliveryAmount={order.deliveryAmount}
            totalAmount={order.totalAmount}
            extraChargesAmount={order.extraChargesAmount}
            taxAmount={order.taxAmount}
            currency={order.currency}
            title="Order Summary"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="" key={id}>
      <PageLayout links={links}>
        {fetching ? <PageLoader message="Fetching detail..." /> : <>{order ? renderOrder() : <NoContent />}</>}
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
          title: 'Order - CMS',
        },
        headerTitle: 'Order',
      },
    },
  }
}

export default Order
