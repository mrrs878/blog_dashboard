/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-09-23 19:47:29
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\mock\user.ts
 */
import { createMockRes } from '../tools';
import USER_DATA from './json/user.json';

const BASE_URL = `${process.env.REACT_APP_BASE_URL || ''}/user`;

createMockRes<any, GetInfoByTokenResI>(`${BASE_URL}`, 'get', () => ({
  success: true,
  code: 200,
  msg: '获取成功',
  data: USER_DATA.guest,
}));
