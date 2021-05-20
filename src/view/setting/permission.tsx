/*
 * @Author: your name
 * @Date: 2021-04-15 16:34:56
 * @LastEditTime: 2021-04-15 23:04:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/view/setting/permission.ts
 */
import { Table } from 'antd';
import React, { useMemo } from 'react';
import { useModel } from '../../store';

const Permission = () => {
  const [permissionUrls] = useModel('permissionUrls');
  const columns = useMemo(() => ([
    {
      dataIndex: 'url',
      title: '页面路径',
    },
    {
      title: '最低用户角色',
      dataIndex: 'role',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
  ]), []);

  return (
    <div className="container">
      <Table
        rowKey={(record) => String(record.id)}
        columns={columns}
        dataSource={permissionUrls}
      />
    </div>
  );
};

export default Permission;
