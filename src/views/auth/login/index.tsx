import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Form, Input, Button, message, Modal } from 'antd';

import authModule from '../../../modules/auth';
import MVerify from '../../../components/MVerify';

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

  async function onVerifySuccess() {
    const { name, password } = accountInfo;
    const res = await authModule.login({ name, password });
    await message.info(res?.msg);
    if (!res?.success) return;
    await authModule.getMenu();
    props.history.replace('/main');
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
    <div className="container" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', width: '100%', height: '100%', marginTop: 0 }}>
      <div style={{
        background: 'url(https://mrrsblog.oss-cn-shanghai.aliyuncs.com/timg.jpg) no-repeat center',
        position: 'fixed',
        width: '100vw',
        left: 0,
        top: 0,
        bottom: 70,
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
      <Modal style={{ padding: 0 }} visible={verifyModalF} width="max-content" footer={null} onCancel={() => setVerifyModalF(false)}>
        <MVerify onSuccess={onVerifySuccess} />
      </Modal>
    </div>
  );
};

export default withRouter(Index);
