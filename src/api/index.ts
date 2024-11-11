import { request } from './request'
import type {
  CommentApi,
  CommentCreateDataApi,
  PostApi,
  PostSearchParamsApi,
  UserApi,
} from './types'

export function getPostsApi(params?: PostSearchParamsApi) {
  return request<PostApi[]>({
    url: '/posts',
    method: 'get',
    params,
  })
}

export function getPostApi(id: number) {
  return request<PostApi>({
    url: `/posts/${id}`,
    method: 'get',
  })
}

export function getCommentsApi(id: number) {
  return request<CommentApi[]>({
    url: `/posts/${id}/comments`,
    method: 'get',
  })
}

export function postCommentApi(data: CommentCreateDataApi) {
  return request<CommentApi>({
    url: `/comments`,
    method: 'post',
    data,
  })
}

export function getUsersApi() {
  return request<UserApi[]>({
    url: `/users`,
    method: 'get',
  })
}

export function getUserApi(id: number) {
  return request<UserApi>({
    url: `/users/${id}`,
    method: 'get',
  })
}
