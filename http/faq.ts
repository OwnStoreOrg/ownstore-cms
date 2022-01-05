import {
  IFAQInfo,
  IFAQInfoDelete,
  IFAQInfoUpdate,
  IFAQInfoUpdateParams,
  IFAQTopicInfo,
  IFAQTopicInfoDelete,
  IFAQTopicInfoUpdate,
  IFAQTopicInfoUpdateParams,
} from '../contract/faq'
import { httpClient } from './httpClient'

export const getAllFAQTopics = async (): Promise<IFAQTopicInfo[]> => {
  const result = await httpClient.get<IFAQTopicInfo[]>(`/faq/topic/info`)
  return result
}

export const getFAQTopicById = async (topicId: number): Promise<IFAQTopicInfo> => {
  const result = await httpClient.get<IFAQTopicInfo>(`/faq/topic/info/${topicId}`)
  return result
}

export const updateFAQTopic = async (
  topicId: number | null,
  params: IFAQTopicInfoUpdateParams
): Promise<IFAQTopicInfoUpdate> => {
  const result = await httpClient.post<IFAQTopicInfoUpdate>(`/faq/topic/info${topicId ? `/${topicId}` : ''}`, params)
  return result
}

export const deleteFAQTopic = async (topicId: number): Promise<IFAQTopicInfoDelete> => {
  const result = await httpClient.delete<IFAQTopicInfoDelete>(`/faq/topic/info/${topicId}`)
  return result
}

export const getFAQsByTopicId = async (topicId: number): Promise<IFAQInfo[]> => {
  const result = await httpClient.get<IFAQInfo[]>(`/faq/topic/${topicId}/info`)
  return result
}

export const getFAQById = async (faqId: number): Promise<IFAQInfo> => {
  const result = await httpClient.get<IFAQInfo>(`/faq/info/${faqId}`)
  return result
}

export const updateFAQ = async (faqId: number | null, params: IFAQInfoUpdateParams): Promise<IFAQInfoUpdate> => {
  const result = await httpClient.post<IFAQInfoUpdate>(`/faq/info${faqId ? `/${faqId}` : ''}`, params)
  return result
}

export const deleteFAQ = async (faqId: number): Promise<IFAQInfoDelete> => {
  const result = await httpClient.delete<IFAQInfoDelete>(`/faq/info/${faqId}`)
  return result
}
