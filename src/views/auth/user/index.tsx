import { message } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
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

function getDictListColumns(roles: DynamicObjectKey<string>): Array<ColumnProps<UserI>> {
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
      dataIndex: 'create_by',
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
  const [, getUsersRes] = useRequest(GET_ALL_USERS, {});
  const [users, setUsers] = useState<Array<UserI>>([]);
  const [dictListColumns, setDictListColumns] = useState<Array<ColumnProps<UserI>>>([]);
  useEffect(() => {
    if (!getUsersRes) return;
    message.info(getUsersRes.msg);
    setUsers(getUsersRes.data || []);
    const tmp: DynamicObjectKey<string> = {};
    props.dicts
      .filter((item) => item.type === 'user' && item.label === 'user_role')
      .forEach((item) => { tmp[item.value] = item.name; });
    setDictListColumns(getDictListColumns(tmp));
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
