/*
 * @Author: your name
 * @Date: 2020-10-10 19:15:33
 * @LastEditTime: 2021-03-08 22:35:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\hooks\useGetMenus.ts
 */
import { message } from 'antd';
import { useEffect } from 'react';
import { clone } from 'ramda';
import { GET_MENUS } from '../api/auth';
import useRequest from './useRequest';
import { useModel } from '../store';

function menuArray2Tree(src: Array<IMenuItem>) {
  const res: Array<IMenuItem> = [];
  const tmp: Array<IMenuItem> = clone<Array<IMenuItem>>(src);
  tmp.forEach((item) => {
    const parent = tmp.find((_item) => _item.key === item.parent);
    if (parent) {
      parent.children = parent.children || [];
      parent.children?.push(item);
    } else res.push(item);
  });
  return res.filter(({ parent }) => parent === 'root').sort((a, b) => a.position - b.position);
}

function getMenuTitles(src: Array<IMenuItem>) {
  const menuTitles: Record<string, string> = {};
  src.forEach((item) => {
    menuTitles[item.path] = item.title;
  });
  return menuTitles;
}

function getMenuRoutes(src: Array<IMenuItem>) {
  const menuRoutes: Record<string, string> = {};
  src.forEach((item) => {
    menuRoutes[item.key] = item.path;
  });
  return menuRoutes;
}

export default function useGetMenu(autoMsg = true, authFetch = false) {
  const [, getMenusRes, getMenus] = useRequest(GET_MENUS, authFetch);
  const [, updateMenu] = useModel('menu');
  const [, updateMenuTree] = useModel('menuTree');
  const [, updateMenuRoutes] = useModel('menuRoutes');
  const [, updateMenuTitles] = useModel('menuTitles');
  useEffect(() => {
    if (!getMenusRes) return;
    if (autoMsg) message.info(getMenusRes.msg);
    if (!getMenusRes.success) return;
    updateMenuTitles(getMenuTitles(getMenusRes.data));
    updateMenuRoutes(getMenuRoutes(getMenusRes.data));
    updateMenu(getMenusRes.data.filter(({ status }) => status !== 2));
    updateMenuTree(menuArray2Tree(getMenusRes.data.filter(({ status }) => status !== 2)));
  }, [getMenusRes, autoMsg, updateMenuTitles, updateMenuRoutes, updateMenu, updateMenuTree]);

  return { getMenusRes, getMenus };
}
