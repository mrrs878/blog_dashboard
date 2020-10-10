/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-10-10 18:47:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\modules\user.ts
 */
import apis from '../api';
import MAIN_CONFIG from '../config';
import store, { actions } from '../store';

const { GET_INFO_BY_TOKEN, LOGIN } = apis;

export default {
  async getInfoByToken() {
    try {
      const res = await GET_INFO_BY_TOKEN();
      if (!res.success) return;
      store.dispatch({ type: actions.UPDATE_USER, data: res.data });
    } catch (e) {
      console.log(e);
    }
  },
  async login(data: LoginReqI): Promise<ModuleResI> {
    try {
      const res = await LOGIN(data);
      if (!res.success) {
        return {
          success: false,
          msg: res.msg,
        };
      }
      store.dispatch({ type: actions.UPDATE_USER, data: res.data });
      localStorage.setItem('token', res.data.token);
      return {
        success: true,
        msg: res.msg,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        msg: e.message,
      };
    }
  },
  logout() {
    localStorage.removeItem(MAIN_CONFIG.TOKEN_NAME);
    return {
      success: true,
      msg: '退出成功',
    };
  },
};
