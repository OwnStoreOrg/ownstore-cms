import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { ISectionInfo, ISlideInfo, ISlideInfoUpdateParams } from '../../contract/section'
import { deleteBlogSection, deleteSlide, updateBlogSection, updateSlide } from '../../http/section'
import { prepareImageUrl } from '../../utils/image'
import { onDeleteSuccess, onUpdateSuccess } from '../../utils/layout'
import ApplicationContext from '../ApplicationContext'
import { ImageSourceType } from '../core/CoreImage'
import { CoreTextInputType } from '../core/CoreInput'
import CoreLink from '../core/CoreLink'
import Delete from '../layout/Delete'
import FormLayout, { IFormLayoutInput } from '../layout/FormLayout'
import { SectionItemUpdateFormLayoutType } from './SectionItemUpdateForm'

export interface ISectionItemUpdateFormSlideProps {
  section: ISectionInfo
  slide: ISlideInfo | null
  onSuccess: () => void
  layout: SectionItemUpdateFormLayoutType
}

const SectionItemUpdateFormSlide: React.FC<ISectionItemUpdateFormSlideProps> = props => {
  const { section, slide, onSuccess, layout } = props

  const applicationContext = useContext(ApplicationContext)
  const router = useRouter()

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: slide?.id,
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'imageId',
      value: slide?.image.id,
      title: 'Image ID',
      subTitle: slide?.image ? (
        <CoreLink url={prepareImageUrl(slide.image.url, ImageSourceType.CLOUD)} isExternal className="underline">
          {slide.image.url}
        </CoreLink>
      ) : null,
      placeholder: 'Image ID',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'mobileImageId',
      value: slide?.mobileImage?.id,
      title: 'Mobile Image ID',
      subTitle: 'Image to show in mobile view',
      placeholder: 'Mobile Image ID',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
      optional: true,
    },
    {
      key: 'url',
      value: slide?.url,
      title: 'URL',
      subTitle: 'Link to any URL',
      placeholder: 'URL',
      type: 'INPUT',
      optional: true,
    },
    {
      key: 'position',
      value: slide?.position,
      title: 'Position',
      subTitle: 'Position in the section row',
      placeholder: 'Position',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'isActive',
      value: slide?.isActive || false,
      title: 'Active',
      subTitle: 'Show in section row',
      placeholder: 'Active',
      type: 'CHECKBOX',
    },
  ]

  const onSubmit = inputMap => {
    const params: ISlideInfoUpdateParams = {
      url: inputMap['url'] || null,
      imageId: inputMap['imageId'],
      mobileImageId: inputMap['mobileImageId'] || null,
      isActive: inputMap['isActive'],
      position: inputMap['position'],
    }

    updateSlide(section.id, slide?.id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess({}, applicationContext, router)
        onSuccess()
      }
    })
  }

  const onDelete = () => {
    deleteSlide(section.id, slide.id)
      .then(resp => {
        if (resp.success) {
          onDeleteSuccess({}, applicationContext, router)
          onSuccess()
        }
      })
      .catch(console.error)
  }

  return (
    <div>
      {slide?.id ? <Delete onDelete={onDelete} /> : null}
      <FormLayout
        inputs={formInputs}
        onSubmit={onSubmit}
        buttonClassName={layout === SectionItemUpdateFormLayoutType.MODAL ? 'lg:w-full mt-2' : ''}
      />
    </div>
  )
}

export default SectionItemUpdateFormSlide
