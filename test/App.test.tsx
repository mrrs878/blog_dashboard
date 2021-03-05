/*
 * @Author: your name
 * @Date: 2021-03-02 18:44:09
 * @LastEditTime: 2021-03-02 19:01:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/test/App.test.tsx
 */
import React from 'react';
import { render } from '@testing-library/react';
import App from '../src/App';

it('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/this is MHeader/i);
  expect(linkElement).toBeInTheDocument();
});
