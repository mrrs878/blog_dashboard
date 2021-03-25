/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-05 17:31:28
 * @LastEditTime: 2021-03-05 18:26:46
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: /test/src/view/auth/role/index.tsx
 */
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ColumnProps } from 'antd/es/table';
import getColumnSearchProps from '../../../components/MTableSearch';
import { getTableFilters } from '../../../components/MTableFilters';
import { ROUTES_MAP } from '../../../route';
import useGetDicts from '../../../hooks/useGetDicts';
import { useModel } from '../../../store';

interface PropsI extends RouteComponentProps {
}

function getDictListColumns(dicts: Array<IDict>): Array<ColumnProps<IDict>> {
  return [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      ...getColumnSearchProps('name'),
    },
    {
      title: '值',
      dataIndex: 'value',
    },
    {
      title: '组别',
      dataIndex: 'label_view',
      ellipsis: true,
      onFilter: (value, record) => value === String(record.label_view),
      ...getColumnSearchProps('label_view'),
    },
    {
      title: '类别',
      dataIndex: 'type_view',
      ellipsis: true,
      onFilter: (value, record) => value === String(record.type),
      ...getColumnSearchProps('type_view'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: getTableFilters<IDict>(dicts, (item: IDict) => item.type === 'common' && item.label === 'status'),
      onFilter: (value, record) => value === record.status,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      sorter: (a, b) => new Date(a.createTime || '').getTime() - new Date(b.createTime || '').getTime(),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      ellipsis: true,
      sorter: (a, b) => new Date(a.updateTime || '').getTime() - new Date(b.updateTime || '').getTime(),
      sortDirections: ['descend', 'ascend'],
    },
  ];
}

const Role: React.FC<PropsI> = (props: PropsI) => {
  const [dicts] = useModel('dicts');
  const [dict, setDict] = useState<Array<IDict>>([]);
  const [dictListColumns, setDictListColumns] = useState<Array<ColumnProps<IDict>>>([]);
  const [getDicts] = useGetDicts(false);

  useEffect(() => {
    getDicts();
  }, [getDicts]);

  useEffect(() => {
    setDict(dicts.filter((item) => item.label === 'user_role'));
    setDictListColumns(getDictListColumns(dicts));
  }, [dicts]);

  const onDictListRow = (record: IDict) => ({ onClick: () => props.history.push(`${ROUTES_MAP.role}/${record.value}`) });

  return (
    <div className="container">
      <Table
        columns={dictListColumns}
        rowKey={(record) => String(record._id)}
        onRow={onDictListRow}
        dataSource={dict}
        pagination={{ defaultPageSize: 20 }}
        scroll={{ y: '75vh' }}
      />
    </div>
  );
};

export default withRouter(Role);
