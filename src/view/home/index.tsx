/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 23:04:18
 * @LastEditTime: 2021-03-01 10:09:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dashboard_template\src\view\home\index.tsx
 */
import { Button } from 'antd';
import React from 'react';
import { useModel } from '../../store';

const Home = () => {
  const [user, updateUser] = useModel('user');
  return (
    <div style={{ color: '#f00' }}>
      hello &emsp;
      { user.age }
      <Button onClick={() => updateUser({ ...user, age: 32 })}>set user</Button>
    </div>
  );
};

export default Home;
