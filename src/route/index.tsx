/*
 * @Author: your name
 * @Date: 2021-02-26 18:16:29
 * @LastEditTime: 2021-03-08 22:36:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/route/index.tsx
 */

import React, { Suspense, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import MLoading from '../components/MLoading';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useFullScreen, useModel } from '../store';
import { getCookie } from '../tools';

const HOME = React.lazy(() => import('../view/home'));
const PROFILE = React.lazy(() => import('../view/profile'));
const ABOUT = React.lazy(() => import('../view/about'));
const ARTICLE = React.lazy(() => import('../view/article'));
const ARTICLE_DETAIL = React.lazy(() => import('../view/article/detail'));
const LOGIN = React.lazy(() => import('../view/auth/login'));
const REG = React.lazy(() => import('../view/auth/reg'));
const USER = React.lazy(() => import('../view/auth/user'));
const ROLE = React.lazy(() => import('../view/auth/role'));
const ROLE_DETAIL = React.lazy(() => import('../view/auth/role/detail'));
const COMMENT = React.lazy(() => import('../view/comment'));
const COMMENT_DETAIL = React.lazy(() => import('../view/comment/detail'));
const MOCK_API_INDEX = React.lazy(() => import('../view/mockApi'));
const MOCK_API_DETAIL = React.lazy(() => import('../view/mockApi/detail'));
const DICT = React.lazy(() => import('../view/setting/dict'));
const DICT_DETAIL = React.lazy(() => import('../view/setting/dict/detail'));
const MENU_SETTING = React.lazy(() => import('../view/setting/menu'));

interface GuardComponentPropsI {
  component: any;
  auth: boolean;
  fullScreen: boolean;
  path: string;
}

const ROUTES_MAP = {
  home: '/home',
  profile: '/profile',
  login: '/auth/login',
  reg: '/auth/reg',
  user: '/auth/user',
  role: '/auth/role',
  article: '/articles',
  comment: '/comment',
  setting: '/setting',
  dict: '/setting/dict',
  menuSetting: '/setting/menu',
  about: '/about',
  mockApi: '/mockApis',
};

const ROUTES: Array<RouteConfigI> = [
  {
    path: ROUTES_MAP.home,
    component: HOME,
  },
  {
    path: '/',
    component: HOME,
  },
  {
    path: ROUTES_MAP.profile,
    component: PROFILE,
  },
  {
    path: ROUTES_MAP.login,
    component: LOGIN,
    auth: false,
    fullScreen: true,
  },
  {
    path: ROUTES_MAP.reg,
    component: REG,
    auth: false,
    fullScreen: true,
  },
  {
    path: `${ROUTES_MAP.article}/:id`,
    component: ARTICLE_DETAIL,
  },
  {
    path: ROUTES_MAP.article,
    component: ARTICLE,
  },
  {
    path: ROUTES_MAP.user,
    component: USER,
  },
  {
    path: ROUTES_MAP.role,
    component: ROLE,
  },
  {
    path: `${ROUTES_MAP.role}/:id`,
    component: ROLE_DETAIL,
  },
  {
    path: ROUTES_MAP.comment,
    component: COMMENT,
  },
  {
    path: `${ROUTES_MAP.comment}/:id`,
    component: COMMENT_DETAIL,
  },
  {
    path: ROUTES_MAP.mockApi,
    component: MOCK_API_INDEX,
  },
  {
    path: `${ROUTES_MAP.mockApi}/:id`,
    component: MOCK_API_DETAIL,
  },
  {
    path: ROUTES_MAP.dict,
    component: DICT,
  },
  {
    path: `${ROUTES_MAP.dict}/:id`,
    component: DICT_DETAIL,
  },
  {
    path: ROUTES_MAP.menuSetting,
    component: MENU_SETTING,
  },
  {
    path: ROUTES_MAP.about,
    component: ABOUT,
  },
];

const GuardComponent = (props: GuardComponentPropsI) => {
  const [titles] = useModel('menuTitles');
  const [, fullScreen] = useFullScreen();
  useDocumentTitle(titles[props.path]);
  const Component = (props.component) as any;
  useEffect(() => {
    if (props.auth && !getCookie('auth_token')) window.location.href = ROUTES_MAP.login;
    if (props.fullScreen) fullScreen();
  }, [fullScreen, props.auth, props.fullScreen]);
  return <Component />;
};

const Router = () => (
  <Suspense fallback={<MLoading />}>
    <Switch>
      {
        ROUTES.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            exact={route.exact || true}
            render={() => (
              <GuardComponent
                path={route.path}
                component={route.component}
                auth={route.auth || false}
                fullScreen={route.fullScreen || false}
              />
            )}
          />
        ))
      }
    </Switch>
  </Suspense>
);

export { ROUTES_MAP };

export default Router;
