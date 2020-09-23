import { Provider } from 'react-redux';
import React, { useEffect } from 'react';

import store from './store';
import './global.less';
import userModule from './modules/user';
import authModule from './modules/auth';
import './mock';
import dictModule from './modules/dict';
import MLayout from './layout';
import ARTICLE_MODULE from './modules/article';

function App() {
  useEffect(() => {
    Promise.race([userModule.getInfoByToken(), authModule.getMenu(), dictModule.getDict(), ARTICLE_MODULE.getArticles()]).catch((error) => {
      console.log(error);
    });
  });

  return (
    <Provider store={store}>
      <div className="app">
        <MLayout />
      </div>
    </Provider>
  );
}

export default App;
