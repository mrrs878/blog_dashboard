/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-10-09 09:57:39
 * @LastEditTime: 2020-10-14 19:56:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\store\state.ts
 */

import { EMPTY_USER } from '../model';

export const DEFAULT_COMMON_STATE: CommonStateI = {
  count: 0,
  user: EMPTY_USER,
  menu: [],
  menuArray: [],
  menuRoutes: {},
  dicts: [],
  baseDicts: [],
  menuTitles: {},
  fullScreen: false,
  articles: [],
};
