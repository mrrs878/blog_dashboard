/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-04-06 22:37:02
 * @LastEditTime: 2021-09-23 20:47:11
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\view\auth\login.tsx
 */
import {
  Button, Form, Input, message, Modal,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useCallback, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useRequest } from '@mrrs878/hooks';
import { MVerify } from '@mrrs878/sliding-puzzle';
import { CHECK_PUZZLE, GET_PUZZLE_IMG, LOGIN } from '../../api/auth';
import { useFullScreen, useUser } from '../../store';
import style from './login.module.less';

import '@mrrs878/sliding-puzzle/dist/index.css';

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 4 },
};
const tailLayout = {
  wrapperCol: { offset: 10, span: 4 },
};

const onLoginFinish = (props: RouteComponentProps) => {
  if (props.history.length > 0) props.history.goBack();
  else props.history.replace('/');
};

const Login = (props: RouteComponentProps) => {
  const [, fullScreen, exitFullScreen] = useFullScreen();
  const [loginFrom] = useForm();
  const [verifyModalFlag, setVerifyModalFlag] = useState(false);
  const [,, login] = useRequest(LOGIN, false);
  const [puzzleImgLoading, puzzleImgRes, getPuzzleImg, reGetPuzzleImg] = useRequest(
    GET_PUZZLE_IMG,
    false,
  );
  const [,, checkPuzzle] = useRequest(CHECK_PUZZLE, false);
  const [, updateUser] = useUser();

  const onLoginFormFinish = useCallback(() => {
    setVerifyModalFlag(true);
    getPuzzleImg();
  }, [getPuzzleImg]);

  const onPuzzleRelease = useCallback(async (left) => {
    const session = puzzleImgRes?.data.session || '';
    const res = await checkPuzzle({ session, left });
    if (res.return_code === 0) {
      const { username, password } = loginFrom.getFieldsValue();
      const loginRes = await login({ name: username, password });
      if (loginRes.return_code === 0) {
        exitFullScreen();
        updateUser(loginRes.data);
        localStorage.setItem('token', loginRes.data.token);
        setTimeout(onLoginFinish, 500, props);
        setTimeout(setVerifyModalFlag, 800, false);
      } else {
        message.error(loginRes.return_message);
      }
    }
    return Promise.resolve(res.return_code === 0);
  }, [checkPuzzle, exitFullScreen, login,
    loginFrom, props, puzzleImgRes?.data.session, updateUser]);

  useEffect(() => {
    fullScreen();
    return () => {
      exitFullScreen();
    };
  }, [exitFullScreen, fullScreen]);
  return (
    <div className={style.container}>
      <Form
        labelCol={layout.labelCol}
        wrapperCol={layout.wrapperCol}
        form={loginFrom}
        initialValues={{ remember: true }}
        onFinish={onLoginFormFinish}
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
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
      <Modal visible={verifyModalFlag} footer={false} onCancel={() => setVerifyModalFlag(false)}>
        <MVerify
          background={puzzleImgRes?.data.canvas || ''}
          block={puzzleImgRes?.data.block || ''}
          loading={puzzleImgLoading}
          onRelease={onPuzzleRelease}
          onRefresh={() => {
            reGetPuzzleImg();
            return Promise.resolve(true);
          }}
        />
      </Modal>
    </div>
  );
};

export default withRouter(Login);
