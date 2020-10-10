import { Provider } from 'react-redux';
import React, { useEffect } from 'react';

import store from './store';
import './global.less';
import './mock';
import MLayout from './layout';
import useGetUserInfoByToken from './hooks/useGetUserInfoByToken';
import useGetDicts from './hooks/useGetDicts';
import useGetMenus from './hooks/useGetMenus';

function App() {
  const [getUserInfoByToken] = useGetUserInfoByToken(false);
  const [getDicts] = useGetDicts(false);
  const [getMenus] = useGetMenus(false);

  useEffect(() => {
    getMenus();
    getDicts();
    getUserInfoByToken();
  }, [getDicts, getMenus, getUserInfoByToken]);

  return (
    <Provider store={store}>
      <div className="app">
        <MLayout />
      </div>
    </Provider>
  );
}

export default App;
