import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { ICustomerFeedbackInfo, ICustomerFeedbackInfoUpdateParams, ISectionInfo } from '../../contract/section'
import { deleteCustomerFeedback, updateCustomerFeedback } from '../../http/section'
import { prepareImageUrl } from '../../utils/image'
import { onDeleteSuccess, onUpdateSuccess } from '../../utils/layout'
import ApplicationContext from '../ApplicationContext'
import { ImageSourceType } from '../core/CoreImage'
import { CoreTextInputType } from '../core/CoreInput'
import CoreLink from '../core/CoreLink'
import Delete from '../layout/Delete'
import FormLayout, { IFormLayoutInput } from '../layout/FormLayout'
import { SectionItemUpdateFormLayoutType } from './SectionItemUpdateForm'

export interface ISectionItemUpdateFormCustomerFeedbackProps {
  section: ISectionInfo
  customerFeedback: ICustomerFeedbackInfo | null
  onSuccess: () => void
  layout: SectionItemUpdateFormLayoutType
}

const SectionItemUpdateFormCustomerFeedback: React.FC<ISectionItemUpdateFormCustomerFeedbackProps> = props => {
  const { section, customerFeedback, onSuccess, layout } = props

  const applicationContext = useContext(ApplicationContext)
  const router = useRouter()

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: customerFeedback?.id,
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'name',
      value: customerFeedback?.name,
      title: 'Customer Name',
      placeholder: 'Customer Name',
      type: 'INPUT',
    },
    {
      key: 'email',
      value: customerFeedback?.email,
      title: 'Customer Email',
      placeholder: 'Customer Email',
      type: 'INPUT',
      optional: true,
    },
    {
      key: 'designation',
      value: customerFeedback?.designation,
      title: 'Customer Designation',
      placeholder: 'Customer Designation',
      type: 'INPUT',
      optional: true,
    },
    {
      key: 'feedback',
      value: customerFeedback?.feedback,
      title: 'Feedback',
      placeholder: 'Feedback',
      type: 'TEXTAREA',
      textAreaProps: {
        className: 'h-[150px]',
      },
    },
    {
      key: 'imageId',
      value: customerFeedback?.image.id,
      title: `Image ID (Customer's avatar)`,
      subTitle: customerFeedback?.image ? (
        <CoreLink
          url={prepareImageUrl(customerFeedback.image.url, ImageSourceType.CLOUD)}
          isExternal
          className="underline">
          {customerFeedback.image.url}
        </CoreLink>
      ) : null,
      placeholder: 'Image ID',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'position',
      value: customerFeedback?.position,
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
      value: customerFeedback?.isActive || false,
      title: 'Active',
      subTitle: 'Show in section row',
      placeholder: 'Active',
      type: 'CHECKBOX',
    },
  ]

  const onSubmit = inputMap => {
    const params: ICustomerFeedbackInfoUpdateParams = {
      name: inputMap['name'],
      email: inputMap['email'] || null,
      designation: inputMap['designation'] || null,
      feedback: inputMap['feedback'],
      imageId: inputMap['imageId'],
      isActive: inputMap['isActive'],
      position: inputMap['position'],
    }

    updateCustomerFeedback(section.id, customerFeedback?.id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess({}, applicationContext, router)
        onSuccess()
      }
    })
  }

  const onDelete = () => {
    deleteCustomerFeedback(section.id, customerFeedback.id)
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
      {customerFeedback?.id ? <Delete onDelete={onDelete} /> : null}
      <FormLayout
        inputs={formInputs}
        onSubmit={onSubmit}
        buttonClassName={layout === SectionItemUpdateFormLayoutType.MODAL ? 'lg:w-full mt-2' : ''}
      />
    </div>
  )
}

export default SectionItemUpdateFormCustomerFeedback
