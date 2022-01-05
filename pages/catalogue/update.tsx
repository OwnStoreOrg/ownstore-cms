import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import FormLayout, { IFormLayoutInput } from '../../components/layout/FormLayout'
import { useRouter } from 'next/router'
import Delete from '../../components/layout/Delete'
import useLoginEffect from '../../hooks/useLoginEffect'
import { onDeleteSuccess, onUpdateSuccess } from '../../utils/layout'
import ApplicationContext from '../../components/ApplicationContext'
import { CoreTextInputType } from '../../components/core/CoreInput'
import { deleteCatalogue, getCatalogueById, updateCatalogue } from '../../http/catalogue'
import { ICatalogueInfo, ICatalogueInfoUpdateParams } from '../../contract/catalogue'
import {
  getCatalogueImagesPageUrl,
  getCataloguePageUrl,
  getCatalogueSearchPageUrl,
  getCatalogueUpdatePageUrl,
} from '../../utils/catalogue'
import CoreLink from '../../components/core/CoreLink'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateCatalogue: NextPage<IProps> = props => {
  const [catalogue, setCatalogue] = useState<ICatalogueInfo | null>(null)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any
  const id = catalogue?.id

  useLoginEffect(() => {
    if (updateQueryId) {
      getCatalogueById(updateQueryId).then(resp => {
        setCatalogue(resp)
      })
    } else {
      setCatalogue(null)
    }
  }, [updateQueryId])

  let links: IPageLink[] = []

  if (updateQueryId) {
    links = [
      {
        label: 'Catalogues',
        url: getCataloguePageUrl(),
      },
      {
        label: 'Basic Info',
        url: getCatalogueUpdatePageUrl(updateQueryId),
      },
      {
        label: 'Images',
        url: getCatalogueImagesPageUrl(updateQueryId),
      },
    ]
  } else {
    links = [
      {
        label: 'View',
        url: getCataloguePageUrl(),
      },
      {
        label: 'Search',
        url: getCatalogueSearchPageUrl(),
      },
      {
        label: 'Add',
        url: getCatalogueUpdatePageUrl(),
      },
    ]
  }

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: catalogue?.id.toString(),
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'name',
      value: catalogue?.name,
      title: 'Name',
      placeholder: 'Name',
      type: 'INPUT',
    },
    {
      key: 'imageIds',
      value: catalogue?.images.map(image => image.id).join(','),
      title: 'Image IDs',
      subTitle: 'Image IDs separated by a comma (,)',
      placeholder: 'Image IDs',
      type: 'TEXTAREA',
      textAreaProps: {
        className: 'h-[100px]',
      },
    },
    {
      key: 'position',
      value: catalogue?.position,
      title: 'Position',
      placeholder: 'Position',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'isActive',
      value: catalogue?.isActive || false,
      title: 'Active',
      placeholder: 'Active',
      type: 'CHECKBOX',
    },
  ]

  const onSubmit = inputMap => {
    const params: ICatalogueInfoUpdateParams = {
      name: inputMap['name'],
      imageIds: inputMap['imageIds'],
      position: inputMap['position'],
      isActive: inputMap['isActive'],
    }

    updateCatalogue(id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getCataloguePageUrl(),
          },
          applicationContext,
          router
        )
      }
    })
  }

  const onDelete = () => {
    deleteCatalogue(id)
      .then(resp => {
        if (resp.success) {
          onDeleteSuccess(
            {
              url: getCataloguePageUrl(),
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
        {/* {id ? <Delete onDelete={onDelete} /> : null} */}
        <FormLayout inputs={formInputs} onSubmit={onSubmit} />
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
          title: 'Catalogue - Update - CMS',
        },
        headerTitle: 'Catalogue - Update',
      },
    },
  }
}

export default UpdateCatalogue
