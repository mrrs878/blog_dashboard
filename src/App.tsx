/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-23 11:21:04
 * @LastEditTime: 2021-03-29 13:53:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/App.tsx
 */
import React, { useReducer } from 'react';
import MErrorBoundary from './components/MErrorBoundary';
import MLayout from './layout';
import { defaultState, reducer, StoreContext } from './store';
import './app.less';

function App() {
  const [state, dispatch] = useReducer(reducer, defaultState, undefined);

  return (
    <MErrorBoundary>
      <StoreContext.Provider value={{ state, dispatch }}>
        <MLayout />
      </StoreContext.Provider>
    </MErrorBoundary>
  );
}

export default App;
