import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { ICatalogueSectionInfo, ICatalogueSectionInfoUpdateParams, ISectionInfo } from '../../contract/section'
import { deleteCatalogueSection, updateCatalogueSection } from '../../http/section'
import { onDeleteSuccess, onUpdateSuccess } from '../../utils/layout'
import ApplicationContext from '../ApplicationContext'
import { CoreTextInputType } from '../core/CoreInput'
import Delete from '../layout/Delete'
import FormLayout, { IFormLayoutInput } from '../layout/FormLayout'
import { SectionItemUpdateFormLayoutType } from './SectionItemUpdateForm'

export interface ISectionItemUpdateFormCatalogueProps {
  section: ISectionInfo
  catalogue: ICatalogueSectionInfo | null
  onSuccess: () => void
  layout: SectionItemUpdateFormLayoutType
}

const SectionItemUpdateFormCatalogue: React.FC<ISectionItemUpdateFormCatalogueProps> = props => {
  const { section, catalogue, onSuccess, layout } = props

  const applicationContext = useContext(ApplicationContext)
  const router = useRouter()

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: catalogue?.id,
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'catalogueId',
      value: catalogue?.catalogueInfo.id,
      title: 'Catalogue ID',
      placeholder: 'Catalogue ID',
      type: 'INPUT',
    },
    {
      key: 'position',
      value: catalogue?.position,
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
      value: catalogue?.isActive || false,
      title: 'Active',
      subTitle: 'Show in section row',
      placeholder: 'Active',
      type: 'CHECKBOX',
    },
  ]

  const onSubmit = inputMap => {
    const params: ICatalogueSectionInfoUpdateParams = {
      catalogueId: inputMap['catalogueId'],
      isActive: inputMap['isActive'],
      position: inputMap['position'],
    }

    updateCatalogueSection(section.id, catalogue?.id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess({}, applicationContext, router)
        onSuccess()
      }
    })
  }

  const onDelete = () => {
    deleteCatalogueSection(section.id, catalogue.id)
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
      {catalogue?.id ? <Delete onDelete={onDelete} /> : null}
      <FormLayout
        inputs={formInputs}
        onSubmit={onSubmit}
        buttonClassName={layout === SectionItemUpdateFormLayoutType.MODAL ? 'lg:w-full mt-2' : ''}
      />
    </div>
  )
}

export default SectionItemUpdateFormCatalogue
