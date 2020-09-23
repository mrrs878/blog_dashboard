/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-09-23 19:48:01
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\model\User.ts
 */
import { USER_ROLE } from '../constant';

class User implements UserI {
  token: string;

  avatar: string;

  role: number;

  name: string;

  constructor(token = '', avatar = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    name = '请登录', role = USER_ROLE.guest) {
    this.token = token;
    this.avatar = avatar;
    this.name = name;
    this.role = role;
  }
}

export default User;
