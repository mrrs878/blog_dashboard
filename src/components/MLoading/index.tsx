/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 10:29:00
 * @LastEditTime: 2021-02-24 10:35:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/src/components/MLoading.tsx
 */
import React from 'react';
import { Spin } from 'antd';

import loadingStyle from './index.module.less';

const MLoading: React.FC = () => <Spin className={loadingStyle.loading} spinning tip="加载页面中..." />;

export default MLoading;
