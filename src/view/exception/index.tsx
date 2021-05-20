/*
* @Author: your name
* @Date: 2021-04-25 10:39:04
 * @LastEditTime: 2021-04-25 17:31:26
 * @LastEditors: Please set LastEditors
* @Description: In User Settings Edit
* @FilePath: /dashboard_template/src/view/exception/index.tsx
*/
import { Table } from 'antd';
import React, { useMemo, useState } from 'react';

const ExceptionSentry: React.FC = () => {
  const [exceptions] = useState<Array<IBaseErrorInfo>>([]);
  const columns = useMemo(() => ([
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
  ]), []);

  return (
    <Table
      columns={columns}
      dataSource={exceptions}
    />
  );
};

export default ExceptionSentry;
