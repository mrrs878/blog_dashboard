/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-10-10 19:00:47
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\router\authRoutes.ts
 */
import React from 'react';

const LOGIN = React.lazy(() => import('../views/auth/login'));
const REG = React.lazy(() => import('../views/auth/reg'));
const USER = React.lazy(() => import('../views/auth/user'));
const ROLE = React.lazy(() => import('../views/auth/role'));
const ROLE_DETAIL = React.lazy(() => import('../views/auth/role/detail'));

const AUTH_ROUTES_MAP = {
  auth: '/auth',
  login: '/auth/login',
  reg: '/auth/reg',
  user: '/auth/user',
  role: '/auth/role',
};

const AUTH_ROUTES: Array<RouteConfigI> = [
  {
    path: AUTH_ROUTES_MAP.login,
    component: LOGIN,
    auth: false,
    fullScreen: true,
  },
  {
    path: AUTH_ROUTES_MAP.reg,
    component: REG,
    auth: false,
    fullScreen: true,
  },
  {
    path: AUTH_ROUTES_MAP.role,
    component: ROLE,
  },
  {
    path: `${AUTH_ROUTES_MAP.role}/:id`,
    component: ROLE_DETAIL,
  },
  {
    path: AUTH_ROUTES_MAP.user,
    component: USER,
  },
];

export {
  AUTH_ROUTES_MAP,
  AUTH_ROUTES,
  LOGIN,
};
