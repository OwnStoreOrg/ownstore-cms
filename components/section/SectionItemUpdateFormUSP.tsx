import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { ISectionInfo, IUSPInfo, IUSPInfoUpdateParams } from '../../contract/section'
import { deleteUSP, updateUSP } from '../../http/section'
import { prepareImageUrl } from '../../utils/image'
import { onDeleteSuccess, onUpdateSuccess } from '../../utils/layout'
import ApplicationContext from '../ApplicationContext'
import { ImageSourceType } from '../core/CoreImage'
import { CoreTextInputType } from '../core/CoreInput'
import CoreLink from '../core/CoreLink'
import Delete from '../layout/Delete'
import FormLayout, { IFormLayoutInput } from '../layout/FormLayout'
import { SectionItemUpdateFormLayoutType } from './SectionItemUpdateForm'

export interface ISectionItemUpdateFormUSPProps {
  section: ISectionInfo
  usp: IUSPInfo | null
  onSuccess: () => void
  layout: SectionItemUpdateFormLayoutType
}

const SectionItemUpdateFormUSP: React.FC<ISectionItemUpdateFormUSPProps> = props => {
  const { section, usp, onSuccess, layout } = props

  const applicationContext = useContext(ApplicationContext)
  const router = useRouter()

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: usp?.id,
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'name',
      value: usp?.name,
      title: 'Name',
      placeholder: 'Name',
      type: 'INPUT',
    },
    {
      key: 'imageId',
      value: usp?.image.id,
      title: 'Image ID',
      subTitle: usp?.image ? (
        <CoreLink url={prepareImageUrl(usp.image.url, ImageSourceType.CLOUD)} isExternal className="underline">
          {usp.image.url}
        </CoreLink>
      ) : null,
      placeholder: 'Image ID',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'url',
      value: usp?.url,
      title: 'URL',
      placeholder: 'URL',
      type: 'INPUT',
      optional: true,
    },
    {
      key: 'position',
      value: usp?.position,
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
      value: usp?.isActive || false,
      title: 'Active',
      subTitle: 'Show in section row',
      placeholder: 'Active',
      type: 'CHECKBOX',
    },
  ]

  const onSubmit = inputMap => {
    const params: IUSPInfoUpdateParams = {
      name: inputMap['name'],
      url: inputMap['url'] || null,
      imageId: inputMap['imageId'],
      isActive: inputMap['isActive'],
      position: inputMap['position'],
    }

    updateUSP(section.id, usp?.id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess({}, applicationContext, router)
        onSuccess()
      }
    })
  }

  const onDelete = () => {
    deleteUSP(section.id, usp.id)
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
      {usp?.id ? <Delete onDelete={onDelete} /> : null}
      <FormLayout
        inputs={formInputs}
        onSubmit={onSubmit}
        buttonClassName={layout === SectionItemUpdateFormLayoutType.MODAL ? 'lg:w-full mt-2' : ''}
      />
    </div>
  )
}

export default SectionItemUpdateFormUSP
