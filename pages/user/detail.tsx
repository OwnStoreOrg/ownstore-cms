import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from './../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import FormLayout, { IFormLayoutInput } from '../../components/layout/FormLayout'
import { useRouter } from 'next/router'
import { toastSuccess } from '../../components/Toaster'
import useLoginEffect from '../../hooks/useLoginEffect'
import ApplicationContext from '../../components/ApplicationContext'
import NoContent from '../../components/NoContent'
import PageLoader from '../../components/loader/PageLoader'
import { IUserDetail, IUserInfoUpdateParams } from '../../contract/user'
import { getUserGlobalDetail, updateUserInfo } from '../../http/user'
import {
  getUserAddressPageUrl,
  getUserCartPageUrl,
  getUserOrderPageUrl,
  getUserPageUrl,
  getUserDetailPageUrl,
  getUserWishlistPageUrl,
  getUserLoginHistoryPageUrl,
} from '../../utils/user'
import { CoreTextInputType } from '../../components/core/CoreInput'
import Delete from '../../components/layout/Delete'
import { onUpdateSuccess } from '../../utils/layout'
import { BanIcon, CheckCircleIcon, CheckIcon } from '@heroicons/react/outline'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const ViewUser: NextPage<IProps> = props => {
  const [user, setUser] = useState<IUserDetail | null>(null)
  const [fetching, setFetching] = useState(false)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any
  const id = user?.id

  useLoginEffect(() => {
    if (updateQueryId) {
      setFetching(true)
      getUserGlobalDetail(updateQueryId, {})
        .then(resp => {
          setUser(resp.userDetail)
        })
        .finally(() => {
          setFetching(false)
        })
    }
  }, [updateQueryId])

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: user?.id.toString(),
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'name',
      value: user?.name,
      title: 'Name',
      placeholder: 'Name',
      type: 'INPUT',
      disabled: true,
    },
    {
      key: 'email',
      value: user?.email,
      title: 'Email',
      placeholder: 'Email',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.EMAIL,
      },
      disabled: true,
      optional: true,
    },
    {
      key: 'phoneNumber',
      value: user?.phoneNumber,
      title: 'Phone Number',
      placeholder: 'Phone Number',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.TEL,
      },
      disabled: true,
      optional: true,
    },
    {
      key: 'joinedDateTime',
      value: user?.joinedDateTime ? new Date(user.joinedDateTime) : '',
      title: 'Joined Date',
      placeholder: 'Joined Date',
      type: 'INPUT',
      disabled: true,
    },
  ]

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

  const onSubmit = inputMap => {
    return
  }

  const onDelete = () => {
    const params: IUserInfoUpdateParams = {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber || null,
      isActive: !user.isActive,
    }

    updateUserInfo(user.id, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess({}, applicationContext, router)
        router.reload()
      }
    })
  }

  return (
    <div className="" key={id}>
      <PageLayout links={links}>
        {fetching ? (
          <PageLoader message="Fetching detail..." />
        ) : user ? (
          <>
            <Delete
              onDelete={onDelete}
              label={!user.isActive ? 'Activate' : 'Deactivate'}
              icon={!user.isActive ? CheckIcon : BanIcon}
            />
            <FormLayout inputs={formInputs} onSubmit={onSubmit} isDisabled />
          </>
        ) : (
          <NoContent />
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
          title: 'User - View - CMS',
        },
        headerTitle: 'User - View',
      },
    },
  }
}

export default ViewUser
