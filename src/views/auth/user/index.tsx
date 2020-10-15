import { ColumnProps } from 'antd/lib/table';
import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { GET_ALL_USERS } from '../../../api/user';
import getColumnSearchProps from '../../../components/MTableSearch';
import useRequest from '../../../hooks/useRequest';
import { ROUTES_MAP } from '../../../router';
import { AppState } from '../../../store';

interface PropsI extends RouteComponentProps {
  dicts: Array<DictI>;
}

function getDictListColumns(roles: DynamicObjectKey<string>, createdBy: DynamicObjectKey<string>, status: DynamicObjectKey<string>): Array<ColumnProps<UserI>> {
  return [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      ...getColumnSearchProps('name'),
    },
    {
      title: '角色',
      dataIndex: 'role',
      render: (item) => roles[item],
    },
    {
      title: '注册渠道',
      dataIndex: 'createdBy',
      render: (item) => createdBy[item],
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (item) => status[item],
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      sorter: (a, b) => new Date(a.createTime || '').getTime() - new Date(b.createTime || '').getTime(),
      sortDirections: ['descend', 'ascend'],
    },
  ];
}

const mapState2Props = (state: AppState) => ({
  dicts: state.common.dicts,
});


const User = (props: PropsI) => {
  const [, getUsersRes] = useRequest(GET_ALL_USERS);
  const [users, setUsers] = useState<Array<UserI>>([]);
  const [dictListColumns, setDictListColumns] = useState<Array<ColumnProps<UserI>>>([]);
  useEffect(() => {
    if (!getUsersRes) return;
    setUsers(getUsersRes.data || []);
    const roles: DynamicObjectKey<string> = {};
    props.dicts
      .filter((item) => item.type === 'user' && item.label === 'user_role' && item.status !== 2)
      .forEach((item) => { roles[item.value] = item.name_view; });
    const createdBy: DynamicObjectKey<string> = {};
    props.dicts
      .filter((item) => item.type === 'common' && item.label === 'created_by')
      .forEach((item) => { createdBy[item.value] = item.name_view; });
    const status: DynamicObjectKey<string> = {};
    props.dicts
      .filter((item) => item.type === 'base' && item.label === 'status')
      .forEach((item) => { status[item.value] = item.name_view; });
    setDictListColumns(getDictListColumns(roles, createdBy, status));
  }, [getUsersRes, props.dicts]);

  const onDictListRow = (record: UserI) => ({ onClick: () => props.history.push(`${ROUTES_MAP.user}/${record._id}`) });

  return (
    <div>
      <Table
        columns={dictListColumns}
        rowKey={(record) => String(record._id)}
        onRow={onDictListRow}
        dataSource={users}
        pagination={{ defaultPageSize: 20 }}
      />
    </div>
  );
};

export default connect(mapState2Props)(withRouter(User));
