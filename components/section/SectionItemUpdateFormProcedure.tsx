import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { IProcedureInfo, IProcedureInfoUpdateParams, ISectionInfo } from '../../contract/section'
import { deleteProcedure, updateProcedure } from '../../http/section'
import { prepareImageUrl } from '../../utils/image'
import { onDeleteSuccess, onUpdateSuccess } from '../../utils/layout'
import ApplicationContext from '../ApplicationContext'
import { ImageSourceType } from '../core/CoreImage'
import { CoreTextInputType } from '../core/CoreInput'
import CoreLink from '../core/CoreLink'
import Delete from '../layout/Delete'
import FormLayout, { IFormLayoutInput } from '../layout/FormLayout'
import { SectionItemUpdateFormLayoutType } from './SectionItemUpdateForm'

export interface ISectionItemUpdateFormProcedureProps {
  section: ISectionInfo
  procedure: IProcedureInfo | null
  onSuccess: () => void
  layout: SectionItemUpdateFormLayoutType
}

const SectionItemUpdateFormProcedure: React.FC<ISectionItemUpdateFormProcedureProps> = props => {
  const { section, procedure, onSuccess, layout } = props

  const applicationContext = useContext(ApplicationContext)
  const router = useRouter()

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: procedure?.id,
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'title',
      value: procedure?.title,
      title: 'Title',
      placeholder: 'Title',
      type: 'INPUT',
    },
    {
      key: 'subTitle',
      value: procedure?.subTitle,
      title: 'SubTitle',
      placeholder: 'SubTitle',
      type: 'INPUT',
    },
    {
      key: 'imageId',
      value: procedure?.image?.id,
      title: 'Image ID',
      subTitle: procedure?.image ? (
        <CoreLink url={prepareImageUrl(procedure.image.url, ImageSourceType.CLOUD)} isExternal className="underline">
          {procedure.image.url}
        </CoreLink>
      ) : null,
      placeholder: 'Image ID',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
      optional: true,
    },
    {
      key: 'position',
      value: procedure?.position,
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
      value: procedure?.isActive || false,
      title: 'Active',
      subTitle: 'Show in section row',
      placeholder: 'Active',
      type: 'CHECKBOX',
    },
  ]

  const onSubmit = inputMap => {
    const params: IProcedureInfoUpdateParams = {
      title: inputMap['title'],
      subTitle: inputMap['subTitle'],
      imageId: inputMap['imageId'] || null,
      isActive: inputMap['isActive'],
      position: inputMap['position'],
    }

    updateProcedure(section.id, procedure?.id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess({}, applicationContext, router)
        onSuccess()
      }
    })
  }

  const onDelete = () => {
    deleteProcedure(section.id, procedure.id)
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
      {procedure?.id ? <Delete onDelete={onDelete} /> : null}
      <FormLayout
        inputs={formInputs}
        onSubmit={onSubmit}
        buttonClassName={layout === SectionItemUpdateFormLayoutType.MODAL ? 'lg:w-full mt-2' : ''}
      />
    </div>
  )
}

export default SectionItemUpdateFormProcedure
