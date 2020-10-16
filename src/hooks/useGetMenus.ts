/*
 * @Author: your name
 * @Date: 2020-10-10 19:15:33
 * @LastEditTime: 2020-10-16 12:45:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\hooks\useGetMenus.ts
 */
import { message } from 'antd';
import { useEffect } from 'react';
import { clone } from 'ramda';
import { GET_MENUS } from '../api/auth';
import store, { actions } from '../store';
import useRequest from './useRequest';

function menuArray2Tree(src: Array<MenuItemI>) {
  const res: Array<MenuItemI> = [];
  const tmp: Array<MenuItemI> = clone<Array<MenuItemI>>(src);
  tmp.forEach((item) => {
    const parent = tmp.find((_item) => _item.key === item.parent);
    if (parent) {
      parent.children = parent.children || [];
      parent.children?.push(item);
    } else res.push(item);
  });
  return res.filter(({ parent }) => parent === 'root').sort((a, b) => a.position - b.position);
}

function getMenuTitles(src: Array<MenuItemI>) {
  const menuTitles: DynamicObjectKey<string> = {};
  src.forEach((item) => {
    menuTitles[item.path] = item.title;
  });
  return menuTitles;
}

function getMenuRoutes(src: Array<MenuItemI>) {
  const menuRoutes: DynamicObjectKey<string> = {};
  src.forEach((item) => {
    menuRoutes[item.key] = item.path;
  });
  return menuRoutes;
}

export default function useGetMenus(autoMsg = true, authFetch = false) {
  const [, getMenusRes, getMenus] = useRequest<unknown, GetMenusResI>(GET_MENUS, undefined, authFetch);
  useEffect(() => {
    if (!getMenusRes) return;
    if (autoMsg) message.info(getMenusRes.msg);
    if (!getMenusRes.success) return;
    store.dispatch({ type: actions.UPDATE_MENU_TITLES, data: getMenuTitles(getMenusRes.data) });
    store.dispatch({ type: actions.UPDATE_MENU_ROUTES, data: getMenuRoutes(getMenusRes.data) });
    store.dispatch({ type: actions.UPDATE_MENU, data: menuArray2Tree(getMenusRes.data.filter(({ status }) => status !== 2)) });
    store.dispatch({ type: actions.UPDATE_MENU_ARRAY, data: getMenusRes.data });
  }, [getMenusRes, autoMsg]);

  return { getMenusRes, getMenus };
}
