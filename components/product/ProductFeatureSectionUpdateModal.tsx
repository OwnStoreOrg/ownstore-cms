import React from 'react'
import { ProductTagIconType } from '../../contract/constants'
import { IProductFeatureSectionInfo, IProductTagInfo } from '../../contract/product'
import { ISectionInfo, SectionInfoItem } from '../../contract/section'
import { CoreTextInputType } from '../core/CoreInput'
import Delete from '../layout/Delete'
import FormLayout, { IFormLayoutInput } from '../layout/FormLayout'
import Modal from '../modal/Modal'

interface IProductFeatureSectionUpdateModalProps {
  featureSection: IProductFeatureSectionInfo | null
  dismissModal: () => void
  onUpdate: (map: any) => void
  onDelete: (tag: IProductFeatureSectionInfo) => void
}

const ProductFeatureSectionUpdateModal: React.FC<IProductFeatureSectionUpdateModalProps> = props => {
  const { featureSection, dismissModal, onUpdate: onUpdate, onDelete: _onDelete } = props

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: featureSection?.id,
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'title',
      value: featureSection?.title,
      title: 'Title',
      subTitle: 'Section title',
      placeholder: 'Title',
      type: 'INPUT',
    },
    {
      key: 'body',
      value: featureSection?.body,
      title: 'Body',
      subTitle: 'Section body as raw HTML',
      placeholder: 'Body',
      type: 'TEXTAREA',
      textAreaProps: {
        className: 'h-[200px]',
      },
    },
    {
      key: 'position',
      value: featureSection?.position,
      title: 'Position',
      placeholder: 'Position',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'isActive',
      value: featureSection?.isActive || false,
      title: 'Active',
      placeholder: 'Active',
      type: 'CHECKBOX',
    },
  ]

  const onSubmit = inputMap => {
    onUpdate(inputMap)
  }

  const onDelete = () => {
    _onDelete(featureSection)
  }

  return (
    <Modal
      dismissModal={dismissModal}
      title={featureSection ? 'Update product feature section' : 'Add product feature section'}
      disableOutsideClick
      className="productFeatureSectionUpdateModalOverrides">
      <div className="content pt-4 px-3">
        {featureSection?.id ? <Delete onDelete={onDelete} /> : null}
        <FormLayout inputs={formInputs} onSubmit={onSubmit} buttonClassName={'lg:w-full mt-2'} />
      </div>
    </Modal>
  )
}

export default ProductFeatureSectionUpdateModal
