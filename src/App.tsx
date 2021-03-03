/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-12-23 13:16:42
 * @LastEditTime: 2021-02-03 15:29:51
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: /my-app/src/App.tsx
 */
import { Provider } from 'react-redux';
import React from 'react';

import store from './store';
import './global.less';
import MLayout from './layout';
import useGetUserInfoByToken from './hooks/useGetUserInfoByToken';
import useGetDicts from './hooks/useGetDicts';
import useGetMenus from './hooks/useGetMenus';

function App() {
  useGetUserInfoByToken(false);
  useGetDicts(false, true);
  useGetMenus(false, true);

  return (
    <Provider store={store}>
      <div className="app">
        <MLayout />
      </div>
    </Provider>
  );
}

export default App;
