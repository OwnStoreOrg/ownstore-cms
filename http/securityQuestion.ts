import {
  ISecurityQuestionInfo,
  IISecurityQuestionInfoUpdateParams,
  IISecurityQuestionInfoUpdate,
  IISecurityQuestionInfoDelete,
} from '../contract/security'
import { httpClient } from './httpClient'

export const getAllSecurityQuestions = async (): Promise<ISecurityQuestionInfo[]> => {
  const result = await httpClient.get<ISecurityQuestionInfo[]>(`/security/security-question/info`)
  return result
}

export const getSecurityQuestionById = async (questionId: number): Promise<ISecurityQuestionInfo> => {
  const result = await httpClient.get<ISecurityQuestionInfo>(`/security/security-question/info/${questionId}`)
  return result
}

export const updateSecurityQuestion = async (
  questionId: number | null,
  params: IISecurityQuestionInfoUpdateParams
): Promise<IISecurityQuestionInfoUpdate> => {
  const result = await httpClient.post<IISecurityQuestionInfoUpdate>(
    `/security/security-question/info${questionId ? `/${questionId}` : ''}`,
    params
  )
  return result
}

export const deleteSecurityQuestion = async (questionId: number): Promise<IISecurityQuestionInfoDelete> => {
  const result = await httpClient.delete<IISecurityQuestionInfoDelete>(`/security/security-question/info/${questionId}`)
  return result
}
