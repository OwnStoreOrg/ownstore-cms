import { PageSectionType } from '../contract/constants'
import {
  IBlogSectionInfoDelete,
  IBlogSectionInfoUpdate,
  IBlogSectionInfoUpdateParams,
  ICatalogueSectionInfoDelete,
  ICatalogueSectionInfoUpdate,
  ICatalogueSectionInfoUpdateParams,
  ICustomerFeedbackInfoDelete,
  ICustomerFeedbackInfoUpdate,
  ICustomerFeedbackInfoUpdateParams,
  ICustomSectionBodyDelete,
  ICustomSectionBodyUpdate,
  ICustomSectionBodyUpdateParams,
  IPageSectionInfoDelete,
  IPageSectionInfoUpdate,
  IPageSectionInfoUpdateParams,
  IProcedureInfoDelete,
  IProcedureInfoUpdate,
  IProcedureInfoUpdateParams,
  IProductSectionInfoDelete,
  IProductSectionInfoUpdate,
  IProductSectionInfoUpdateParams,
  ISectionInfo,
  ISectionInfoDelete,
  ISectionInfoUpdate,
  ISectionInfoUpdateParams,
  ISlideInfoDelete,
  ISlideInfoUpdate,
  ISlideInfoUpdateParams,
  IUSPInfoDelete,
  IUSPInfoUpdate,
  IUSPInfoUpdateParams,
} from '../contract/section'
import { httpClient } from './httpClient'

export const getAllSections = async (): Promise<ISectionInfo[]> => {
  const result = await httpClient.get<ISectionInfo[]>(`/section/info`)
  return result
}

export const getSectionById = async (sectionId: number): Promise<ISectionInfo> => {
  const result = await httpClient.get<ISectionInfo>(`/section/info/${sectionId}`)
  return result
}

export const updateSection = async (
  sectionId: number | null,
  params: ISectionInfoUpdateParams
): Promise<ISectionInfoUpdate> => {
  const result = await httpClient.post<ISectionInfoUpdate>(`/section/info${sectionId ? `/${sectionId}` : ''}`, params)
  return result
}

export const deleteSection = async (sectionId: number): Promise<ISectionInfoDelete> => {
  const result = await httpClient.delete<ISectionInfoDelete>(`/section/info/${sectionId}`)
  return result
}

export const updateProductSection = async (
  sectionId: number,
  productSectionId: number | null,
  params: IProductSectionInfoUpdateParams
): Promise<IProductSectionInfoUpdate> => {
  const result = await httpClient.post<IProductSectionInfoUpdate>(
    `/section/info/${sectionId}/product/info${productSectionId ? `/${productSectionId}` : ''}`,
    params
  )
  return result
}

export const deleteProductSection = async (
  sectionId: number,
  productSectionId: number
): Promise<IProductSectionInfoDelete> => {
  const result = await httpClient.delete<IProductSectionInfoDelete>(
    `/section/info/${sectionId}/product/info/${productSectionId}`
  )
  return result
}

export const updateCatalogueSection = async (
  sectionId: number,
  catalogueSectionId: number | null,
  params: ICatalogueSectionInfoUpdateParams
): Promise<ICatalogueSectionInfoUpdate> => {
  const result = await httpClient.post<ICatalogueSectionInfoUpdate>(
    `/section/info/${sectionId}/catalogue/info${catalogueSectionId ? `/${catalogueSectionId}` : ''}`,
    params
  )
  return result
}

export const deleteCatalogueSection = async (
  sectionId: number,
  catalogueSectionId: number
): Promise<ICatalogueSectionInfoDelete> => {
  const result = await httpClient.delete<ICatalogueSectionInfoDelete>(
    `/section/info/${sectionId}/catalogue/info/${catalogueSectionId}`
  )
  return result
}

export const updateBlogSection = async (
  sectionId: number,
  blogSectionId: number | null,
  params: IBlogSectionInfoUpdateParams
): Promise<IBlogSectionInfoUpdate> => {
  const result = await httpClient.post<IBlogSectionInfoUpdate>(
    `/section/info/${sectionId}/blog/info${blogSectionId ? `/${blogSectionId}` : ''}`,
    params
  )
  return result
}

export const deleteBlogSection = async (sectionId: number, blogSectionId: number): Promise<IBlogSectionInfoDelete> => {
  const result = await httpClient.delete<IBlogSectionInfoDelete>(
    `/section/info/${sectionId}/blog/info/${blogSectionId}`
  )
  return result
}

export const updateSlide = async (
  sectionId: number,
  slideId: number | null,
  params: ISlideInfoUpdateParams
): Promise<ISlideInfoUpdate> => {
  const result = await httpClient.post<ISlideInfoUpdate>(
    `/section/info/${sectionId}/slide/info${slideId ? `/${slideId}` : ''}`,
    params
  )
  return result
}

export const deleteSlide = async (sectionId: number, slideId: number): Promise<ISlideInfoDelete> => {
  const result = await httpClient.delete<ISlideInfoDelete>(`/section/info/${sectionId}/slide/info/${slideId}`)
  return result
}

export const updateUSP = async (
  sectionId: number,
  uspId: number | null,
  params: IUSPInfoUpdateParams
): Promise<IUSPInfoUpdate> => {
  const result = await httpClient.post<IUSPInfoUpdate>(
    `/section/info/${sectionId}/usp/info${uspId ? `/${uspId}` : ''}`,
    params
  )
  return result
}

export const deleteUSP = async (sectionId: number, uspId: number): Promise<IUSPInfoDelete> => {
  const result = await httpClient.delete<ISlideInfoDelete>(`/section/info/${sectionId}/usp/info/${uspId}`)
  return result
}

export const updateProcedure = async (
  sectionId: number,
  procedureId: number | null,
  params: IProcedureInfoUpdateParams
): Promise<IProcedureInfoUpdate> => {
  const result = await httpClient.post<IProcedureInfoUpdate>(
    `/section/info/${sectionId}/procedure/info${procedureId ? `/${procedureId}` : ''}`,
    params
  )
  return result
}

export const deleteProcedure = async (sectionId: number, procedureId: number): Promise<IProcedureInfoDelete> => {
  const result = await httpClient.delete<ISlideInfoDelete>(`/section/info/${sectionId}/procedure/info/${procedureId}`)
  return result
}

export const updateCustomerFeedback = async (
  sectionId: number,
  feedbackId: number | null,
  params: ICustomerFeedbackInfoUpdateParams
): Promise<ICustomerFeedbackInfoUpdate> => {
  const result = await httpClient.post<ICustomerFeedbackInfoUpdate>(
    `/section/info/${sectionId}/customer-feedback/info${feedbackId ? `/${feedbackId}` : ''}`,
    params
  )
  return result
}

export const deleteCustomerFeedback = async (
  sectionId: number,
  feedbackId: number
): Promise<ICustomerFeedbackInfoDelete> => {
  const result = await httpClient.delete<ICustomerFeedbackInfoDelete>(
    `/section/info/${sectionId}/customer-feedback/info/${feedbackId}`
  )
  return result
}

export const updateCustomSection = async (
  sectionId: number,
  customSectionId: number | null,
  params: ICustomSectionBodyUpdateParams
): Promise<ICustomSectionBodyUpdate> => {
  const result = await httpClient.post<ICustomSectionBodyUpdate>(
    `/section/info/${sectionId}/custom-section/info${customSectionId ? `/${customSectionId}` : ''}`,
    params
  )
  return result
}

export const deleteCustomSection = async (
  sectionId: number,
  customSectionId: number
): Promise<ICustomSectionBodyDelete> => {
  const result = await httpClient.delete<ICustomSectionBodyDelete>(
    `/section/info/${sectionId}/custom-section/info/${customSectionId}`
  )
  return result
}

export const getAllPageSections = async (pageType: PageSectionType): Promise<ISectionInfo[]> => {
  const result = await httpClient.get<ISectionInfo[]>(`/section/page/${pageType}/info`)
  return result
}

export const getPageSectionById = async (pageSectionId: number, pageType: PageSectionType): Promise<ISectionInfo> => {
  const result = await httpClient.get<ISectionInfo>(`/section/page/${pageType}/info/${pageSectionId}`)
  return result
}

export const updatePageSection = async (
  pageSectionId: number | null,
  pageType: PageSectionType,
  params: IPageSectionInfoUpdateParams
): Promise<IPageSectionInfoUpdate> => {
  const result = await httpClient.post<ISectionInfoUpdate>(
    `/section/page/${pageType}/info${pageSectionId ? `/${pageSectionId}` : ''}`,
    params
  )
  return result
}

export const deletePageSection = async (
  sectionId: number,
  pageType: PageSectionType
): Promise<IPageSectionInfoDelete> => {
  const result = await httpClient.delete<IPageSectionInfoDelete>(`/section/page/${pageType}/info/${sectionId}`)
  return result
}
