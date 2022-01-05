import classnames from 'classnames'
import React, { ReactNode } from 'react'
import CoreActiveLink from '../core/CoreActiveLink'

export interface IHeaderLink {
  label: string
  url: string | null
  iconComponent: React.FC<any>
  activeIconComponent: React.FC<any>
  iconClassName: string | null
  count: string | null
  onClick: (e: any) => void
}

interface IHeaderLinksProps {
  links: IHeaderLink[]
}

const HeaderLinks: React.FC<IHeaderLinksProps> = props => {
  const mappedLinks = props.links.map((navLink, index) => {
    return (
      <CoreActiveLink
        key={index}
        url={navLink.url}
        className="flex font-medium font-primary-medium text-mineShaft text-sm items-center group relative"
        title={navLink.label}
        onClick={e => {
          if (navLink.onClick) {
            navLink.onClick(e)
          }
        }}>
        {(isActive: boolean) => {
          const IconComponent = isActive ? navLink.activeIconComponent : navLink.iconComponent

          return (
            <React.Fragment>
              <IconComponent
                className={classnames(
                  'w-6 ml-3 lg:ml-5 transform transition-transform group-hover:scale-110',
                  navLink.iconClassName
                )}
              />
              <span className="">{navLink.label}</span>
            </React.Fragment>
          )
        }}
      </CoreActiveLink>
    )
  })

  return <>{mappedLinks}</>
}

export default HeaderLinks
