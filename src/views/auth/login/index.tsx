import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';

import userModule from '../../../modules/user';
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
    const res = await userModule.login({ name: values.username, password: values.password });
    await message.info(res.msg);
    if (!res.success) return;
    await authModule.getMenu();
    props.history.replace('/home');
  }
  function onFinishFailed(errorInfo: any) {
    console.log('Failed:', errorInfo);
  }

  return (
    <div className="container" style={{ justifyContent: 'center', marginTop: 0 }}>
      <Form
        labelCol={layout.labelCol}
        wrapperCol={layout.wrapperCol}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
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
