import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

const baseAPiUrl = 'https://jsonplaceholder.typicode.com'

const service = axios.create()

// service.interceptors.response.use(
//   function (response) {
//     return response.data
//   },
//   function (error) {
//     return Promise.reject(error)
//   },
// )

export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    config.url = baseAPiUrl + config.url
    return (await service.request(config)).data
  } catch (error: unknown) {
    return Promise.reject(error)
  }
}
