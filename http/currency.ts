import {
  ICurrencyInfo,
  ICurrencyInfoDelete,
  ICurrencyInfoUpdate,
  ICurrencyInfoUpdateParams,
} from '../contract/currency'
import { httpClient } from './httpClient'

export const getAllCurrencies = async (): Promise<ICurrencyInfo[]> => {
  const result = await httpClient.get<ICurrencyInfo[]>(`/currency/info`)
  return result
}

export const getCurrencyById = async (currencyId: number): Promise<ICurrencyInfo> => {
  const result = await httpClient.get<ICurrencyInfo>(`/currency/info/${currencyId}`)
  return result
}

export const updateCurrency = async (
  currencyId: number | null,
  params: ICurrencyInfoUpdateParams
): Promise<ICurrencyInfoUpdate> => {
  const result = await httpClient.post<ICurrencyInfoUpdate>(
    `/currency/info${currencyId ? `/${currencyId}` : ''}`,
    params
  )
  return result
}

export const deleteCurrency = async (currencyId: number): Promise<ICurrencyInfoDelete> => {
  const result = await httpClient.delete<ICurrencyInfoDelete>(`/currency/info/${currencyId}`)
  return result
}
