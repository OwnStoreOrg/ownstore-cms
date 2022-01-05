import React, { useEffect, useState } from 'react'
import 'styles/styles.scss'
import { NextPage } from 'next'
import ApplicationContext from '../components/ApplicationContext'
import { Router, useRouter } from 'next/router'
import appConfig from '../config/appConfig'
import useApplicationContext from '../hooks/useApplicationContext'
import classnames from 'classnames'
import Toaster, { toastSuccess } from '../components/Toaster'
import ErrorBoundary from '../components/error/ErrorBoundary'
import nProgress from 'nprogress'
import { DesktopView, MobileView } from '../components/ResponsiveViews'
import Header from '../components/header/Header'
import { getHomePageUrl } from '../utils/home'
import Snackbar from '../components/header/Snackbar'
import PageContainer from '../components/PageContainer'
import BackTitle from '../components/BackTitle'
import Head from 'next/head'
import { getLoginPageUrl } from '../utils/login'

declare let window: any

export interface IPageLayoutData {
  seo: {
    title: string
  }
  headerTitle: string
}

export interface IGlobalLayoutProps {
  pageData: any
  layoutData: IPageLayoutData
}

interface IProps {
  Component: NextPage<IGlobalLayoutProps>
  pageProps: IGlobalLayoutProps
}

Router.events.on('routeChangeStart', () => {
  nProgress.start()
})

Router.events.on('routeChangeComplete', () => {
  nProgress.done()
})

Router.events.on('routeChangeError', () => {
  nProgress.done()
})

const MyApp: NextPage<IProps> = props => {
  const { Component, pageProps } = props
  const { layoutData } = pageProps || {}

  const { seo, headerTitle } = layoutData || {}
  const { title } = seo || {}

  const { applicationContext, dispatchApplicationContext } = useApplicationContext()
  const router = useRouter()

  useEffect(() => {
    window.APP.logout = applicationContext.logout
  }, [])

  // useEffect(() => {}, [])

  const isHomePage = router.pathname === getHomePageUrl()
  const isLoginPage = router.pathname === getLoginPageUrl()

  return (
    <ApplicationContext.Provider value={applicationContext}>
      <Head>
        <title>{title}</title>
        <meta key="robots" name="robots" content={'noindex, nofollow'} />
        <meta key="googlebot" name="googlebot" content={`noindex, nofollow`} />
      </Head>

      <DesktopView useCSS>
        <Header />
      </DesktopView>

      <MobileView useCSS>
        {!applicationContext.isLoggedIn || isHomePage || isLoginPage ? <Header /> : <Snackbar title={headerTitle} />}
      </MobileView>

      <main id={classnames('pageMain')} className="pb-10 mt-2 lg:mt-4">
        <ErrorBoundary key={router.route}>
          <PageContainer>
            {applicationContext.isLoggedIn ? (
              <DesktopView useCSS>{isLoginPage || isHomePage ? null : <BackTitle title={headerTitle} />}</DesktopView>
            ) : null}
            <Component {...pageProps} key={router.route} />
          </PageContainer>
        </ErrorBoundary>
      </main>

      <Toaster />
    </ApplicationContext.Provider>
  )
}

export default MyApp
