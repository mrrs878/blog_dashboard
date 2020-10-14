/*
 * @Author: your name
 * @Date: 2020-10-10 17:33:25
 * @LastEditTime: 2020-10-14 23:15:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\hooks\useGetUserInfoByToken.ts
 */
import { message } from 'antd';
import { useEffect } from 'react';
import { GET_INFO_BY_TOKEN } from '../api/auth';
import store, { actions } from '../store';
import useRequest from './useRequest';

export default function useGetUserInfoByToken(autoMsg = true, authFetch = true) {
  const [, getInfoRes, getInfo] = useRequest<unknown, GetInfoByTokenResI>(GET_INFO_BY_TOKEN, {});
  useEffect(() => {
    if (!getInfoRes) return;
    if (autoMsg) message.info(getInfoRes.msg);
    if (getInfoRes.success) store.dispatch({ type: actions.UPDATE_USER, data: getInfoRes.data || [] });
  }, [getInfoRes, autoMsg]);

  return [getInfo];
}
