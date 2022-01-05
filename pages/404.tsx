import React, { useContext } from 'react'
import { IGlobalLayoutProps } from './_app'
import { GetStaticProps, NextPage } from 'next'
import ApplicationContext from '../components/ApplicationContext'
import PageContainer from '../components/PageContainer'
import CoreImage, { ImageSourceType } from '../components/core/CoreImage'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../components/core/CoreButton'
import { getHomePageUrl } from '../utils/home'
import { ISectionInfo } from '../contract/section'
import { prepareImageUrl } from '../utils/image'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const NotFoundPage: NextPage<IProps> = props => {
  const { pageData } = props

  const applicationContext = useContext(ApplicationContext)
  const {
    device: { isMobile },
  } = applicationContext

  return (
    <div>
      <PageContainer>
        <div className="flex flex-col items-center justify-center mt-20">
          <CoreImage
            url={prepareImageUrl('/images/empty/empty-glass.svg', ImageSourceType.ASSET)}
            alt="Page not found"
            className="w-52 lg:w-60"
          />
          <div className="text-center text-lg lg:text-xl mt-5 w-[320px] md:w-auto">{`We couldn't find the page you were looking for.`}</div>
          <div className="text-center mt-2 lg:mt-3"></div>
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: null,
      layoutData: {
        headerTitle: 'Not Found',
        seo: {
          title: 'Page not found',
        },
      },
    },
  }
}

export default NotFoundPage
