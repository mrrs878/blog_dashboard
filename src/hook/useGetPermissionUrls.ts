/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-10-10 19:15:33
 * @LastEditTime: 2021-08-10 20:02:17
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: d:\Data\Personal\MyPro\blog_dashboard\src\hook\useGetPermissionUrls.ts
 */
import { message } from 'antd';
import { useEffect } from 'react';
import { reactHooks } from '@mrrs878/js-library';
import { GET_PERMISSION_URLS } from '../api/auth';
import { useModel } from '../store';

const { useRequest } = reactHooks;

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
