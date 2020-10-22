/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-10-22 18:25:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\router\dashboard.ts
 */
import React from 'react';

const DASHBOARD = React.lazy(() => import('../views/home'));

const DASHBOARD_ROUTES_MAP = {
  home: '/home',
};

const DASHBOARD_ROUTES: Array<RouteConfigI> = [
  {
    path: DASHBOARD_ROUTES_MAP.home,
    component: DASHBOARD,
  },
];

export {
  DASHBOARD_ROUTES_MAP,
  DASHBOARD_ROUTES,
};
