import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/outline'
import React, { useContext } from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import { updateUrlParam } from '../../utils/common'
import CoreLink from '../core/CoreLink'

interface ILayoutPaginationProps {}

const LayoutPagination: React.FC<ILayoutPaginationProps> = props => {
  const router = useRouter()

  const currentPage = Number(router.query.page || 1)

  const visiblePages = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2].filter(
    l => l > 0
  )

  const getPageUrl = (page: number) => {
    if (page >= 1) {
      const url = updateUrlParam(router.asPath, 'page', `${page}`)
      return url
    }
    return undefined
  }

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <div className="inline-flex items-center justify-center rounded-md border border-gray300 ">
        {currentPage > 1 ? (
          <CoreLink url={getPageUrl(1)} className="p-3 cursor-pointer transition-all hover:scale-105 hover:bg-gray100">
            <ChevronDoubleLeftIcon className="w-6" />
          </CoreLink>
        ) : null}
        <CoreLink
          url={getPageUrl(currentPage - 1)}
          className="p-3 cursor-pointer transition-all hover:scale-105 hover:bg-gray100">
          <ChevronLeftIcon className="w-6" />
        </CoreLink>
        {visiblePages.map(visiblePage => (
          <CoreLink
            url={getPageUrl(visiblePage)}
            key={visiblePage}
            className={classnames('py-3 px-4 cursor-pointer transition-all hover:bg-gray100', {
              'font-medium font-primary-medium': visiblePage === currentPage,
            })}>
            {visiblePage}
          </CoreLink>
        ))}
        <CoreLink
          url={getPageUrl(currentPage + 1)}
          className="p-3 cursor-pointer transition-all hover:scale-105 hover:bg-gray100">
          <ChevronRightIcon className="w-6" />
        </CoreLink>
      </div>
    </div>
  )
}

export default LayoutPagination
