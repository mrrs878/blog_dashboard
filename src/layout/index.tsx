/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 10:13:41
 * @LastEditTime: 2021-04-25 16:58:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/layout/index.tsx
 */

import { ConfigProvider, Layout, message } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  compose, curry, equals, not, prop, when,
} from 'ramda';
import MHeader from '../components/MHeader';
import MMenu from '../components/MMenu';
import MTagsBar from '../components/MTagsBar';
import useGetPermissionUrls from '../hook/useGetPermissionUrls';
import useGetMenu from '../hook/useGetMenu';
import Router, { ROUTES } from '../route';
import { useFullScreen } from '../store';
import useAutoLogin from '../hook/useAutoLogin';
import initExceptionSentry from '../tool/error';

const { Content, Footer, Sider } = Layout;

const MLayout = () => {
  const [isFullScreen] = useFullScreen();

  useEffect(() => {
    message.config({ duration: 1 });
    when(
      compose(not, equals('development')),
      curry(initExceptionSentry)({ url: 'http://localhost:3003/exceptionLog' }),
    )(process.env.NODE_ENV);
  }, []);
  when<any, void>(
    compose(not, equals(false), prop('auth')),
    useAutoLogin,
  )(ROUTES.find((item) => item.path === window.location.href));
  useGetMenu(false, true);
  useGetPermissionUrls(false, true);

  return (
    <BrowserRouter>
      <ConfigProvider locale={zhCN}>
        <Layout style={{ minHeight: '100vh' }}>
          {
          !isFullScreen && (
          <Sider collapsible>
            <MMenu />
          </Sider>
          )
        }
          <Layout className="site-layout">
            {
            !isFullScreen && (
              <MHeader />
            )
          }
            {
            !isFullScreen && (
              <MTagsBar />
            )
          }
            <Content style={{ margin: '16px' }}>
              <Router />
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              {`${new Date().getFullYear()}`}
            &nbsp;&copy; Mr.RS
            </Footer>
          </Layout>
        </Layout>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default MLayout;
