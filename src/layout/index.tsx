/**
 * @overview: 主布局配置文件
 * @description: 页面整体布局
 * @author: Mr.RS<mrrs878@foxmail.com>
 * @date 2020/7/1/0001
*/

import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import MMenu from '../components/MMenu';
import MHeader from '../components/MHeader';
import MPageHeader from '../components/MPageHeader/inedx';
import Router from '../router';
import { AppState } from '../store';

const { Content } = Layout;

const mapState2Props = (state: AppState) => ({
  fullScreen: state.common.fullScreen,
});

interface PropsI{
  fullScreen: boolean
}

const MLayout = (props: PropsI) => {
  console.log(222);
  return (
    <BrowserRouter>
      <Layout>
        {
          !props.fullScreen && <MMenu />
        }
        <Content>
          <div className="content">
            {
              !props.fullScreen && <MHeader />
            }
            {
              !props.fullScreen && <MPageHeader />
            }
            <Router />
          </div>
        </Content>
      </Layout>
    </BrowserRouter>
  );
};

export default connect(mapState2Props)(MLayout);
