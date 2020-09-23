/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-09-23 19:59:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\mock\auth.ts
 */
import { createMockRes } from '../tools';
import AUTH_DATA from './json/auth.json';

const BASE_URL = `${process.env.REACT_APP_BASE_URL || ''}/auth`;

createMockRes<GetMenuReqI, GetMenusResI>(`${BASE_URL}/menu`, 'get', () => ({
  success: true,
  code: 200,
  msg: '获取成功',
  data: AUTH_DATA,
}));
