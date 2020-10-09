/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-10-09 18:53:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\tools\ajax.ts
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
  if ([401].includes(response.data.code)) {
    localStorage.removeItem(MAIN_CONFIG.TOKEN_NAME);
    return;
  }
  return Promise.resolve(response.data);
}, (error: any) => {
  console.log(error);
  return Promise.resolve(error);
});

export default ajax;
