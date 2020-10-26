import React, { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Form, Input, Button, message, Modal, Spin } from 'antd';

import MVerify from '../../../components/MVerify';
import { LOGIN } from '../../../api/auth';
import useRequest from '../../../hooks/useRequest';
import useGetMenus from '../../../hooks/useGetMenus';
import MAIN_CONFIG from '../../../config';
import store, { actions } from '../../../store';

const layout = {
  labelCol: { span: 3, offset: 7 },
  wrapperCol: { span: 4 },
};
const tailLayout = {
  wrapperCol: { offset: 11, span: 2 },
};

interface PropsI extends RouteComponentProps<any, any> {
}

const Index = (props: PropsI) => {
  const [verifyModalF, setVerifyModalF] = useState(false);
  const [accountInfo, setAccountInfo] = useState<LoginReqI>({ name: '', password: '' });
  const [isLogin, loginRes, login] = useRequest(LOGIN, undefined, false);
  const { getMenusRes, getMenus } = useGetMenus(false);

  useEffect(() => {
    if (!loginRes) return;
    message.info(loginRes?.msg);
    if (!loginRes.success) return;
    localStorage.setItem(MAIN_CONFIG.TOKEN_NAME, loginRes.data.token);
    store.dispatch({ type: actions.UPDATE_USER, data: loginRes.data });
    getMenus();
  }, [getMenus, loginRes]);

  useEffect(() => {
    if (!getMenusRes || !getMenusRes.success) return;
    props.history.replace('/home');
  }, [getMenusRes, props.history]);

  function onVerifySuccess() {
    const { name, password } = accountInfo;
    login({ name, password });
  }

  function onFinish(values: any) {
    const { name, password } = values;
    setAccountInfo({ name, password });
    setTimeout(setVerifyModalF, 0, true);
  }
  function onFinishFailed(errorInfo: any) {
    console.log('Failed:', errorInfo);
  }

  return (
    <div
      className="container"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        marginTop: 0,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <div style={{
        background: 'url(https://picsum.photos/1920/1080) no-repeat center',
        position: 'fixed',
        width: '100vw',
        left: 0,
        top: 0,
        bottom: 0,
      }}
      />
      <Form
        labelCol={layout.labelCol}
        wrapperCol={layout.wrapperCol}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ width: '100%' }}
      >
        <Form.Item
          label={<span style={{ color: '#fff' }}>用户名</span>}
          name="name"
          rules={[{ required: true, message: '请输入用户名' }]}
          initialValue="mrrs878"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: '#fff' }}>密码</span>}
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
          initialValue="mrrs878"
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={tailLayout.wrapperCol}>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            登录
          </Button>
        </Form.Item>
      </Form>
      <Modal style={{ padding: 0 }} visible={verifyModalF} centered width="max-content" footer={null} onCancel={() => setVerifyModalF(false)}>
        <MVerify onSuccess={onVerifySuccess} onClose={() => setVerifyModalF(false)} />
      </Modal>
      <Spin spinning={isLogin} />
    </div>
  );
};

export default withRouter(Index);
