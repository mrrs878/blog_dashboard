/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-09-23 19:53:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\modules\user.ts
 */
import apis from '../api';
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
      // store.dispatch({ type: actions.UPDATE_USER, data: res.data });
      localStorage.setItem('token', res.data.token);
      return {
        success: true,
        msg: '登陆成功',
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        msg: e.message,
      };
    }
  },
};
