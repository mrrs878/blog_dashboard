/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 10:13:41
 * @LastEditTime: 2021-04-02 16:15:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/src/layout/index.tsx
 */

import { Layout } from 'antd';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MHeader from '../components/MHeader';
import MMenu from '../components/MMenu';
import MPageHeader from '../components/MPageHeader';
import MTagsBar from '../components/MTagsBar';
import useGetDicts from '../hooks/useGetDicts';
import useGetMenu from '../hooks/useGetMenu';
import Router from '../route';
import { useFullScreen } from '../store';

const { Content, Footer, Sider } = Layout;

const MLayout = () => {
  const [isFullScreen] = useFullScreen();
  useGetMenu(false, true);
  useGetDicts(false, true);
  return (
    <BrowserRouter>
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
          <Content style={{ margin: '0 16px' }}>
            {
              !isFullScreen && <MPageHeader />
            }
            <Router />
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            {`${new Date().getFullYear()}`}
            &nbsp;&copy; Mr.RS
          </Footer>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default MLayout;
