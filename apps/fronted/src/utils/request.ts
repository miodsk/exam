import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import type { Result } from '@/types'

// 1. 声明后端统一返回的 JSON 结构
let loadingInstance: any = null
let loadingCount = 0

const showLoading = () => {
  if (loadingCount === 0) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: '正在处理...',
      background: 'rgba(0, 0, 0, 0.7)',
    })
  }
  loadingCount++
}

const hideLoading = () => {
  if (loadingCount <= 0) return
  loadingCount--
  if (loadingCount === 0 && loadingInstance) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    loadingInstance.close()
    loadingInstance = null
  }
}

const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    showLoading()
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    hideLoading()
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    return Promise.reject(error)
  },
)

// 响应拦截
service.interceptors.response.use(
  (response: AxiosResponse<Result>) => {
    hideLoading()
    const res = response.data

    // 业务逻辑错误校验
    if (res.code !== 200 && res.code !== 201) {
      ElMessage.error(res.message || '业务逻辑错误')
      return Promise.reject(new Error(res.message || 'Error'))
    }
    // 返回剥离后的数据包 (即 Result 结构)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return res as any
  },
  (error) => {
    hideLoading()
    let msg = '网络连接异常'
    if (axios.isAxiosError(error)) {
      const backendMessage = (error.response?.data as Result)?.message
      msg = backendMessage || error.message || msg
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    ElMessage.error(msg)
    return Promise.reject(error instanceof Error ? error : new Error(msg))
  },
)

export default service
