import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from './../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import IndexViewLayout, { IIndexViewItem } from '../../components/layout/IndexViewLayout'
import useLoginEffect from '../../hooks/useLoginEffect'
import { PAGE_SUMMARY } from '../../constants/constants'
import { getUserGlobalDetail } from '../../http/user'
import { useRouter } from 'next/router'
import ApplicationContext from '../../components/ApplicationContext'
import { filterInactiveItem } from '../../utils/common'
import {
  getUserAddressPageUrl,
  getUserCartPageUrl,
  getUserOrderPageUrl,
  getUserPageUrl,
  getUserDetailPageUrl,
  getUserWishlistPageUrl,
  getUserLoginHistoryPageUrl,
} from '../../utils/user'
import { IIndividualProductInfo } from '../../contract/product'
import { getComboProductUpdatePageUrl, getIndividualProductUpdatePageUrl } from '../../utils/product'
import { ProductType } from '../../contract/constants'
import { getFormattedDateTime } from '../../utils/dates'
import {
  getCartCurrency,
  getCartDeliveryTotal,
  getCartDiscountTotal,
  getCartExtraChargesTotal,
  getCartRetailTotal,
  getCartSaleTotal,
  getCartTaxTotal,
  getCartTotal,
} from '../../utils/payment'
import { ICartDetail } from '../../contract/cart'
import CartSummary from '../../components/cart/CartSummary'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UserCart: NextPage<IProps> = props => {
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)
  const [cart, setCart] = useState<ICartDetail | null>(null)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any

  useLoginEffect(() => {
    if (updateQueryId) {
      setFetching(true)

      getUserGlobalDetail(updateQueryId, {
        cartDetail: true,
      })
        .then(resp => {
          if (resp.cartDetail) {
            setCart(resp.cartDetail)

            const newList: IIndexViewItem[] = resp.cartDetail.cartItems.map(data => {
              const product = data.product as IIndividualProductInfo

              return {
                id: data.id,
                label: `${product.name} (${data.quantity})`,
                description: `${getFormattedDateTime(data.updatedDateTime)}`,
                viewUrl:
                  data.product.type === ProductType.INDIVIDUAL
                    ? getIndividualProductUpdatePageUrl(product.id)
                    : getComboProductUpdatePageUrl(product.id),
              }
            })

            setList(newList)
          }
        })
        .finally(() => {
          setFetching(false)
        })
    }
  }, [])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getUserPageUrl(),
    },
    {
      label: 'Detail',
      url: getUserDetailPageUrl(updateQueryId),
    },
    {
      label: 'Address',
      url: getUserAddressPageUrl(updateQueryId),
    },
    {
      label: 'Wishlist',
      url: getUserWishlistPageUrl(updateQueryId),
    },
    {
      label: 'Cart',
      url: getUserCartPageUrl(updateQueryId),
    },
    {
      label: 'Orders',
      url: getUserOrderPageUrl(updateQueryId),
    },
    {
      label: 'Login History',
      url: getUserLoginHistoryPageUrl(updateQueryId),
    },
  ]

  const renderCartSummary = () => {
    const retailTotal = getCartRetailTotal(cart)
    const saleTotal = getCartSaleTotal(cart)
    const discountTotal = getCartDiscountTotal(cart)
    const deliveryTotal = getCartDeliveryTotal(cart)
    const total = getCartTotal(cart)
    const extraChargesTotal = getCartExtraChargesTotal(cart)
    const taxTotal = getCartTaxTotal(cart)

    const cartCurrency = getCartCurrency(cart)

    if (!cart.cartItems.length) {
      return null
    }

    return (
      <CartSummary
        retailAmount={retailTotal}
        saleAmount={saleTotal}
        discountAmount={discountTotal}
        deliveryAmount={deliveryTotal}
        totalAmount={total}
        currency={cartCurrency}
        extraChargesAmount={extraChargesTotal}
        taxAmount={taxTotal}
        title="Cart Summary"
      />
    )
  }

  return (
    <div className="">
      <PageLayout links={links}>
        <div>
          {cart ? <div className="mb-4">{renderCartSummary()}</div> : null}

          <IndexViewLayout items={list} showLoader={fetching} />
        </div>
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
          title: 'User Cart - CMS',
        },
        headerTitle: 'User Cart',
      },
    },
  }
}

export default UserCart
