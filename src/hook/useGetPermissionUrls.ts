/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-10-10 19:15:33
 * @LastEditTime: 2021-09-23 20:31:46
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\hook\useGetPermissionUrls.ts
 */
import { message } from 'antd';
import { useEffect } from 'react';
import { useRequest } from '@mrrs878/hooks';
import { GET_PERMISSION_URLS } from '../api/auth';
import { useModel } from '../store';

export default function useGetPermissionUrls(autoMsg = true, authFetch = false) {
  const [, getPermissionUrlsRes, getPermissionUrls] = useRequest(GET_PERMISSION_URLS, authFetch);
  const [, updateMenu] = useModel('permissionUrls');
  useEffect(() => {
    if (!getPermissionUrlsRes) return;
    if (autoMsg) message.info(getPermissionUrlsRes.return_message);
    if (!getPermissionUrlsRes.success) return;
    updateMenu(getPermissionUrlsRes.data);
  }, [getPermissionUrlsRes, autoMsg, updateMenu]);

  return { getPermissionUrlsRes, getPermissionUrls };
}
