import { type UserApi as User, type CommentApi as Comment } from '@/api/types'

export { Comment, User }

export interface Post {
  id: number
  user: User
  title: string
  body: string
}
