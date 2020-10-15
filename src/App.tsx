import { Provider } from 'react-redux';
import React from 'react';

import store from './store';
import './global.less';
import './mock';
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
