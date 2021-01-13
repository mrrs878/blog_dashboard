/**
 * @overview: 主路由配置文件
 * @description: 整合所有子路由配置、鉴权、导出路由配置表
 * @author: Mr.RS<mrrs878@foxmail.com>
 * @date 2020/7/1/0001
*/

import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import MAIN_CONFIG from '../config';
import MLoading from '../components/MLoading';
import { AUTH_ROUTES, AUTH_ROUTES_MAP } from './authRoutes';
import { PROFILE_ROUTES, PROFILE_ROUTES_MAP } from './profileRoutes';
import { SETTING_ROUTES, SETTING_ROUTES_MAP } from './settingRoutes';
import { ABOUT_ROUTES, ABOUT_ROUTES_MAP } from './aboutRoutes';
import { DASHBOARD_ROUTES, DASHBOARD_ROUTES_MAP } from './dashboard';
import { ARTICLE_ROUTES, ARTICLE_ROUTES_MAP } from './articleRoutes';
import store, { actions, AppState } from '../store';
import Chain, { NEXT_SUCCESSOR } from '../tools/Chain';
import { COMMENT_ROUTES_MAP, COMMENT_ROUTES } from './commentsRoutes';
import { MOCK_API_ROUTES, MOCK_API_ROUTES_MAP } from './mockApi';

interface PropsI {
  menuTitles: MenuTitlesI,
}

const mapState2Props = (state: AppState) => ({
  menuTitles: state.common.menuTitles,
});

const ROUTES_MAP = {
  ...AUTH_ROUTES_MAP,
  ...PROFILE_ROUTES_MAP,
  ...SETTING_ROUTES_MAP,
  ...ABOUT_ROUTES_MAP,
  ...DASHBOARD_ROUTES_MAP,
  ...ARTICLE_ROUTES_MAP,
  ...COMMENT_ROUTES_MAP,
  ...MOCK_API_ROUTES_MAP,
};

const ROUTES: Array<RouteConfigI> = [
  ...AUTH_ROUTES,
  ...PROFILE_ROUTES,
  ...SETTING_ROUTES,
  ...ABOUT_ROUTES,
  ...DASHBOARD_ROUTES,
  ...ARTICLE_ROUTES,
  ...COMMENT_ROUTES,
  ...MOCK_API_ROUTES,
];

const redirectMain = new Chain((route: RouteConfigI) => {
  if (route.path === '/') {
    window.location.href = '/home';
  }
  return NEXT_SUCCESSOR;
});
const redirectLogin = new Chain((route: RouteConfigI) => {
  if (localStorage.getItem(MAIN_CONFIG.TOKEN_NAME) || route.auth === false) {
    return NEXT_SUCCESSOR;
  }
  window.location.href = ROUTES_MAP.login;
});
const returnComponent = new Chain((route: RouteConfigI) => {
  const Com = route.component;
  return <Com />;
});
redirectMain.setNextSuccessor(redirectLogin);
redirectLogin.setNextSuccessor(returnComponent);

const Router = (props: PropsI) => {
  function beforeEach(route: RouteConfigI) {
    setTimeout(store.dispatch, 0, { type: actions.UPDATE_FULL_SCREEN, data: route.fullScreen === true });
    document.title = props.menuTitles[route.path] || MAIN_CONFIG.APP_NAME;
    return redirectMain.passRequest(route);
  }

  return (
    <Suspense fallback={<MLoading />}>
      <Switch>
        {
          ROUTES.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact || true}
              render={(): React.ReactNode => beforeEach(route)}
            />
          ))
        }
      </Switch>
    </Suspense>
  );
};

export {
  ROUTES_MAP,
};
export default connect(mapState2Props)(Router);
