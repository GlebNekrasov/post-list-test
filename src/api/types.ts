export interface PostApi {
  id: number
  userId: number
  title: string
  body: string
}

export interface UserApi {
  id: number
  name: string
  username: string
  email: string
  address: AddressApi
  phone: string
  website: string
  company: CompanyApi
}

export interface CommentApi {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

export interface CommentCreateDataApi {
  postId: number
  name: string
  email: string
  body: string
}

export interface PostSearchParamsApi {
  userId?: number
  title?: string
  body?: string
}

export interface AddressApi {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: {
    lat: string
    lng: string
  }
}

export interface CompanyApi {
  name: string
  catchPhrase: string
  bs: string
}
