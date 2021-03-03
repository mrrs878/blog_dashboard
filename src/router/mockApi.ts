/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-01-13 22:35:07
 * @LastEditTime: 2021-01-13 22:35:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\router\mockApi.ts
 */
import React from 'react';

const MOCK_API_INDEX = React.lazy(() => import('../views/mockApi'));
const MOCK_API_DETAIL = React.lazy(() => import('../views/mockApi/detail'));

const MOCK_API_ROUTES_MAP = {
  mockApi: '/mockApis',
};

const MOCK_API_ROUTES: Array<RouteConfigI> = [
  {
    path: MOCK_API_ROUTES_MAP.mockApi,
    component: MOCK_API_INDEX,
  },
  {
    path: `${MOCK_API_ROUTES_MAP.mockApi}/:id`,
    component: MOCK_API_DETAIL,
  },
];

export {
  MOCK_API_ROUTES_MAP,
  MOCK_API_ROUTES,
};
