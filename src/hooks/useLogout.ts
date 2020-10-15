/*
 * @Author: your name
 * @Date: 2020-10-12 14:42:20
 * @LastEditTime: 2020-10-15 23:03:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\hooks\useLogout.ts
 */
import { message } from 'antd';
import { useEffect } from 'react';
import { LOGOUT } from '../api/auth';
import { ROUTES_MAP } from '../router';
import useRequest from './useRequest';

function useLogout() {
  const [, logoutRes, logout] = useRequest<unknown, LogoutResI>(LOGOUT, undefined, false);
  useEffect(() => {
    if (!logoutRes) return;
    message.info(logoutRes.msg);
    if (logoutRes.success) {
      window.location.href = ROUTES_MAP.login;
    }
  }, [logoutRes]);

  return [logoutRes, logout];
}

export default useLogout;
