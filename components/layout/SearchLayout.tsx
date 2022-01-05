import { XCircleIcon, XIcon } from '@heroicons/react/solid'
import classNames from 'classnames'
import React, { useState } from 'react'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import CoreTextInput, { CoreTextInputType } from '../core/CoreInput'
import { toastError } from '../Toaster'
import IndexViewLayout, { IIndexViewItem } from './IndexViewLayout'

export enum SearchType {
  NAME = 'name',
  ID = 'id',
}

interface ISearchLayoutProps {
  getIndexList(searchType: SearchType, value: string): Promise<IIndexViewItem[]>
}

const SearchLayout: React.FC<ISearchLayoutProps> = props => {
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [list, setList] = useState<IIndexViewItem[]>([])

  const onSubmit = () => {
    const searchType = !!name ? SearchType.NAME : SearchType.ID
    const searchValue = name || id

    if (!searchValue?.trim()) {
      toastError('Invalid search value')
      return
    }

    props.getIndexList(searchType, searchValue).then(resp => {
      setList(resp)
    })
  }

  const reset = () => {
    setId('')
    setName('')
    setList([])
  }

  return (
    <div>
      <div className="flex">
        <div className="flex flex-grow">
          <CoreTextInput
            type={CoreTextInputType.NUMBER}
            placeholder="Search By ID"
            value={id}
            setValue={val => {
              setName('')
              setId(val)
            }}
            autoComplete="off"
            autoFocus
            inputClassName={classNames('user-input')}
          />
          <CoreTextInput
            type={CoreTextInputType.TEXT}
            placeholder="Search By Name"
            value={name}
            setValue={val => {
              setName(val)
              setId('')
            }}
            autoComplete="off"
            showClearIcon
            onClearClick={() => setName('')}
            className="flex-grow ml-1"
            inputClassName={classNames('user-input ')}
          />
        </div>
        <CoreButton
          label="Search"
          size={CoreButtonSize.MEDIUM}
          type={CoreButtonType.SOLID_PRIMARY}
          className="ml-2"
          onClick={onSubmit}
        />
      </div>

      {list.length ? (
        <div className="flex justify-between mt-4">
          <div>
            Showing {list.length} result{list.length > 1 ? 's' : ''}
          </div>

          <span
            className="flex items-center font-medium font-primary-medium cursor-pointer hover:underline"
            onClick={reset}>
            <XCircleIcon className="w-5 mr-[2px]" />
            Clear Search
          </span>
        </div>
      ) : null}

      <div className="mt-4">
        <IndexViewLayout items={list} />
      </div>
    </div>
  )
}

export default SearchLayout
