import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from './../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import { getCurrencyPageUrl, getCurrencyUpdatePageUrl } from '../../utils/currency'
import { deleteCurrency, getAllCurrencies, getCurrencyById, updateCurrency } from '../../http/currency'
import { ICurrencyInfo, ICurrencyInfoUpdateParams } from '../../contract/currency'
import FormLayout, { IFormLayoutInput } from '../../components/layout/FormLayout'
import { useRouter } from 'next/router'
import { toastSuccess } from '../../components/Toaster'
import Delete from '../../components/layout/Delete'
import useLoginEffect from '../../hooks/useLoginEffect'
import { onDeleteSuccess, onUpdateSuccess } from '../../utils/layout'
import ApplicationContext from '../../components/ApplicationContext'
import NoContent from '../../components/NoContent'
import PageLoader from '../../components/loader/PageLoader'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateCurrency: NextPage<IProps> = props => {
  const [currency, setCurrency] = useState<ICurrencyInfo | null>(null)
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any
  const id = currency?.id

  useLoginEffect(() => {
    if (!updateQueryId) {
      setFetching(true)
      getAllCurrencies()
        .then(resp => {
          setList(resp)
        })
        .finally(() => {
          setFetching(false)
        })
    }

    if (updateQueryId) {
      getCurrencyById(updateQueryId).then(resp => {
        setCurrency(resp)
      })
    } else {
      setCurrency(null)
    }
  }, [updateQueryId])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getCurrencyPageUrl(),
    },
    {
      label: 'Add',
      url: getCurrencyUpdatePageUrl(),
    },
  ]

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: currency?.id.toString(),
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'name',
      value: currency?.name,
      title: 'Name',
      subTitle: 'An identifier for the currency',
      placeholder: 'Name',
      type: 'INPUT',
    },
    {
      key: 'isoCode',
      value: currency?.isoCode,
      title: 'ISO Code',
      subTitle: 'A 3-letter ISO code',
      placeholder: 'ISO Code',
      type: 'INPUT',
    },
    {
      key: 'symbol',
      value: currency?.symbol,
      title: 'Symbol',
      placeholder: 'Symbol',
      type: 'INPUT',
    },
  ]

  const onSubmit = inputMap => {
    const params: ICurrencyInfoUpdateParams = {
      name: inputMap['name'],
      isoCode: inputMap['isoCode'],
      symbol: inputMap['symbol'],
    }

    updateCurrency(id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getCurrencyPageUrl(),
          },
          applicationContext,
          router
        )
      }
    })
  }

  const onDelete = () => {
    deleteCurrency(id)
      .then(resp => {
        if (resp.success) {
          onDeleteSuccess(
            {
              url: getCurrencyPageUrl(),
            },
            applicationContext,
            router
          )
        }
      })
      .catch(console.error)
  }

  let showNoContent = false
  if (!updateQueryId) {
    showNoContent = list?.length === 1
  }

  return (
    <div className="" key={id}>
      <PageLayout links={links}>
        {fetching ? (
          <PageLoader message="Fetching detail..." />
        ) : (
          <>
            {showNoContent ? (
              <NoContent message="Currency already exists." />
            ) : (
              <>
                {id ? <Delete onDelete={onDelete} /> : null}
                <FormLayout inputs={formInputs} onSubmit={onSubmit} />
              </>
            )}
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
          title: 'Currency - Update - CMS',
        },
        headerTitle: 'Currency - Update',
      },
    },
  }
}

export default UpdateCurrency
