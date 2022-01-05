import React from 'react'
import { IGlobalLayoutProps } from './_app'
import { NextPage, GetStaticProps } from 'next'
import PageContainer from '../components/PageContainer'
import { ISectionInfo } from '../contract/section'
import CoreLink from '../components/core/CoreLink'
import {
  AnnotationIcon,
  ArchiveIcon,
  BookOpenIcon,
  ChevronRightIcon,
  CollectionIcon,
  CubeIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  FolderOpenIcon,
  GiftIcon,
  GlobeAltIcon,
  HeartIcon,
  HomeIcon,
  IdentificationIcon,
  LinkIcon,
  PresentationChartBarIcon,
  QuestionMarkCircleIcon,
  ReceiptRefundIcon,
  RssIcon,
  SearchCircleIcon,
  SearchIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  SparklesIcon,
  SpeakerphoneIcon,
  StatusOnlineIcon,
  TemplateIcon,
  ChevronDownIcon,
  ShoppingCartIcon,
  UserIcon,
  LockClosedIcon,
  ArrowsExpandIcon,
  QrcodeIcon,
  PhotographIcon,
  TruckIcon,
} from '@heroicons/react/outline'
import CoreDivider from '../components/core/CoreDivider'
import Collapsible from '../components/Collapsible'
import appConfig from '../config/appConfig'
import { getCurrencyPageUrl } from '../utils/currency'
import PrivatePageLayout from '../components/layout/PrivatePageLayout'
import { getSecurityQuestionPageUrl } from '../utils/securityQuestion'
import { getFAQPageUrl, getFAQTopicPageUrl } from '../utils/faq'
import { getSupportedRegionsPageUrl } from '../utils/supportedRegions'
import { getTnCPageUrl } from '../utils/tnc'
import { getPrivacyPolicyPageUrl } from '../utils/privacyPolicy'
import { getRefundPolicyPageUrl } from '../utils/refundPolicy'
import { getBlogPageUrl } from '../utils/blog'
import { getPageSectionsPageUrl, getSectionPageUrl } from '../utils/section'
import { PageSectionType } from '../contract/constants'
import { getCataloguePageUrl } from '../utils/catalogue'
import {
  getComboProductPageUrl,
  getIndividualProductPageUrl,
  getProductAttributeKeyPageUrl,
  getProductBrandPageUrl,
  getProductRelationsPageUrl,
} from '../utils/product'
import { getOrderStatusPageUrl, getRecentOrdersPageUrl } from '../utils/order'
import { getUserPageUrl } from '../utils/user'
import { getImagePageUrl } from '../utils/image'
import { getShippingPolicyPageUrl } from '../utils/shippingPolicy'

interface IPageLinkProps {
  label: React.ReactNode
  url: string
  icon?: React.FC
}

const PageLink: React.FC<IPageLinkProps> = props => {
  const IconComponent = props.icon || LinkIcon

  return (
    <CoreLink
      url={props.url}
      className="font-primary-medium font-medium flex items-center text-gray900 px-4 py-3 hover:bg-gray100 transition-all rounded">
      <IconComponent className="w-5 mr-2" />
      {props.label}
    </CoreLink>
  )
}

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const Home: NextPage<IProps> = props => {
  return (
    <div className="">
      <PrivatePageLayout>
        <PageLink label="Currency" url={getCurrencyPageUrl()} icon={CurrencyDollarIcon} />
        <PageLink label="Supported Regions" url={getSupportedRegionsPageUrl()} icon={GlobeAltIcon} />

        <CoreDivider className="my-2 lg:my-4" />

        {/* <PageLinkHeader title="FAQ" /> */}

        <PageLink label="FAQ" url={getFAQTopicPageUrl()} icon={QuestionMarkCircleIcon} />
        <PageLink label="Terms & Conditions" url={getTnCPageUrl()} icon={ShieldCheckIcon} />
        <PageLink label="Privacy Policy" url={getPrivacyPolicyPageUrl()} icon={DocumentTextIcon} />
        <PageLink label="Refund Policy" url={getRefundPolicyPageUrl()} icon={ReceiptRefundIcon} />
        <PageLink label="Shipping Policy" url={getShippingPolicyPageUrl()} icon={TruckIcon} />

        {/* <CoreDivider className="my-2 lg:my-4" />

        <PageLink label="Slide" url="" icon={PresentationChartBarIcon} />
        <PageLink label="Customer Feedback" url="" icon={AnnotationIcon} />
        <PageLink label="Procedure" url="" icon={IdentificationIcon} />
        <PageLink label="USP" url="" icon={SparklesIcon} /> */}

        <CoreDivider className="my-2 lg:my-4" />

        <PageLink label="Section" url={getSectionPageUrl()} icon={ArchiveIcon} />
        {/* <PageLink label="Catalogues Section" url="" icon={CollectionIcon} />
        <PageLink label="Products Section" url="" icon={GiftIcon} />
        <PageLink label="Combo Products Section" url="" icon={CubeIcon} />
        <PageLink label="Blogs Section" url="" icon={RssIcon} />
        <PageLink label="Custom Section" url="" /> */}
        <Collapsible
          trigger={
            <PageLink
              label={
                <>
                  Page Sections
                  <ChevronDownIcon className="w-5 collapsible-chevron-icon ml-1" />
                </>
              }
              url=""
              icon={BookOpenIcon}
            />
          }>
          <div className="pl-4">
            <PageLink label="Home" url={getPageSectionsPageUrl(PageSectionType.HOME)} icon={HomeIcon} />
            <PageLink label="Error" url={getPageSectionsPageUrl(PageSectionType.ERROR)} icon={ExclamationCircleIcon} />
            <PageLink label="Explore" url={getPageSectionsPageUrl(PageSectionType.EXPLORE)} icon={TemplateIcon} />
            <PageLink
              label="Individual Product"
              url={getPageSectionsPageUrl(PageSectionType.INDIVIDUAL_PRODUCT)}
              icon={GiftIcon}
            />
            <PageLink
              label="Combo Product"
              url={getPageSectionsPageUrl(PageSectionType.COMBO_PRODUCT)}
              icon={CubeIcon}
            />
            <PageLink label="Search" url={getPageSectionsPageUrl(PageSectionType.SEARCH)} icon={SearchIcon} />
          </div>
        </Collapsible>

        <CoreDivider className="my-2 lg:my-4" />

        <PageLink label="Image" url={getImagePageUrl()} icon={PhotographIcon} />

        <CoreDivider className="my-2 lg:my-4" />

        <PageLink label="Catalogue" url={getCataloguePageUrl()} icon={CollectionIcon} />
        <PageLink label="Product" url={getIndividualProductPageUrl()} icon={GiftIcon} />
        <PageLink label="Combo Product" url={getComboProductPageUrl()} icon={CubeIcon} />
        <PageLink label="Product Attribute Type" url={getProductAttributeKeyPageUrl()} icon={SpeakerphoneIcon} />
        <PageLink label="Products Relation" url={getProductRelationsPageUrl()} icon={ArrowsExpandIcon} />
        <PageLink label="Product Brand" url={getProductBrandPageUrl()} icon={QrcodeIcon} />

        <CoreDivider className="my-2 lg:my-4" />

        <PageLink label="Blog" url={getBlogPageUrl()} icon={RssIcon} />

        <CoreDivider className="my-2 lg:my-4" />

        <PageLink label="User" url={getUserPageUrl()} icon={UserIcon} />
        {/* <PageLink label="Cart" url="" icon={ShoppingCartIcon} />
        <PageLink label="Wish" url="" icon={HeartIcon} /> */}
        <PageLink label="Recent Orders" url={getRecentOrdersPageUrl()} icon={ShoppingBagIcon} />
        <PageLink label="Order Status Type" url={getOrderStatusPageUrl()} icon={StatusOnlineIcon} />

        <CoreDivider className="my-2 lg:my-4" />
        <PageLink label="Security Question" url={getSecurityQuestionPageUrl()} icon={LockClosedIcon} />
      </PrivatePageLayout>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: null,
      layoutData: {
        seo: {
          title: 'Home - CMS',
        },
        headerTitle: 'Home',
      },
    },
  }
}

export default Home
