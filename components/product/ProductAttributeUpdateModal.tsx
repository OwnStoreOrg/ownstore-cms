import React from 'react'
import { ProductTagIconType } from '../../contract/constants'
import { IProductAttributeInfo, IProductTagInfo } from '../../contract/product'
import { ISectionInfo, SectionInfoItem } from '../../contract/section'
import { CoreTextInputType } from '../core/CoreInput'
import Delete from '../layout/Delete'
import FormLayout, { IFormLayoutInput } from '../layout/FormLayout'
import Modal from '../modal/Modal'

interface IProductAttributeUpdateModalProps {
  attribute: IProductAttributeInfo | null
  dismissModal: () => void
  onUpdate: (map: any) => void
  onDelete: (tag: IProductAttributeInfo) => void
}

const ProductAttributeUpdateModal: React.FC<IProductAttributeUpdateModalProps> = props => {
  const { attribute, dismissModal, onUpdate: onUpdate, onDelete: _onDelete } = props

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: attribute?.id,
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'keyId',
      value: attribute?.key?.id,
      title: 'Attribute Key ID',
      subTitle: 'Attribute key associated with this',
      placeholder: 'Attribute Key ID',
      type: 'INPUT',
      optional: true,
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'value',
      value: attribute?.value,
      title: 'Attribute Value',
      subTitle: 'Value of this attribute',
      placeholder: 'Attribute Value',
      type: 'INPUT',
    },
    {
      key: 'position',
      value: attribute?.position,
      title: 'Position',
      placeholder: 'Position',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'isActive',
      value: attribute?.isActive || false,
      title: 'Active',
      placeholder: 'Active',
      type: 'CHECKBOX',
    },
  ]

  const onSubmit = inputMap => {
    onUpdate(inputMap)
  }

  const onDelete = () => {
    _onDelete(attribute)
  }

  return (
    <Modal
      dismissModal={dismissModal}
      title={attribute ? 'Update product attribute' : 'Add product attribute'}
      disableOutsideClick
      className="productAttributeUpdateModalOverrides">
      <div className="content pt-4 px-3">
        {attribute?.id ? <Delete onDelete={onDelete} /> : null}
        <FormLayout inputs={formInputs} onSubmit={onSubmit} buttonClassName={'lg:w-full mt-2'} />
      </div>
    </Modal>
  )
}

export default ProductAttributeUpdateModal
