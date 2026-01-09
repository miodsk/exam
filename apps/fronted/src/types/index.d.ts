import 'axios'
import type { AxiosRequestConfig } from 'axios'
export type Question = {
  id: number
  question: string
  type: 'radio' | 'checkbox' | 'input'
  options?: string[]
  score: number
  answer: string | string[]
  answerAnalyse: string
}
export interface Result<T = any> {
  code: number
  message: string
  data: T
}

// 【核心：类型扩展】让 TS 知道 service.get/post 返回的是 Result<T> 而不是 AxiosResponse
declare module 'axios' {
  export interface AxiosInstance {
    request<T = any, R = Result<T>>(config: AxiosRequestConfig): Promise<R>
    get<T = any, R = Result<T>>(url: string, config?: AxiosRequestConfig): Promise<R>
    post<T = any, R = Result<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>
    put<T = any, R = Result<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>
    delete<T = any, R = Result<T>>(url: string, config?: AxiosRequestConfig): Promise<R>
  }
}
