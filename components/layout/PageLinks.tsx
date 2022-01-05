import React from 'react'
import CoreActiveLink from '../core/CoreActiveLink'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import { ChevronRightIcon } from '@heroicons/react/solid'

export interface IPageLink {
  label: string
  url: string
  icon?: React.FC
  pagePaths?: string[]
}

interface IPageLinksProps {
  links: IPageLink[]
}

const PageLinks: React.FC<IPageLinksProps> = props => {
  const { links } = props

  const router = useRouter()

  const mappedLinks = links.map((link, index) => {
    return (
      <CoreActiveLink
        key={index}
        url={link.url}
        pagePaths={link.pagePaths}
        className={classnames(
          'flex items-center w-full px-2 py-3 lg:px-3 lg:py-3 transition-all bg-white hover:bg-gray100 group rounded'
        )}
        activeClassName="bg-gray100">
        {isActive => {
          let IconComponent = null

          if (link.icon) {
            IconComponent = link.icon
          }

          return (
            <React.Fragment>
              {IconComponent ? (
                <div className="mr-2">
                  <IconComponent className="w-6" />
                </div>
              ) : null}

              <div className="flex flex-grow justify-between items-center">
                <div className="text-gray900 font-normal font-primary-medium">{link.label}</div>
                <ChevronRightIcon className="w-5 text-gray700 transform transition-transform group-hover:scale-125" />
              </div>
            </React.Fragment>
          )
        }}
      </CoreActiveLink>
    )
  })

  return <>{mappedLinks}</>
}

export default PageLinks
