import React, { useContext, useEffect, useRef, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import FormLayout, { IFormLayoutInput } from '../../components/layout/FormLayout'
import { useRouter } from 'next/router'
import useLoginEffect from '../../hooks/useLoginEffect'
import ApplicationContext from '../../components/ApplicationContext'
import { IImageInfo, IImageInfoUpdate, IImageInfoUpdateParams } from '../../contract/image'
import { getImageById, updateImage } from '../../http/image'
import { getImagePageUrl, getImageSearchPageUrl, getImageUpdatePageUrl, prepareImageUrl } from '../../utils/image'
import { getFormattedDateTime } from '../../utils/dates'
import Head from 'next/head'
import { toastError, toastSuccess } from '../../components/Toaster'
import { onUpdateSuccess } from '../../utils/layout'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../../components/core/CoreButton'
import { UploadIcon } from '@heroicons/react/outline'
import appConfig from '../../config/appConfig'
import CoreImage, { ImageSourceType } from '../../components/core/CoreImage'
import CoreLink from '../../components/core/CoreLink'
import CoreSelectInput from '../../components/core/CoreSelectInput'

declare let window: any

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateImage: NextPage<IProps> = props => {
  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const [image, setImage] = useState<IImageInfo | null>(null)
  const [loading, toggleLoading] = useState(false)
  const [folder, setFolder] = useState('')

  const widgetRef = useRef(null)

  useEffect(() => {
    if (window.cloudinary) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: appConfig.integrations.cloudinary.cloudName,
          uploadPreset: appConfig.integrations.cloudinary.uploadPresetName,
          cropping: false,
          multiple: false,
        },
        (error, result) => {
          toggleLoading(false)

          if (!error && result && result.event === 'success') {
            const { info } = result

            const params: IImageInfoUpdateParams = {
              name: info.original_filename,
              url: `/${info.path}`,
              meta: {
                originalName: info.original_filename || null,
                sizeInBytes: info.bytes || null,
                thirdPartyId: info.asset_id || null,
                width: info.width || null,
                height: info.height || null,
              },
            }

            saveImage(params, (resp: IImageInfoUpdate) => {
              toastSuccess('Uploaded successfully!')
              if (resp.id) {
                router.push(getImageUpdatePageUrl(resp.id))
              } else {
                window.location.reload()
              }
            })

            console.log('Done! Here is the image info: ', result.info)
          }
        }
      )
    }
  }, [])

  const updateQueryId = router.query.id as any
  const id = image?.id

  useLoginEffect(() => {
    if (updateQueryId) {
      getImageById(updateQueryId).then(resp => {
        setImage(resp)
      })
    } else {
      setImage(null)
    }
  }, [updateQueryId])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getImagePageUrl(),
    },
    {
      label: 'Search',
      url: getImageSearchPageUrl(),
    },
    {
      label: 'Add',
      url: getImageUpdatePageUrl(),
    },
  ]

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: image?.id.toString(),
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'name',
      value: image?.name,
      title: 'Name',
      placeholder: 'Name',
      type: 'INPUT',
    },
    {
      key: 'createdAt',
      value: image ? getFormattedDateTime(image.createdAt) : null,
      title: 'Created Time',
      placeholder: 'Created Time',
      type: 'INPUT',
      disabled: true,
      optional: true,
    },
  ]

  const saveImage = (params: IImageInfoUpdateParams, onSuccess: (params: IImageInfoUpdate) => void) => {
    toggleLoading(true)
    updateImage(image?.id || null, params)
      .then(resp => {
        if (resp.success) {
          onSuccess(resp)
        }
      })
      .catch(error => {
        toastError('Failed to save image')
        console.log(error)
      })
      .finally(() => {
        toggleLoading(false)
      })
  }

  const onSubmit = inputMap => {
    const params: IImageInfoUpdateParams = {
      name: inputMap['name'],
      url: image?.url || null,
      meta: null,
    }

    saveImage(params, () => {
      onUpdateSuccess({}, applicationContext, router)
      setTimeout(() => {
        window.location.reload()
      }, 500)
    })
  }

  const uploadImage = () => {
    if (!folder) {
      toastError('First select folder to upload')
      return
    }

    if (widgetRef.current) {
      toggleLoading(true)
      widgetRef.current.open()
    }
  }

  const handleFolderChange = (value: string) => {
    setFolder(value)
    widgetRef.current.update({
      folder: value === 'none' || !value ? '' : value,
    })
  }

  return (
    <div className="" key={id}>
      <PageLayout links={links}>
        <div>
          {!image?.url ? (
            <div>
              <div className="flex justify-end mb-1">
                <CoreSelectInput
                  value={folder}
                  options={Object.entries(appConfig.image.imageUploadDirectory).map(([key, value]) => ({
                    id: value,
                    label: value,
                    value: value,
                    selected: value === folder,
                  }))}
                  onChange={handleFolderChange}
                  className="mr-1"
                />

                <CoreButton
                  label={
                    <React.Fragment>
                      <UploadIcon className="w-5 mr-1" />
                      <span>Upload Image</span>
                    </React.Fragment>
                  }
                  size={CoreButtonSize.MEDIUM}
                  type={CoreButtonType.SOLID_SECONDARY}
                  onClick={uploadImage}
                  disabled={loading}
                  loading={loading}
                />
              </div>
            </div>
          ) : null}
        </div>

        {image ? (
          <div className="flex justify-center">
            <CoreLink url={image.url} isExternal>
              <CoreImage url={prepareImageUrl(image.url, ImageSourceType.CLOUD)} alt={image.name} className="w-40" />
            </CoreLink>
          </div>
        ) : null}

        <FormLayout inputs={formInputs} onSubmit={onSubmit} isDisabled={loading} showLoading={loading} />

        <div className="">
          <b>Note:</b> You cannot edit or delete a saved image. Although you can update its other properties such as
          name.
        </div>

        <div className="mt-2">
          <b>Note:</b> Facebook link preview doesn't support WebP image format.
        </div>

        <div className="mt-5">
          <div className="font-medium font-primary-medium text-primaryTextBold">Recommend size of entities</div>
          <ul className="">
            <li>Full width slides: 1280x300</li>
            <li>Strict width slides: 620x50</li>
            <li>Others: Square (1:1) Eg. 500x500</li>
          </ul>
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
          title: 'Image - Update - CMS',
        },
        headerTitle: 'Image - Update',
      },
    },
  }
}

export default UpdateImage
