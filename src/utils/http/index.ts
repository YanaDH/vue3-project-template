import axios from 'axios'
import router from '@/router'
import { userStoreHook } from '@/store/modules/user'
import { removeUser } from '@/utils/auth'

const userStore = userStoreHook()

enum Msgs {
  '操作成功' = 200,
  '无权操作' = 401,
  '系统内部错误' = 500
}

// 避免多个接口401弹出多个弹框
let isRefreshing = false

const { DEV, VITE_PROXY_DOMAIN, VITE_PROXY_DOMAIN_REAL } = import.meta.env
// 创建http实例
const instance = axios.create({
  baseURL: DEV ? VITE_PROXY_DOMAIN : VITE_PROXY_DOMAIN_REAL,
  timeout: 2000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 添加请求拦截器
instance.interceptors.request.use((config) => {
  config.headers = config.headers || {}
  const token = userStore.token
  if (token) {
    config.headers['User-Token'] = token
  }
  return config
})

// 添加响应拦截器
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const res = err.response
    const code: number = res.status
    if (res.config.dontShowToast) {
      return Promise.reject(res)
    }
    if (code === 401) {
      if (isRefreshing) {
        return Promise.reject(res)
      }
      isRefreshing = true
      removeUser()
      // Dialog.alert({
      //   title: Msgs[code],
      //   message: '您暂无操作权限，请登录'
      // })
      //   .then(() => {
      router.push('/login')
      // })
      // .finally(() => (isRefreshing = false))
      return Promise.reject(res)
    }
    // errorNotify(Msgs[code] || '请求失败')
    return Promise.reject(res)
  }
)

const http = {
  get: (url = '', params = {}) => instance.get(url, { params }),
  post: (url = '', data = {}, config = {}) => instance.post(url, data, config),
  put: (url = '', data = {}) => instance.put(url, data),
  delete: (url = '', data = {}) => instance.delete(url, data),
  patch: (url = '', data = {}) => instance.patch(url, data)
}

export default http
