/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-26 18:16:29
 * @LastEditTime: 2021-08-10 20:04:35
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 */

import {
  and, compose, cond, equals, filter, gt, lte, not, uniqBy,
} from 'ramda';
import React, { Suspense, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { reactHooks } from '@mrrs878/js-library';
import MLoading from '../components/MLoading';
import { useModel } from '../store';

const { useDocumentTitle } = reactHooks;

const Home = React.lazy(() => import('../view/home'));
const Profile = React.lazy(() => import('../view/profile'));
const Login = React.lazy(() => import('../view/auth/login'));
const ForbiddenPage = React.lazy(() => import('../view/auth/403'));
const Setting = React.lazy(() => import('../view/setting'));
const MenuSetting = React.lazy(() => import('../view/setting/menu'));
const Permission = React.lazy(() => import('../view/setting/permission'));
const ExceptionSentry = React.lazy(() => import('../view/exception'));
const ARTICLE = React.lazy(() => import('../view/article'));
const ARTICLE_DETAIL = React.lazy(() => import('../view/article/detail'));

interface GuardComponentPropsI {
  component: any;
  auth: boolean;
  path: string;
}

const ROUTES: Array<IRouteConfig> = [
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/',
    component: Home,
  },
  {
    path: '/profile',
    component: Profile,
  },
  {
    path: '/auth/login',
    component: Login,
    auth: false,
  },
  {
    path: '/setting',
    component: Setting,
    auth: true,
  },
  {
    path: '/setting/menu',
    component: MenuSetting,
    auth: true,
  },
  {
    path: '/setting/menu/:id',
    component: MenuSetting,
    auth: true,
  },
  {
    path: '/setting/permission',
    component: Permission,
    auth: true,
  },
  {
    path: '/exceptionSentry',
    component: ExceptionSentry,
  },
  {
    path: '/articles/:id',
    component: ARTICLE_DETAIL,
  },
  {
    path: '/articles',
    component: ARTICLE,
  },
];

const GuardComponent = (props: GuardComponentPropsI) => {
  const [titles] = useModel('menuTitles');
  const [permissionUrls] = useModel('permissionUrls');
  const [user] = useModel('user');
  const [, updateTags] = useModel('tags');

  const path = props.path.replace(/\/:(.+)/g, '');
  useDocumentTitle(titles[path]);

  useEffect(() => {
    updateTags((pre) => compose(
      uniqBy((item) => item.path),
      filter<ITag, 'array'>(({ title }) => title !== undefined),
    )([...pre, { path, title: titles[path] }]));
  }, [path, titles, updateTags]);

  const Component = (props.component) as any;
  const urlRole = permissionUrls.find((item) => item.url === props.path)?.role || 0;

  return cond([
    [() => equals(path, '/'), () => <Redirect to="/home" />],
    [() => and(true, () => equals(path, '/auth/login')), () => <Component />],
    [() => and(equals(user.role, -1), props.auth), () => <Redirect to="/auth/login" />],
    [() => and(equals(user.role, -1), not(props.auth)), () => <Component />],
    [() => gt(user.role, urlRole), () => <ForbiddenPage />],
    [() => lte(user.role, urlRole), () => <Component />],
  ])(user);
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
              />
            )}
          />
        ))
      }
    </Switch>
  </Suspense>
);

export { ROUTES };

export default Router;
