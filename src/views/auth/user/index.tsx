import { ColumnProps } from 'antd/lib/table';
import { message, Modal, Switch, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { GET_ALL_USERS } from '../../../api/user';
import getColumnSearchProps from '../../../components/MTableSearch';
import useRequest from '../../../hooks/useRequest';
import { AppState } from '../../../store';
import { UPDATE_USER_STATUS } from '../../../api/auth';
import { isTruth } from '../../../tools';

interface PropsI extends RouteComponentProps {
  dicts: Array<DictI>;
}

const mapState2Props = (state: AppState) => ({
  dicts: state.common.dicts,
});

const User = (props: PropsI) => {
  const [, getUsersRes, , reGetUsers] = useRequest(GET_ALL_USERS);
  const [users, setUsers] = useState<Array<UserI>>([]);
  const [roles, setRoles] = useState<DynamicObjectKey<string>>({});
  const [createdBy, setCreatedBy] = useState<DynamicObjectKey<string>>({});
  const [, updateUserStatusRes, updateUserStatus] = useRequest(UPDATE_USER_STATUS, false);

  const onStatusChange = useCallback((status: boolean, userId) => {
    const text = status ? '启用' : '停用';
    Modal.confirm({
      title: '提示',
      content: `确定${text}该账号吗？`,
      okText: text,
      cancelText: '取消',
      onCancel: () => Promise.resolve(),
      onOk: () => {
        updateUserStatus({ status: Number(status), userId });
      },
    });
  }, [updateUserStatus]);

  const columns: Array<ColumnProps<UserI>> = useMemo(() => [
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
      render: (item, record) => <Switch onChange={(status) => onStatusChange(status, record._id)} checked={item} />,
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
      sorter: (a, b) => new Date(a.createTime || '').getTime() - new Date(b.createTime || '').getTime(),
      sortDirections: ['descend', 'ascend'],
    },
  ], [createdBy, onStatusChange, roles]);

  useEffect(() => {
    if (!getUsersRes) return;
    setUsers(getUsersRes.data || []);
    const _roles: DynamicObjectKey<string> = {};
    props.dicts
      .filter((item) => item.type === 'user' && item.label === 'user_role' && item.status !== 2)
      .forEach((item) => { _roles[item.value] = item.name_view; });
    const _createdBy: DynamicObjectKey<string> = {};
    props.dicts
      .filter((item) => item.type === 'common' && item.label === 'created_by')
      .forEach((item) => { _createdBy[item.value] = item.name_view; });
    setRoles(_roles);
    setCreatedBy(_createdBy);
  }, [getUsersRes, props.dicts]);

  useEffect(() => {
    if (!updateUserStatusRes) return;
    message.info(updateUserStatusRes.msg);
    isTruth(reGetUsers);
  }, [reGetUsers, updateUserStatusRes]);

  return (
    <div>
      <Table
        columns={columns}
        rowKey={(record) => String(record._id)}
        dataSource={users}
        pagination={{ defaultPageSize: 20 }}
      />
    </div>
  );
};

export default connect(mapState2Props)(withRouter(User));
