/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AddAnswerDto {
  content: string
  examId: number
}

export interface Answer {
  id: number
  content: string
  score: number
  /** @format date-time */
  createTime: string
  /** @format date-time */
  updateTime: string
  answererId: number
  answerer: User
  examId: number
  exam: Exam
}

export interface Exam {
  id: number
  name: string
  isPublish: boolean
  isDelete: boolean
  content: string
  /** @format date-time */
  createTime: string
  /** @format date-time */
  updateTime: string
  createUserId: number
  createUser: User
  answers: Answer[]
}

export interface User {
  id: number
  username: string
  password: string
  email: string
  exams: Exam[]
  answers: Answer[]
  /** @format date-time */
  createTime: string
  /** @format date-time */
  updateTime: string
}

export interface ListAnswerVo {
  /** 回答列表 */
  answers: string[]
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from 'axios'
import axios from '@/utils/request'

export type QueryParamsType = Record<string | number, any>

export interface FullRequestParams extends Omit<
  AxiosRequestConfig,
  'data' | 'params' | 'url' | 'responseType'
> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType
  /** request body */
  body?: unknown
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown> extends Omit<
  AxiosRequestConfig,
  'data' | 'cancelToken'
> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void
  secure?: boolean
  format?: ResponseType
}

export enum ContentType {
  Json = 'application/json',
  JsonApi = 'application/vnd.api+json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private secure?: boolean
  private format?: ResponseType

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios
    this.secure = secure
    this.format = format
    this.securityWorker = securityWorker
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method)

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    }
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem)
    } else {
      return `${formItem}`
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key]
      const propertyContent: any[] = property instanceof Array ? property : [property]

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem))
      }

      return formData
    }, new FormData())
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const responseFormat = format || this.format || undefined

    if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
      body = this.createFormData(body as Record<string, unknown>)
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
      body = JSON.stringify(body)
    }

    return this.instance
      .request({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type ? { 'Content-Type': type } : {}),
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      })
      .then((res) => res.data)
  }
}

/**
 * @title 考试系统 - Answer
 * @version 1.0
 * @contact
 *
 * Answer接口
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  answer = {
    /**
     * No description
     *
     * @tags Answer
     * @name AnswerControllerGetHello
     * @request GET:/answer
     */
    answerControllerGetHello: (params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/answer`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Answer
     * @name AnswerControllerAdd
     * @request POST:/answer/add
     */
    answerControllerAdd: (data: AddAnswerDto, params: RequestParams = {}) =>
      this.request<Answer, any>({
        path: `/answer/add`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Answer
     * @name AnswerControllerList
     * @request GET:/answer/list
     */
    answerControllerList: (
      query: {
        examId: string
      },
      params: RequestParams = {},
    ) =>
      this.request<ListAnswerVo, any>({
        path: `/answer/list`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Answer
     * @name AnswerControllerFind
     * @request GET:/answer/find/{id}
     */
    answerControllerFind: (id: string, params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/answer/find/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Answer
     * @name AnswerControllerFindByUserId
     * @request GET:/answer/findByUserId
     */
    answerControllerFindByUserId: (params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/answer/findByUserId`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Answer
     * @name AnswerControllerExport
     * @request GET:/answer/export
     */
    answerControllerExport: (
      query: {
        examId: string
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/answer/export`,
        method: 'GET',
        query: query,
        ...params,
      }),
  }
}
