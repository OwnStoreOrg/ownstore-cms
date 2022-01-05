import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { ICustomSectionBody, ICustomSectionBodyUpdateParams, ISectionInfo } from '../../contract/section'
import { deleteCustomSection, updateCustomSection } from '../../http/section'
import { onDeleteSuccess, onUpdateSuccess } from '../../utils/layout'
import ApplicationContext from '../ApplicationContext'
import { CoreTextInputType } from '../core/CoreInput'
import Delete from '../layout/Delete'
import FormLayout, { IFormLayoutInput } from '../layout/FormLayout'
import { SectionItemUpdateFormLayoutType } from './SectionItemUpdateForm'

export interface ISectionItemUpdateFormCustomSectionProps {
  section: ISectionInfo
  customSection: ICustomSectionBody | null
  onSuccess: () => void
  layout: SectionItemUpdateFormLayoutType
}

const SectionItemUpdateFormCustomSection: React.FC<ISectionItemUpdateFormCustomSectionProps> = props => {
  const { section, customSection, onSuccess, layout } = props

  const applicationContext = useContext(ApplicationContext)
  const router = useRouter()

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: customSection?.id,
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'html',
      value: customSection?.html,
      title: 'HTML',
      subTitle: 'Add custom raw HTML for the section',
      placeholder: 'HTML',
      type: 'TEXTAREA',
      textAreaProps: {
        className: 'h-[250px]',
      },
    },
    {
      key: 'position',
      value: customSection?.position,
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
      value: customSection?.isActive || false,
      title: 'Active',
      subTitle: 'Show in section row',
      placeholder: 'Active',
      type: 'CHECKBOX',
    },
  ]

  const onSubmit = inputMap => {
    const params: ICustomSectionBodyUpdateParams = {
      html: inputMap['html'],
      isActive: inputMap['isActive'],
      position: inputMap['position'],
    }

    updateCustomSection(section.id, customSection?.id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess({}, applicationContext, router)
        onSuccess()
      }
    })
  }

  const onDelete = () => {
    deleteCustomSection(section.id, customSection.id)
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
      {customSection?.id ? <Delete onDelete={onDelete} /> : null}
      <FormLayout
        inputs={formInputs}
        onSubmit={onSubmit}
        buttonClassName={layout === SectionItemUpdateFormLayoutType.MODAL ? 'lg:w-full mt-2' : ''}
      />
    </div>
  )
}

export default SectionItemUpdateFormCustomSection
