import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';

import authModule from '../../../modules/auth';

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
  async function onFinish(values: any) {
    console.log('Success:', values.username);
    const res = await authModule.login({ name: values.username, password: values.password });
    await message.info(res?.msg);
    if (!res?.success) return;
    await authModule.getMenu();
    props.history.replace('/main');
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
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: '#fff' }}>密码</span>}
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={tailLayout.wrapperCol}>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default withRouter(Index);
