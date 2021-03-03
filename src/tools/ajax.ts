/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-10-10 18:52:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\tools\ajax.ts
 */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { clone } from 'ramda';
import MAIN_CONFIG from '../config';

const ajax = axios.create({
  timeout: 12000,
});

ajax.interceptors.request.use((config) => {
  const tmp = clone(config);
  tmp.headers.Authorization = `Bearer ${localStorage.getItem(MAIN_CONFIG.TOKEN_NAME)}`;
  return tmp;
});
ajax.interceptors.response.use(async (response) => {
  if ([401].includes(response.data.code)) {
    localStorage.removeItem(MAIN_CONFIG.TOKEN_NAME);
    window.location.href = '/auth/login';
    return;
  }
  return Promise.resolve(response.data);
}, (error: any) => {
  console.log(error);
  return Promise.resolve(error);
});

// get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;

function get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig) {
  if (localStorage.getItem(MAIN_CONFIG.TOKEN_NAME) || MAIN_CONFIG.API_WHITE_LIST.includes(url)) return ajax.get<T, R>(url, config);
  return Promise.resolve({ success: false, code: -1, msg: '', data: null });
}

// put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;

function put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig) {
  if (localStorage.getItem(MAIN_CONFIG.TOKEN_NAME) || MAIN_CONFIG.API_WHITE_LIST.includes(url)) return ajax.put<T, R>(url, data, config);
  return Promise.resolve({ success: false, code: -1, msg: '', data: null });
}

// post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;

function post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig) {
  if (localStorage.getItem(MAIN_CONFIG.TOKEN_NAME) || MAIN_CONFIG.API_WHITE_LIST.includes(url)) return ajax.post<T, R>(url, data, config);
  return Promise.resolve({ success: false, code: -1, msg: '', data: null });
}

// delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;

function _delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig) {
  if (localStorage.getItem(MAIN_CONFIG.TOKEN_NAME) || MAIN_CONFIG.API_WHITE_LIST.includes(url)) return ajax.delete<T, R>(url, config);
  return Promise.resolve({ success: false, code: -1, msg: '', data: null });
}

const fetch: { get: any; put: any, delete: any, post: any } = {
  get,
  put,
  post,
  delete: _delete,
};

export default fetch;
