/*
 * @Author: your name
 * @Date: 2021-01-12 22:27:13
 * @LastEditTime: 2021-01-17 16:01:48
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\mock\article.ts
 */
import { createMockRes } from '../tools';
import ARTICLE_DATA from './json/article.json';

const BASE_URL = `${process.env.REACT_APP_BASE_URL || ''}/article`;

createMockRes<GetDictsReqT, GetDictsResT>(`${BASE_URL}`, 'get', () => ({
  success: true,
  code: 200,
  msg: '获取成功',
  data: [],
}));
