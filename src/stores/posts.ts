import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Comment, Post, User } from './types'
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
  const selectedPost = ref<Post | null>(null)
  const selectedPostComments = ref<Comment[]>([])

  const isLoading = ref(false)

  async function updatePosts(params?: PostSearchParamsApi): Promise<boolean> {
    try {
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

      return true
    } catch {
      posts.value = []
      return false
    }
  }

  async function updateUsers() {
    users.value = await getUsersApi()
  }

  async function updateSelectedPostComments(): Promise<boolean> {
    if (!selectedPost.value) {
      selectedPostComments.value = []
      return false
    }

    const postId = selectedPost.value.id

    try {
      selectedPostComments.value = await getComments(postId)
      return true
    } catch {
      return false
    }
  }

  async function getComments(postId: number) {
    const commentsFromApi = await getCommentsApi(postId)
    return commentsFromApi
  }

  async function addComment(data: CommentCreateDataApi): Promise<Comment | null> {
    try {
      const newComment = await postCommentApi(data)
      return newComment
    } catch {
      return null
    }
  }

  async function getPost(id: number): Promise<Post | null> {
    try {
      const postFromApi = await getPostApi(id)
      const postUser = await getUser(postFromApi.userId)
      const post = postMapper(postFromApi, postUser)
      return post
    } catch {
      return null
    }
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
    selectedPost,
    selectedPostComments,
    selectedUserId,
    users,
    addComment,
    getComments,
    getPost,
    updatePosts,
    updateSelectedPostComments,
    updateUsers,
  }
})
