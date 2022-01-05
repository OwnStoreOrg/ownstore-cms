import React from 'react'
import { ICurrencyInfo } from '../../contract/currency'
import EscapeHTML from '../EscapeHTML'
import Modal from '../modal/Modal'

interface ICartTaxAndChargesModalProps {
  extraChargesAmount: number | null
  taxAmount: number | null
  currency: ICurrencyInfo
  dismissModal: () => void
}

const CartTaxAndChargesModal: React.FC<ICartTaxAndChargesModalProps> = props => {
  const { dismissModal, extraChargesAmount, taxAmount, currency } = props

  return (
    <Modal title="Tax and Charges" dismissModal={dismissModal}>
      <div className="px-3 py-0 pb-5">
        <div className="flex justify-between text-primaryTextBold">
          <div>Tax</div>
          <div>
            <EscapeHTML html={currency.symbol} element="span" />
            {taxAmount}
          </div>
        </div>

        <div className="flex justify-between text-primaryTextBold mt-2">
          <div>Extra Charges</div>
          <div>
            <EscapeHTML html={currency.symbol} element="span" />
            {extraChargesAmount}
          </div>
        </div>

        <hr className="text-gray300 my-3" />

        <div className="flex justify-between text-primaryTextBold mt-2 font-medium font-primary-medium">
          <div>Total</div>
          <div>
            <EscapeHTML html={currency.symbol} element="span" />
            {taxAmount + extraChargesAmount}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default CartTaxAndChargesModal
