/*
 * @Author: your name
 * @Date: 2021-02-24 14:29:29
 * @LastEditTime: 2021-02-24 14:29:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/src/tool/ajax.ts
 */
import axios from 'axios';
import { clone } from 'ramda';

const ajax = axios.create({
  timeout: 12000,
});

ajax.interceptors.request.use((config) => {
  const tmp = clone(config);
  tmp.headers.Authorization = 'Bearer test';
  return tmp;
});
ajax.interceptors.response.use(async (response) => {
  if ([401].includes(response.data.code)) {
    window.location.href = '/auth/login';
    return null;
  }
  return (response.data);
}, (error: any) => (error));

export default ajax;
