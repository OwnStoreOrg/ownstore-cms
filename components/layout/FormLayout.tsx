import classNames from 'classnames'
import React, { useRef, useState } from 'react'
import useOnEnter from '../../hooks/useOnEnter'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import CoreCheckbox from '../core/CoreCheckbox'
import CoreTextInput, { CoreTextInputType } from '../core/CoreInput'
import CoreSelectInput, { ICoreSelectInputOption } from '../core/CoreSelectInput'
import CoreTextarea from '../core/CoreTextarea'
import { toastError } from '../Toaster'

export interface IFormLayoutInput {
  key: any
  title?: React.ReactNode
  subTitle?: React.ReactNode
  value: any
  placeholder?: string
  disabled?: boolean
  optional?: boolean
  type: 'INPUT' | 'CHECKBOX' | 'TEXTAREA' | 'SELECT' | 'FILE' | 'BUTTON'
  inputProps?: {
    type: CoreTextInputType
  }
  textAreaProps?: {
    className?: string
  }
  selectProps?: {
    options: ICoreSelectInputOption[]
  }
  buttonProps?: {
    onClick: () => void
  }
  dividerTopTitle?: React.ReactNode
}

export type IFormInputMap = Record<string, string>

interface IFormLayoutProps {
  inputs: IFormLayoutInput[]
  onSubmit: (inputMap: IFormInputMap) => void
  buttonClassName?: string
  isDisabled?: boolean
  showLoading?: boolean
}

const FormLayout: React.FC<IFormLayoutProps> = props => {
  const prepareInputMap = () => {
    const result: IFormInputMap = {}
    props.inputs.forEach(input => {
      result[input.key] = input.value
    })
    return result
  }

  const [valueMap, setValueMap] = useState<IFormInputMap>(prepareInputMap())

  const updateValueMap = (input: IFormLayoutInput, value: any) => {
    const newMap = {
      ...valueMap,
      [input.key]: value,
    }
    setValueMap(newMap)
  }

  const areFieldsInvalid = () => {
    const invalid = Object.entries(valueMap).find(([key, value]) => {
      const inputData = props.inputs.find(input => input.key === key)

      if (!inputData.disabled) {
        if (inputData.optional && !value) {
          return false
        }

        if (inputData.type === 'INPUT') {
          if (inputData.inputProps?.type === CoreTextInputType.NUMBER) {
            return value === undefined || null
          } else {
            return !value
          }
        }

        if (inputData.type === 'SELECT') {
          return !value
        }

        if (inputData.type === 'CHECKBOX') {
          return value === undefined || null
        }
      }
    })

    console.log('Invalid field', invalid)
    return invalid
  }

  const onSubmit = () => {
    if (areFieldsInvalid()) {
      toastError('Invalid fields')
      return
    }

    props.onSubmit(valueMap)
  }

  const mappedInputs = props.inputs.map((input, index) => {
    const header = (
      <div className="user-input-label">
        {input.title && input.type !== 'CHECKBOX' ? (
          <div className="">
            {input.title} {!input.optional ? '*' : ''}
          </div>
        ) : null}
        {input.subTitle ? (
          <div className="text-sm font-primary font-normal text-primaryText">{input.subTitle}</div>
        ) : null}
      </div>
    )

    const divider = input.dividerTopTitle ? (
      <div className="flex items-center justify-center pt-2 pb-3">
        <div className="w-40 h-[2px] bg-gray300 flex-grow" />
        <div className="mx-1 font-primary-bold font-bold text-primaryTextBold">{input.dividerTopTitle}</div>
        <div className="w-40 h-[2px] bg-gray300 flex-grow" />
      </div>
    ) : null

    if (input.type === 'INPUT') {
      return (
        <div className="user-input-group" key={input.key}>
          {divider}
          {header}
          <CoreTextInput
            type={input.inputProps?.type || CoreTextInputType.TEXT}
            placeholder={input.placeholder}
            value={valueMap[input.key]}
            setValue={value => updateValueMap(input, value)}
            autoComplete="off"
            autoFocus={index === 0}
            disabled={input.disabled}
            inputClassName={classNames('user-input', {})}
          />
        </div>
      )
    }

    if (input.type === 'TEXTAREA') {
      return (
        <div className="user-input-group" key={input.key}>
          {divider}
          {header}
          <CoreTextarea
            placeholder={input.placeholder}
            value={valueMap[input.key]}
            setValue={value => updateValueMap(input, value)}
            className={classNames(input.textAreaProps?.className)}
            disabled={input.disabled}
          />
        </div>
      )
    }

    if (input.type === 'CHECKBOX') {
      return (
        <div className="user-input-group">
          {divider}
          <CoreCheckbox
            id="primary"
            onChange={value => updateValueMap(input, value)}
            checked={valueMap[input.key] as any}
            label={`${input.title} ${!input.optional ? '*' : ''}`}
            disabled={input.disabled}
          />
          {header}
        </div>
      )
    }

    if (input.type === 'SELECT') {
      return (
        <div className="user-input-group">
          {divider}
          {header}
          <CoreSelectInput
            value={valueMap[input.key] || ''}
            onChange={value => {
              updateValueMap(input, value)
            }}
            options={input.selectProps?.options}
            disabled={input.disabled}
          />
        </div>
      )
    }

    // TODO: Faiyaz - separate component
    if (input.type === 'FILE') {
      return (
        <div className="user-input-group">
          {divider}
          {header}
          <input
            type={'file'}
            accept="image/*"
            onChange={value => {
              updateValueMap(input, value)
            }}
            disabled={input.disabled}
          />
        </div>
      )
    }

    if (input.type === 'BUTTON') {
      return (
        <div className="user-input-group">
          {divider}
          {header}
          <CoreButton
            label={input.placeholder}
            size={CoreButtonSize.MEDIUM}
            type={CoreButtonType.SOLID_SECONDARY}
            onClick={input.buttonProps.onClick}
          />
        </div>
      )
    }
  })

  return (
    <div>
      <div>{mappedInputs}</div>
      <div className="user-input-group">
        <CoreButton
          label="Submit"
          size={CoreButtonSize.LARGE}
          type={CoreButtonType.SOLID_PRIMARY}
          className={classNames('w-full lg:w-auto', props.buttonClassName)}
          onClick={onSubmit}
          disabled={props.isDisabled}
          loading={props.showLoading}
        />
      </div>
    </div>
  )
}

export default FormLayout
