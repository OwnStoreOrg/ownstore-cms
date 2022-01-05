import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { ProductType, SectionType } from '../../contract/constants'
import { IComboProductInfo, IIndividualProductInfo } from '../../contract/product'
import { IProductSectionInfo, IProductSectionInfoUpdateParams, ISectionInfo } from '../../contract/section'
import { deleteProductSection, updateProductSection } from '../../http/section'
import { onDeleteSuccess, onUpdateSuccess } from '../../utils/layout'
import ApplicationContext from '../ApplicationContext'
import { CoreTextInputType } from '../core/CoreInput'
import Delete from '../layout/Delete'
import FormLayout, { IFormLayoutInput } from '../layout/FormLayout'
import { SectionItemUpdateFormLayoutType } from './SectionItemUpdateForm'

export interface ISectionItemUpdateFormProductProps {
  section: ISectionInfo
  productSection: IProductSectionInfo | null
  onSuccess: () => void
  layout: SectionItemUpdateFormLayoutType
}

const SectionItemUpdateFormProduct: React.FC<ISectionItemUpdateFormProductProps> = props => {
  const { section, productSection, onSuccess, layout } = props
  const product = productSection?.productInfo as IIndividualProductInfo | IComboProductInfo

  const applicationContext = useContext(ApplicationContext)
  const router = useRouter()

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: productSection?.id,
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'productId',
      value: product?.id,
      title: 'Product ID',
      subTitle: 'ID of the product. Either Individual or Combo',
      placeholder: 'Product ID',
      type: 'INPUT',
    },
    {
      key: 'productType',
      value: product?.type,
      title: 'Product Type',
      placeholder: 'Product Type',
      type: 'SELECT',
      selectProps: {
        options: Object.values(ProductType).map(val => ({
          id: val,
          label: val,
          selected: val === product?.type,
          value: val || '',
        })),
      },
    },
    {
      key: 'position',
      value: productSection?.position,
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
      value: productSection?.isActive || false,
      title: 'Active',
      subTitle: 'Show in section row',
      placeholder: 'Active',
      type: 'CHECKBOX',
    },
  ]

  const onSubmit = inputMap => {
    const params: IProductSectionInfoUpdateParams = {
      productId: inputMap['productId'],
      productType: inputMap['productType'],
      isActive: inputMap['isActive'],
      position: inputMap['position'],
    }

    updateProductSection(section.id, productSection?.id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess({}, applicationContext, router)
        onSuccess()
      }
    })
  }

  const onDelete = () => {
    deleteProductSection(section.id, productSection.id)
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
      {productSection?.id ? <Delete onDelete={onDelete} /> : null}
      <FormLayout
        inputs={formInputs}
        onSubmit={onSubmit}
        buttonClassName={layout === SectionItemUpdateFormLayoutType.MODAL ? 'lg:w-full mt-2' : ''}
      />
    </div>
  )
}

export default SectionItemUpdateFormProduct
