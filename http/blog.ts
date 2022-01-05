import { IBlogInfo, IBlogInfoDelete, IBlogInfoUpdate, IBlogInfoUpdateParams } from '../contract/blog'
import { IFindParams } from '../contract/common'
import { httpClient } from './httpClient'

export const getAllBlogs = async (params: IFindParams): Promise<IBlogInfo[]> => {
  const result = await httpClient.get<IBlogInfo[]>(`/blog/info`, params)
  return result
}

export const getBlogById = async (blogId: number): Promise<IBlogInfo> => {
  const result = await httpClient.get<IBlogInfo>(`/blog/info/${blogId}`)
  return result
}

export const updateBlog = async (blogId: number | null, params: IBlogInfoUpdateParams): Promise<IBlogInfoUpdate> => {
  const result = await httpClient.post<IBlogInfoUpdate>(`/blog/info${blogId ? `/${blogId}` : ''}`, params)
  return result
}

export const deleteBlog = async (blogId: number): Promise<IBlogInfoDelete> => {
  const result = await httpClient.delete<IBlogInfoDelete>(`/blog/info/${blogId}`)
  return result
}

export const searchBlogByName = async (query: string, params: IFindParams): Promise<IBlogInfo[]> => {
  const result = await httpClient.get<IBlogInfo[]>(`/blog/info/search/${query}`, params)
  return result
}
