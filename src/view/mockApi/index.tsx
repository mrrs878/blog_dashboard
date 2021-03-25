/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-01-28 10:55:14
 * @LastEditTime: 2021-02-03 15:31:36
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: /my-app/src/views/mockApi/index.tsx
 */
import React from 'react';
import { GET_MOCK_APIS } from '../../api/mockApi';
import useRequest from '../../hooks/useRequest';
import EditableTagGroup from './components/EditableTagGroup';

const Index = () => {
  const [,] = useRequest(GET_MOCK_APIS, false);
  return (
    <div className="container">
      <EditableTagGroup tags={['1', '2', '3']} />
    </div>
  );
};

export default Index;
