import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import type { LoadingInstance } from 'element-plus'

// 1. 定义后端统一返回的 JSON 结构
interface Result<T = any> {
  code: number
  message: string
  data: T
}

// 2. Loading 实例与计数器
let loadingInstance: LoadingInstance | null = null
let loadingCount = 0

const showLoading = () => {
  if (loadingCount === 0) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
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
    loadingInstance.close()
    loadingInstance = null
  }
}

// 3. 创建 Axios 实例
const service: AxiosInstance = axios.create({
  baseURL: '/api', // 对应 Vite Proxy 配置
  timeout: 10000,
})

// 4. 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    showLoading()
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => {
    hideLoading()
    return Promise.reject(error instanceof Error ? error : new Error(String(error)))
  },
)

// 5. 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<Result>) => {
    hideLoading()
    const res = response.data

    // 逻辑 code 校验（通常后端 200 或 201 表示成功）
    if (res.code !== 200 && res.code !== 201) {
      ElMessage.error(res.message || '业务逻辑错误')
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res as unknown as AxiosResponse<Result>
  },
  (error: unknown) => {
    hideLoading()

    let msg = '网络连接异常'
    let status: number | undefined

    // 💡 解决 Unsafe assignment 和 Property response does not exist
    if (axios.isAxiosError(error)) {
      status = error.response?.status
      // 优先取后端返回的 message 字段
      const backendMessage = (error.response?.data as Result | undefined)?.message
      msg = backendMessage || error.message || msg
    } else if (error instanceof Error) {
      msg = error.message
    }

    // 针对特定 HTTP 状态码的处理
    switch (status) {
      case 401:
        msg = '身份已过期，请重新登录'
        localStorage.removeItem('token')
        setTimeout(() => {
          window.location.href = '/login'
        }, 1200)
        break
      case 403:
        msg = '权限不足，拒绝访问'
        break
      case 500:
        msg = '服务器内部故障'
        break
    }

    ElMessage.error(msg)

    // 💡 符合 ESLint: Expected the Promise rejection reason to be an Error
    return Promise.reject(error instanceof Error ? error : new Error(msg))
  },
)

// 6. 统一导出 http 工具函数
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<Result<T>> {
    return service.get(url, config)
  },
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Result<T>> {
    return service.post(url, data, config)
  },
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Result<T>> {
    return service.put(url, data, config)
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<Result<T>> {
    return service.delete(url, config)
  },
}

export default service
