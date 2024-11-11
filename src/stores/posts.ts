import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Post, User } from './types'
import type { PostApi, PostSearchParamsApi, CommentCreateDataApi } from '@/api/types'
import {
  getCommentsApi,
  getPostsApi,
  getPostApi,
  getUsersApi,
  getUserApi,
  postCommentApi,
} from '@/api'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref<Post[]>([])
  const users = ref<User[]>([])
  const selectedUserId = ref<number | undefined>()
  const isLoading = ref(false)

  async function updatePosts(params?: PostSearchParamsApi) {
    try {
      isLoading.value = true
      const postsApi = await getPostsApi(params)
      if (!users.value.length) {
        await updateUsers()
      }

      posts.value = []
      postsApi.forEach(async (item) => {
        const postUser = getUserData(item.userId)

        if (postUser) {
          const post = postMapper(item, postUser)
          posts.value.push(post)
        }
      })
    } catch {
      return
    } finally {
      isLoading.value = false
    }
  }

  async function updateUsers() {
    users.value = await getUsersApi()
  }

  async function getComments(postId: number) {
    const commentsFromApi = await getCommentsApi(postId)
    return commentsFromApi
  }

  async function addComment(data: CommentCreateDataApi) {
    const newComment = await postCommentApi(data)
    return newComment
  }

  async function getPost(id: number): Promise<Post> {
    let post = posts.value.find((post) => post.id === id)

    if (post) {
      return post
    }

    const postFromApi = await getPostApi(id)
    const postUser = await getUser(postFromApi.userId)
    post = postMapper(postFromApi, postUser)
    return post
  }

  function getUserData(id: number): User | undefined {
    return users.value.find((user) => user.id === id)
  }

  async function getUser(userId: number): Promise<User> {
    let user = users.value.find((user) => user.id === userId)

    if (!user) {
      user = await getUserApi(userId)
    }

    return user
  }

  function postMapper(postApi: PostApi, user: User): Post {
    return {
      id: postApi.id,
      body: postApi.body,
      title: postApi.title,
      user: user,
    }
  }

  return {
    isLoading,
    posts,
    selectedUserId,
    users,
    addComment,
    getComments,
    getPost,
    updatePosts,
    updateUsers,
  }
})
