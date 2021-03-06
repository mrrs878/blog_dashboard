/*
 * @Author: your name
 * @Date: 2021-02-24 14:29:29
 * @LastEditTime: 2021-03-09 22:52:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/src/tool/ajax.ts
 */
import axios from 'axios';
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
  if ([401].includes(response.data.code) && window.location.pathname !== '/auth/login') {
    localStorage.removeItem(MAIN_CONFIG.TOKEN_NAME);
    window.location.href = '/auth/login';
    return null;
  }
  return (response.data);
}, (error: any) => (error));

export default ajax;
