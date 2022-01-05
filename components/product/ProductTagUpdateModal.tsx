import React from 'react'
import { ProductTagIconType, ProductType } from '../../contract/constants'
import { IProductTagInfo } from '../../contract/product'
import { ISectionInfo, SectionInfoItem } from '../../contract/section'
import { CoreTextInputType } from '../core/CoreInput'
import Delete from '../layout/Delete'
import FormLayout, { IFormLayoutInput } from '../layout/FormLayout'
import Modal from '../modal/Modal'

interface IProductTagUpdateModalProps {
  tag: IProductTagInfo | null
  dismissModal: () => void
  onUpdate: (map: any) => void
  onDelete: (tag: IProductTagInfo) => void
}

const ProductTagUpdateModal: React.FC<IProductTagUpdateModalProps> = props => {
  const { tag, dismissModal, onUpdate, onDelete: _onDelete } = props

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: tag?.id,
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'label',
      value: tag?.label,
      title: 'Label',
      placeholder: 'Label',
      type: 'INPUT',
    },
    {
      key: 'iconType',
      value: tag?.iconType,
      title: 'Icon Type',
      placeholder: 'Icon Type',
      type: 'SELECT',
      selectProps: {
        options: Object.entries(ProductTagIconType).map(([key, value]) => ({
          id: value,
          label: value,
          value: value,
          selected: tag?.iconType === value,
        })),
      },
    },
    {
      key: 'position',
      value: tag?.position,
      title: 'Position',
      placeholder: 'Position',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'isActive',
      value: tag?.isActive || false,
      title: 'Active',
      placeholder: 'Active',
      type: 'CHECKBOX',
    },
  ]

  const onSubmit = inputMap => {
    onUpdate(inputMap)
  }

  const onDelete = () => {
    _onDelete(tag)
  }

  return (
    <Modal
      dismissModal={dismissModal}
      title={tag ? 'Update product tag' : 'Add product tag'}
      disableOutsideClick
      className="productTagUpdateModalOverrides">
      <div className="content pt-4 px-3">
        {tag?.id ? <Delete onDelete={onDelete} /> : null}
        <FormLayout inputs={formInputs} onSubmit={onSubmit} buttonClassName={'lg:w-full mt-2'} />
      </div>
    </Modal>
  )
}

export default ProductTagUpdateModal
