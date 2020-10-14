/**
 * @overview: 主布局配置文件
 * @description: 页面整体布局
 * @author: Mr.RS<mrrs878@foxmail.com>
 * @date 2020/7/1/0001
*/

import React, { Suspense } from 'react';
import { Layout } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import MMenu from '../components/MMenu';
import MHeader from '../components/MHeader';
import MPageHeader from '../components/MPageHeader/inedx';
import Router from '../router';
import { AppState } from '../store';
import MLoading from '../components/MLoading';

const { Content, Footer, Sider } = Layout;

const mapState2Props = (state: AppState) => ({
  fullScreen: state.common.fullScreen,
});

interface PropsI{
  fullScreen: boolean
}

const MLayout = (props: PropsI) => (
  <BrowserRouter>
    <Layout>
      {
        !props.fullScreen && (
        <Sider collapsible>
          <MMenu />
        </Sider>
        )
      }
      <Layout className="site-layout">
        {
          !props.fullScreen && (
            <MHeader />
          )
        }
        <Content style={{ margin: '0 16px' }}>
          {
            !props.fullScreen && <MPageHeader />
          }
          <Suspense fallback={<MLoading />}>
            <Router />
          </Suspense>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Powered by Mr.RS</Footer>
      </Layout>
    </Layout>
  </BrowserRouter>
);

export default connect(mapState2Props)(MLayout);
