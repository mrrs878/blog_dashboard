/*
 * @Author: your name
 * @Date: 2021-02-24 10:26:28
 * @LastEditTime: 2021-03-08 22:42:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/src/components/MHeader.tsx
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Col, Row, Badge, Avatar, Menu, Dropdown, Modal,
} from 'antd';
import { MailOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import style from './index.module.less';
import MHeaderSearch from '../MHeaderSearch';
import { ROUTES_MAP } from '../../route';
import useLogout from '../../hooks/useLogout';
import { useModel } from '../../store';

const DROP_MENU_KEYS = {
  profile: 'profile',
  logout: 'logout',
};

interface PropsI extends RouteComponentProps {
}

const AvatarMenu = (props: PropsI) => {
  const [logoutModalF, setLogoutModalF] = useState(false);
  const { logoutRes, logout } = useLogout();

  useEffect(() => {
    setLogoutModalF(false);
  }, [logoutRes]);

  const onDropMenuClick = useCallback(({ key }: any) => {
    if (key === DROP_MENU_KEYS.profile) {
      props.history.push(ROUTES_MAP.profile);
    }
    if (key === DROP_MENU_KEYS.logout) {
      setLogoutModalF(true);
    }
  }, [props.history]);

  return (
    <>
      <Menu onClick={onDropMenuClick}>
        <Menu.Item key={DROP_MENU_KEYS.profile} icon={<ProfileOutlined />}>
          <span>个人中心</span>
        </Menu.Item>
        <Menu.Item key={DROP_MENU_KEYS.logout} icon={<LogoutOutlined />}>
          <span>退出登录</span>
        </Menu.Item>
      </Menu>
      <Modal
        title="提示"
        visible={logoutModalF}
        onOk={logout as any}
        onCancel={() => setLogoutModalF(false)}
      >
        确定要退出登录吗?
      </Modal>
    </>
  );
};

const MHeader: React.FC<PropsI> = (props: PropsI) => {
  const [user] = useModel('user');
  return (
    <Row align="middle" className={style.headerContainer} style={{ padding: '0 10px' }}>
      <Col flex={1} />
      <Col>
        <MHeaderSearch
          className={`${style.action} ${style.search}`}
          placeholder="站内搜索"
          defaultValue="umi ui"
          options={[
            { label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>, value: 'umi ui' },
            {
              label: <a href="http://blog.p18c.top">Ant Design</a>,
              value: 'Ant Design',
            },
            {
              label: <a href="https://protable.ant.design/">Pro Table</a>,
              value: 'Pro Table',
            },
            {
              label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
              value: 'Pro Layout',
            },
          ]}
        />
      </Col>
      <Col span={1} className="hoverEffect">
        <Badge className={style.badge} count={11}>
          <MailOutlined className={style.icon} />
        </Badge>
      </Col>
      <Col span={1} className="hoverEffect">
        <Dropdown overlay={AvatarMenu(props)}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size="small" className={style.avatar} src="https://mrrsblog.oss-cn-shanghai.aliyuncs.com/avatar.jpg" alt="avatar" />
            <span style={{ color: '#1890ff' }}>{user.name}</span>
          </div>
        </Dropdown>
      </Col>
    </Row>
  );
};

export default withRouter(MHeader);
