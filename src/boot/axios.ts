import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance, AxiosError } from 'axios'
import qs from 'qs'

// @ts-expect-error
import { useStoreMain } from '@cnic/main'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
// const api = axios.create({ baseURL: 'https://api.example.com' })

// axios instance with base url configured
export const baseURLStats = window.location.protocol + '//vms.cstcloud.cn/api' // todo 改成该服务的后端api地址
// console.log(window.location.protocol)
// export const baseURLStats = window.location.protocol + '//159.226.235.4:2000/api'
// export const baseURLStats = process.env.DEV ? '//159.226.235.78:88/api' : '//159.226.235.4:2000/api'
const axiosStats = axios.create({
  baseURL: baseURLStats,
  // 序列化器，没有这个无法在query里发送数组参数。body里的数组不需要序列化器。
  // https://github.com/axios/axios/issues/604#issuecomment-321460450
  paramsSerializer: function (params) {
    return qs.stringify(params, { arrayFormat: 'comma' })
  }
})

/* 原生axios的拦截器 */
axios.interceptors.request.use(config => {
  // get jwt token from @cnic/main's store
  const store = useStoreMain()
  config.headers.common.Authorization = `Bearer ${store.items.tokenAccess as string}`

  return config
}, (error: AxiosError) => {
  console.log('axios-REQ-Rejected')
  // errorNotifier(error)
  // return error
  throw error // throw error就无法把错误传递给发送请求处
})
axios.interceptors.response.use(config => {
  return config
}, (error: AxiosError) => {
  console.log('axios-RESP-Rejected')
  // 响应里的error信息在error.response.data里面，被包成了axios error对象
  // return error
  throw error // throw error就无法把错误传递给发送请求处
})
/* 原生axios的拦截器 */

/* axiosStats的拦截器 */
axiosStats.interceptors.request.use(config => {
  // get jwt token from @cnic/main's store
  const store = useStoreMain()
  config.headers.common.Authorization = `Bearer ${store.items.tokenAccess as string}`

  return config
}, (error: AxiosError) => {
  console.log('axiosStats-REQ-Rejected')
  // errorNotifier(error)
  // return error
  throw error // throw error就无法把错误传递给发送请求处
})
axiosStats.interceptors.response.use(config => {
  return config
}, (error: AxiosError) => {
  console.log('axiosStats-RESP-Rejected')
  // errorNotifier(error)
  // 响应里的error信息在error.response.data里面，被包成了axios error对象
  // return error
  throw error // throw error就无法把错误传递给发送请求处
})
/* axiosStats的拦截器 */

export default boot((/* { app } */) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  // app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  // app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { axiosStats }
