import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../../_app'
import { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import PageLayout from '../../../components/layout/PageLayout'
import { IPageLink } from '../../../components/layout/PageLinks'
import FormLayout, { IFormLayoutInput } from '../../../components/layout/FormLayout'
import { useRouter } from 'next/router'
import { toastSuccess } from '../../../components/Toaster'
import Delete from '../../../components/layout/Delete'
import { CoreTextInputType } from '../../../components/core/CoreInput'
import PageLoader from '../../../components/loader/PageLoader'
import { deleteSupportedRegion, getSupportedRegionById, updateSupportedRegion } from '../../../http/supportedRegions'
import { SupportedRegionType } from '../../../contract/constants'
import { ISupportedRegionInfo, ISupportedRegionInfoUpdateParams } from '../../../contract/supportedRegions'
import { getSupportedRegionsPageUrl, getSupportedRegionsUpdatePageUrl } from '../../../utils/supportedRegions'
import { onUpdateSuccess } from '../../../utils/layout'
import ApplicationContext from '../../../components/ApplicationContext'
import useLoginEffect from '../../../hooks/useLoginEffect'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateSupportedRegion: NextPage<IProps> = props => {
  const router = useRouter()

  if (router.isFallback) {
    return <PageLoader message="Loading page content..." />
  }

  const [supportedRegionInfo, setSupportedRegionInfo] = useState<ISupportedRegionInfo | null>(null)

  const supportedRegionType = router.query.supportedRegionType as any
  const updateQueryId = router.query.id as any
  const id = supportedRegionInfo?.id

  const applicationContext = useContext(ApplicationContext)

  useLoginEffect(() => {
    if (updateQueryId) {
      getSupportedRegionById(updateQueryId, supportedRegionType).then(resp => {
        setSupportedRegionInfo(resp)
      })
    } else {
      setSupportedRegionInfo(null)
    }
  }, [updateQueryId])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getSupportedRegionsPageUrl(),
    },
    {
      label: 'Add Country',
      url: getSupportedRegionsUpdatePageUrl(SupportedRegionType.COUNTRY),
    },
    {
      label: 'Add City',
      url: getSupportedRegionsUpdatePageUrl(SupportedRegionType.CITY),
    },
  ]

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: supportedRegionInfo?.id.toString(),
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'name',
      value: supportedRegionInfo?.name,
      title: 'Name',
      placeholder: 'Name',
      type: 'INPUT',
    },
    {
      key: 'shortName',
      value: supportedRegionInfo?.shortName,
      title: 'Short Name',
      placeholder: 'Short Name',
      type: 'INPUT',
    },
    {
      key: 'flagUrl',
      value: supportedRegionInfo?.flagUrl,
      title: 'Flag URL',
      placeholder: 'Flag URL',
      type: 'INPUT',
    },
  ]

  const onSubmit = inputMap => {
    const params: ISupportedRegionInfoUpdateParams = {
      name: inputMap['name'],
      shortName: inputMap['shortName'],
      flagUrl: inputMap['flagUrl'],
    }

    updateSupportedRegion(id || null, supportedRegionType, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getSupportedRegionsPageUrl(),
          },
          applicationContext,
          router
        )
      }
    })
  }

  const onDelete = () => {
    deleteSupportedRegion(id, supportedRegionType)
      .then(resp => {
        if (resp.success) {
          onUpdateSuccess(
            {
              url: getSupportedRegionsPageUrl(),
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
        {id ? <Delete onDelete={onDelete} /> : null}
        <FormLayout inputs={formInputs} onSubmit={onSubmit} />
      </PageLayout>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: null,
      layoutData: {
        seo: {
          title: 'Supported Region - Update - CMS',
        },
        headerTitle: 'Supported Region - Update',
      },
    },
  }
}

export default UpdateSupportedRegion
