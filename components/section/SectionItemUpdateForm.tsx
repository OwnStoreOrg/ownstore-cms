import { useRouter } from 'next/router'
import React from 'react'
import { SectionType } from '../../contract/constants'
import {
  IBlogSectionInfo,
  ICatalogueSectionInfo,
  ICustomerFeedbackInfo,
  ICustomSectionBody,
  IProcedureInfo,
  IProductSectionInfo,
  ISectionInfo,
  ISlideInfo,
  IUSPInfo,
  SectionInfoItem,
} from '../../contract/section'
import { getSectionItemsPageUrl } from '../../utils/section'
import SectionItemUpdateFormBlog from './SectionItemUpdateFormBlog'
import SectionItemUpdateFormCatalogue from './SectionItemUpdateFormCatalogue'
import SectionItemUpdateFormCustomerFeedback from './SectionItemUpdateFormCustomerFeedback'
import SectionItemUpdateFormCustomSection from './SectionItemUpdateFormCustomSection'
import SectionItemUpdateFormProcedure from './SectionItemUpdateFormProcedure'
import SectionItemUpdateFormProduct from './SectionItemUpdateFormProduct'
import SectionItemUpdateFormSlide from './SectionItemUpdateFormSlide'
import SectionItemUpdateFormUSP from './SectionItemUpdateFormUSP'

export enum SectionItemUpdateFormLayoutType {
  PAGE = 'PAGE',
  MODAL = 'MODAL',
}

export interface ISectionItemUpdateFormProps {
  layout: SectionItemUpdateFormLayoutType
  section: ISectionInfo
  sectionItem: SectionInfoItem | null
}

const SectionItemUpdateForm: React.FC<ISectionItemUpdateFormProps> = props => {
  const { sectionItem, section, layout } = props

  const router = useRouter()

  const onSuccess = () => {
    if (layout === SectionItemUpdateFormLayoutType.MODAL) {
      router.reload()
    } else {
      router.push(getSectionItemsPageUrl(section.id))
    }
  }

  const renderForm = () => {
    if (section.type === SectionType.PRODUCTS) {
      return (
        <SectionItemUpdateFormProduct
          section={section}
          productSection={sectionItem as IProductSectionInfo}
          onSuccess={onSuccess}
          layout={layout}
        />
      )
    }

    if (section.type === SectionType.CATALOGUES) {
      return (
        <SectionItemUpdateFormCatalogue
          section={section}
          catalogue={sectionItem as ICatalogueSectionInfo}
          onSuccess={onSuccess}
          layout={layout}
        />
      )
    }

    if (section.type === SectionType.BLOGS) {
      return (
        <SectionItemUpdateFormBlog
          section={section}
          blog={sectionItem as IBlogSectionInfo}
          onSuccess={onSuccess}
          layout={layout}
        />
      )
    }

    if (section.type === SectionType.FULL_WIDTH_SLIDES || section.type === SectionType.STRICT_WIDTH_SLIDES) {
      return (
        <SectionItemUpdateFormSlide
          section={section}
          slide={sectionItem as ISlideInfo}
          onSuccess={onSuccess}
          layout={layout}
        />
      )
    }

    if (section.type === SectionType.USPS) {
      return (
        <SectionItemUpdateFormUSP
          section={section}
          usp={sectionItem as IUSPInfo}
          onSuccess={onSuccess}
          layout={layout}
        />
      )
    }

    if (section.type === SectionType.PROCEDURES) {
      return (
        <SectionItemUpdateFormProcedure
          section={section}
          procedure={sectionItem as IProcedureInfo}
          onSuccess={onSuccess}
          layout={layout}
        />
      )
    }

    if (section.type === SectionType.CUSTOMER_FEEDBACKS) {
      return (
        <SectionItemUpdateFormCustomerFeedback
          section={section}
          customerFeedback={sectionItem as ICustomerFeedbackInfo}
          onSuccess={onSuccess}
          layout={layout}
        />
      )
    }

    if (section.type === SectionType.CUSTOM) {
      return (
        <SectionItemUpdateFormCustomSection
          section={section}
          customSection={sectionItem as ICustomSectionBody}
          onSuccess={onSuccess}
          layout={layout}
        />
      )
    }

    return null
  }

  return <div className="px-3">{renderForm()}</div>
}

export default SectionItemUpdateForm
