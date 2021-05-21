/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 14:29:29
 * @LastEditTime: 2021-05-21 18:13:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/tool/ajax.ts
 */
import axios from 'axios';
import { clone } from 'ramda';

const ajax = axios.create({
  timeout: 12000,
});

ajax.interceptors.request.use((config) => {
  const tmp = clone(config);
  tmp.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return tmp;
});
ajax.interceptors.response.use(async (response) => {
  if ([401].includes(response.data.code)) {
    if (window.location.pathname !== '/auth/login') window.location.href = '/auth/login';
    return null;
  }
  return (response.data);
}, (error: any) => (error));

export default ajax;
