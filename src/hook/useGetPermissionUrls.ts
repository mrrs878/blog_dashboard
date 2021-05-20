/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-10-10 19:15:33
 * @LastEditTime: 2021-04-11 15:50:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\hooks\useGetMenus.ts
 */
import { message } from 'antd';
import { useEffect } from 'react';
import { GET_PERMISSION_URLS } from '../api/auth';
import useRequest from './useRequest';
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
