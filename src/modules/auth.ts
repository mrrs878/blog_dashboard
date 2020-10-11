/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-10-11 20:04:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\modules\auth.ts
 */
import { clone } from 'ramda';
import store, { actions } from '../store';
import MAIN_CONFIG from '../config';
import { GET_MENUS, LOGIN, LOGOUT, UPDATE_MENU } from '../api/auth';

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
  return res;
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

const AUTH_MODULE = {
  async login(data: LoginReqI) {
    try {
      const res = await LOGIN(data);
      if (!res.success) return;
      localStorage.setItem(MAIN_CONFIG.TOKEN_NAME, res.data.token);
      store.dispatch({ type: actions.UPDATE_USER, data: res.data });
      return res;
    } catch (e) {
      console.log(e);
    }
  },
  async logout(): Promise<ModuleResultI<string>> {
    try {
      const res = await LOGOUT();
      console.log(res);
      if (!res.success) {
        return {
          success: true,
          msg: res.msg,
        };
      }
      localStorage.removeItem(MAIN_CONFIG.TOKEN_NAME);
      store.dispatch({ type: actions.CLEAR_USER, data: '' });
      return {
        success: true,
        msg: res.msg,
      };
    } catch (e) {
      console.log(e);
      return {
        success: true,
        msg: '出错了',
      };
    }
  },
  menuArray2Tree,
  async getMenu() {
    try {
      const res = await GET_MENUS();
      if (!res.success) return;
      store.dispatch({ type: actions.UPDATE_MENU_TITLES, data: getMenuTitles(res.data) });
      store.dispatch({ type: actions.UPDATE_MENU_ROUTES, data: getMenuRoutes(res.data) });
      store.dispatch({ type: actions.UPDATE_MENU, data: menuArray2Tree(res.data) });
      store.dispatch({ type: actions.UPDATE_MENU_ARRAY, data: res.data });
    } catch (e) {
      console.log(e);
    }
  },
  async updateMenu(data: UpdateMenuReqI) {
    try {
      const res = await UPDATE_MENU(data);
      if (!res.success) return;
      await this.getMenu();
    } catch (e) {
      console.log(e);
    }
  },
};

export default AUTH_MODULE;
