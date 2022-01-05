import React, { useEffect } from 'react'
import { DesktopView, MobileView } from '../ResponsiveViews'
import { useRouter } from 'next/router'
import PageLinks, { IPageLink } from './PageLinks'
import classnames from 'classnames'
import PrivatePageLayout from './PrivatePageLayout'
import CoreLink from '../core/CoreLink'

export interface IPageSummaryInfo {
  pageUrl: string | null
  description: string
}

interface IPageLayoutProps {
  links: IPageLink[]
  summary?: IPageSummaryInfo
}

const AccountLayoutDesktop: React.FC<IPageLayoutProps> = props => {
  const { children, links } = props

  return (
    <div>
      <div className="flex">
        <div className="w-80">
          <PageLinks links={links} />
        </div>
        <div className="ml-6 page-layout-desktop-width">{children}</div>
      </div>
    </div>
  )
}

const AccountLayoutMobile: React.FC<IPageLayoutProps> = props => {
  const { children, links } = props

  return (
    <div>
      <div className="px-2 mt-4">{children}</div>
      {/* TODO: Faiyaz - add better ui */}
      <div className="mt-10 px-2">{/* <PageLinks links={links} /> */}</div>
    </div>
  )
}

const PageLayout: React.FC<IPageLayoutProps> = props => {
  return (
    <PrivatePageLayout>
      {props.summary?.pageUrl || props.summary?.description ? (
        <div className="mg-0 lg:mb-6 px-2">
          <div>{props.summary.description}</div>
          <div>
            <CoreLink url={props.summary.pageUrl} className="font-medium font-primary-medium" isExternal>
              {props.summary.pageUrl}
            </CoreLink>
          </div>
        </div>
      ) : null}

      <DesktopView>
        <AccountLayoutDesktop {...props} />
      </DesktopView>
      <MobileView>
        <AccountLayoutMobile {...props} />
      </MobileView>
    </PrivatePageLayout>
  )
}

export default PageLayout
