import { PageSectionType, SectionType } from '../contract/constants'
import { IComboProductInfo, IIndividualProductInfo } from '../contract/product'
import {
  IBlogSectionInfo,
  ICustomerFeedbackInfo,
  ICustomSectionBody,
  ISectionInfo,
  ISectionInfoBlogs,
  ISectionInfoCatalogues,
  ISectionInfoCustom,
  ISectionInfoCustomerFeedbacks,
  ISectionInfoFullWidthSlides,
  ISectionInfoOffers,
  ISectionInfoStrictWidthSlides,
  ISectionInfoUSPs,
  ISlideInfo,
  IUSPInfo,
  SectionInfoItem,
  ICatalogueSectionInfo,
  ISectionInfoProcedures,
  IProcedureInfo,
  ISectionInfoProducts,
  IProductSectionInfo,
} from '../contract/section'

export const getSectionPageUrl = () => {
  return '/section'
}

export const getSectionUpdatePageUrl = (id?: number) => {
  return `/section/update${id ? `?id=${id}` : ''}`
}

export const getSectionItemsPageUrl = (id: number) => {
  return `/section/${id}/items`
}

export const getSectionItemsAddPageUrl = (id: number) => {
  return `/section/${id}/items/add`
}

export const getPageSectionsPageUrl = (pageType: PageSectionType) => {
  return `/section/page?pageType=${pageType}`
}

export const getPageSectionsUpdatePageUrl = (pageType: PageSectionType, id?: number) => {
  return `/section/page/update?pageType=${pageType}${id ? `&id=${id}` : ''}`
}

export const getSectionItems = (section: ISectionInfo): SectionInfoItem[] => {
  if (section.type === SectionType.PRODUCTS) {
    const sectionProducts = section as ISectionInfoProducts
    return sectionProducts.products || []
  }
  if (section.type === SectionType.CATALOGUES) {
    const sectionCatalogues = section as ISectionInfoCatalogues
    return sectionCatalogues.catalogues || []
  }
  if (section.type === SectionType.BLOGS) {
    const sectionBlogs = section as ISectionInfoBlogs
    return sectionBlogs.blogs || []
  }
  if (section.type === SectionType.FULL_WIDTH_SLIDES || section.type === SectionType.STRICT_WIDTH_SLIDES) {
    const sectionSlides = section as ISectionInfoFullWidthSlides | ISectionInfoStrictWidthSlides
    return sectionSlides.slides || []
  }
  if (section.type === SectionType.USPS) {
    const sectionUsp = section as ISectionInfoUSPs
    return sectionUsp.uspList || []
  }
  if (section.type === SectionType.CUSTOMER_FEEDBACKS) {
    const sectionCustomerFeedback = section as ISectionInfoCustomerFeedbacks
    return sectionCustomerFeedback.customerFeedbacks || []
  }
  if (section.type === SectionType.PROCEDURES) {
    const sectionProcedures = section as ISectionInfoProcedures
    return sectionProcedures.procedures || []
  }
  if (section.type === SectionType.OFFERS) {
    const sectionOffers = section as ISectionInfoOffers
    return sectionOffers.offers || []
  }
  if (section.type === SectionType.CUSTOM) {
    const sectionCustom = section as ISectionInfoCustom
    return sectionCustom.bodyList || []
  }

  return []
}

export const getSectionItemDisplayInfo = (
  sectionType: SectionType,
  sectionItem: SectionInfoItem
): { title: string; description: string; isActive: boolean | null } => {
  const result: { title: string; description: string; isActive: boolean | null } = {
    title: '',
    description: '',
    isActive: null,
  }

  switch (sectionType) {
    case SectionType.PRODUCTS: {
      const data = sectionItem as IProductSectionInfo
      const product = data.productInfo as IIndividualProductInfo | IComboProductInfo
      result.title = product.name
      result.isActive = data.isActive
      break
    }

    case SectionType.CATALOGUES: {
      const data = sectionItem as ICatalogueSectionInfo
      result.title = data.catalogueInfo.name
      result.isActive = data.isActive
      break
    }

    case SectionType.BLOGS: {
      const data = sectionItem as IBlogSectionInfo
      result.title = data.blogInfo.title
      result.isActive = data.isActive
      break
    }

    case SectionType.FULL_WIDTH_SLIDES:
    case SectionType.STRICT_WIDTH_SLIDES: {
      const data = sectionItem as ISlideInfo
      result.title = data.image.url
      result.isActive = data.isActive
      break
    }

    case SectionType.USPS: {
      const data = sectionItem as IUSPInfo
      result.title = data.name
      result.isActive = data.isActive
      break
    }

    case SectionType.CUSTOMER_FEEDBACKS: {
      const data = sectionItem as ICustomerFeedbackInfo
      result.title = data.feedback
      result.isActive = data.isActive
      break
    }

    case SectionType.PROCEDURES: {
      const data = sectionItem as IProcedureInfo
      result.title = data.title
      result.isActive = data.isActive
      break
    }

    // case SectionType.OFFERS: {
    //   break
    // }

    case SectionType.CUSTOM: {
      const data = sectionItem as ICustomSectionBody
      result.title = data.html
      result.isActive = data.isActive
      break
    }
  }

  return result
}
