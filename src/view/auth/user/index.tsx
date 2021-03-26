import { ColumnProps } from 'antd/lib/table';
import {
  message, Modal, Switch, Table,
} from 'antd';
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { withRouter } from 'react-router-dom';
import { GET_ALL_USERS } from '../../../api/user';
import getColumnSearchProps from '../../../components/MTableSearch';
import useRequest from '../../../hooks/useRequest';
import { UPDATE_USER_STATUS } from '../../../api/auth';
import { isTruth } from '../../../tools';
import { useModel } from '../../../store';

const User = () => {
  const [dicts] = useModel('dicts');
  const [, getUsersRes, , reGetUsers] = useRequest(GET_ALL_USERS);
  const [users, setUsers] = useState<Array<IUser>>([]);
  const [roles, setRoles] = useState<Record<string, string>>({});
  const [createdBy, setCreatedBy] = useState<Record<string, string>>({});
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

  const columns: Array<ColumnProps<IUser>> = useMemo(() => [
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
      render: (item, record) => (
        <Switch
          onChange={(status) => onStatusChange(status, record._id)}
          checked={item}
        />
      ),
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
    const newRoles: Record<string, string> = {};
    dicts
      .filter((item) => item.type === 'user' && item.label === 'user_role' && item.status !== 2)
      .forEach((item) => { newRoles[item.value] = item.name_view; });
    const createdByTmp: Record<string, string> = {};
    dicts
      .filter((item) => item.type === 'common' && item.label === 'created_by')
      .forEach((item) => { createdByTmp[item.value] = item.name_view; });
    setRoles(newRoles);
    setCreatedBy(createdByTmp);
  }, [dicts, getUsersRes]);

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

export default withRouter(User);
