import React from 'react';
import { Col, Row, Badge, Avatar, Menu, Dropdown } from 'antd';
import { MailOutlined, LogoutOutlined } from '@ant-design/icons';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import style from './index.module.less';
import { AppState } from '../../store';
import { ROUTES_MAP } from '../../router';
import MHeaderSearch from '../MHeaderSearch';

const mapState2Props = (state: AppState) => ({
  common: state.common,
});

interface PropsI extends RouteComponentProps {
  common: CommonStateI
}

const AvatarMenu = (
  <Menu>
    <Menu.Item icon={<LogoutOutlined />}>
      <span>退出登录</span>
    </Menu.Item>
  </Menu>
);

const MHeader: React.FC<PropsI> = (props: PropsI) => (props.location.pathname === ROUTES_MAP.login ? <></> : (
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
      <Dropdown overlay={AvatarMenu}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size="small" className={style.avatar} src="https://mrrsblog.oss-cn-shanghai.aliyuncs.com/avatar.jpg" alt="avatar" />
          <span style={{ color: '#1890ff' }}>{props.common.user.name}</span>
        </div>
      </Dropdown>
    </Col>
  </Row>
));

export default connect(mapState2Props)(withRouter(MHeader));
