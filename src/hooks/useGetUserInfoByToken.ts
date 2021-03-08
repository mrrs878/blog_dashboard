/*
 * @Author: your name
 * @Date: 2020-10-10 17:33:25
 * @LastEditTime: 2021-03-05 17:44:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\hooks\useGetUserInfoByToken.ts
 */
import { message } from 'antd';
import { useEffect } from 'react';
import { GET_INFO_BY_TOKEN } from '../api/auth';
import useRequest from './useRequest';
import { useModel } from '../store';

export default function useGetUserInfoByToken(autoMsg = true) {
  const [, getInfoRes, getInfo] = useRequest<unknown, GetInfoByTokenResI>(GET_INFO_BY_TOKEN);
  const [, updateUser] = useModel('user');
  useEffect(() => {
    if (!getInfoRes) return;
    if (autoMsg) message.info(getInfoRes.msg);
    if (getInfoRes.success) updateUser(getInfoRes.data);
  }, [getInfoRes, autoMsg, updateUser]);

  return [getInfo];
}
