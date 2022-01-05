import { PencilIcon, TrashIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import React from 'react'
import CoreLink from '../core/CoreLink'
import EscapeHTML from '../EscapeHTML'
import PageLoader from '../loader/PageLoader'
import NoContent from '../NoContent'
import classnames from 'classnames'
import { StopIcon } from '@heroicons/react/solid'

interface IIndexViewLayoutHeaderProps {
  title: React.ReactNode
}

export const IndexViewLayoutHeader: React.FC<IIndexViewLayoutHeaderProps> = props => {
  return <div className="font-primary-medium font-medium text-primaryTextBold py-4">{props.title}</div>
}

export interface IIndexViewItem {
  id: number
  label: React.ReactNode
  description?: React.ReactNode
  isInactive?: boolean
  editUrl?: string
  viewUrl?: string
}

interface IIndexViewLayoutProps {
  items: IIndexViewItem[]
  showNotFound?: boolean
  showLoader?: boolean
  onClick?: (e: any, item: IIndexViewItem) => void
}

const IndexViewLayout: React.FC<IIndexViewLayoutProps> = props => {
  const { items, showNotFound = true, showLoader = false, onClick } = props

  const router = useRouter()

  if (showLoader) {
    return <PageLoader message="Loading detail..." />
  }

  if (!items.length && showNotFound) {
    return <NoContent message="Nothing to show." />
  }

  const mappedItems = items.map((item, index) => {
    return (
      <CoreLink
        url={item.viewUrl}
        className={classnames(
          'w-full px-3 py-4 transition-all cursor-pointer relative flex border-b border-gray400 hover:text-inherit hover:shadow',
          item.isInactive ? 'bg-gray200' : 'bg-white'
        )}
        onClick={e => {
          if (onClick) {
            onClick(e, item)
          }
        }}>
        <div className="flex flex-grow mr-1">
          <div className="font-medium font-primary-medium mr-2 text-lightprimary">#{item.id}</div>
          <div>
            <div className="font-primary-medium font-medium">{item.label}</div>
            {item.description ? <div className="text-sm">{item.description}</div> : null}
            {/* {item.isInactive ? (
              <span className="flex items-center relative -left-1 mt-1">
                <StopIcon className="w-5 mr-1" />
                <span>Inactive</span>
              </span>
            ) : null} */}
          </div>
        </div>
        {item.editUrl ? (
          <div className="flex">
            <CoreLink
              url={item.editUrl}
              className="bg-white p-2 rounded-full border border-gray400 cursor-pointer group h-[34px]"
              title="Edit">
              <PencilIcon className="w-4 group-hover:text-primaryTextBold" />
            </CoreLink>
          </div>
        ) : null}
      </CoreLink>
    )
  })

  return <>{mappedItems}</>
}

export default IndexViewLayout
