import React, { useContext, useRef, useState } from 'react'
import appConfig from '../../config/appConfig'
import { IOrderDetail } from '../../contract/order'
import ApiError from '../../error/ApiError'
import useOnEnter from '../../hooks/useOnEnter'
import { refundUserOrder } from '../../http/order'
import { getRefundPolicyPageUrl } from '../../utils/refundPolicy'
import ApplicationContext from '../ApplicationContext'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import CoreDivider from '../core/CoreDivider'
import CoreLink from '../core/CoreLink'
import CoreRadio from '../core/CoreRadio'
import CoreTextarea from '../core/CoreTextarea'
import Modal from '../modal/Modal'
import { toastError, toastSuccess } from '../Toaster'

interface ICancelOrderModalProps {
  orderDetail: IOrderDetail
  dismissModal: () => void
}

const CancelOrderModal: React.FC<ICancelOrderModalProps> = props => {
  const { orderDetail, dismissModal } = props

  const { id, cancellationReasons, user } = orderDetail

  const applicationContext = useContext(ApplicationContext)

  const [loading, toggleLoading] = useState(false)
  const [radioAnswer, setRadioAnswer] = useState({
    id: null,
    label: '',
  })
  const [textValue, setTextValue] = useState('')

  const RADIO_OPTIONS = cancellationReasons.map((reason, index) => ({
    id: index + 1,
    label: reason,
  }))

  const handleSubmit = () => {
    if (loading) {
      return null
    }

    const hasAnswered = !!(radioAnswer.id || textValue.trim())

    if (!hasAnswered) {
      toastError('Please add a reason')
    } else {
      toggleLoading(true)
      refundUserOrder(user.id, id, {
        reason: radioAnswer.label || textValue,
      })
        .then(resp => {
          if (resp.success) {
            toastSuccess('Order cancelled')
            dismissModal()
            window.location.reload()
          }
        })
        .catch(err => {
          if (err instanceof ApiError && err.response.code !== 'UNKNOWN') {
            toastError(err.response.message || 'Failed to cancel order')
          } else {
            toastError('Failed to cancel order')
          }
        })
        .finally(() => toggleLoading(false))
    }
  }

  return (
    <Modal dismissModal={dismissModal} title={'Cancel Order'} disableOutsideClick className="cancelOrderModalOverrides">
      <div className="content pt-4 px-3">
        <div>
          <div className="mt-2 mb-4">
            <div>
              <div className="font-medium font-primary-medium">Reason for cancellation*</div>
            </div>
            <div className="mt-2">
              {RADIO_OPTIONS.map(option => (
                <CoreRadio
                  key={option.id}
                  id={`answer-${option.id}`}
                  onChange={value => {
                    setRadioAnswer({
                      id: Number(value),
                      label: option.label,
                    })
                  }}
                  value={`${option.id}`}
                  label={option.label}
                  checked={option.id === radioAnswer.id}
                  className="my-3"
                />
              ))}

              <div className="mt-4">
                <CoreTextarea value={textValue} setValue={setTextValue} placeholder="Custom reason" className="h-24" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <CoreButton
        label={'Cancel and Refund'}
        size={CoreButtonSize.LARGE}
        type={CoreButtonType.SOLID_PRIMARY}
        className="w-full rounded-none lg:rounded-b-md py-3 border-primary z-10"
        loading={loading}
        onClick={handleSubmit}
      />
    </Modal>
  )
}

export default CancelOrderModal
