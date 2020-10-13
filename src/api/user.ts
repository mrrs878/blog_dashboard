/*
 * @Author: your name
 * @Date: 2020-10-13 16:47:58
 * @LastEditTime: 2020-10-13 17:28:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\api\user.ts
 */
import ajax from '../tools/ajax';

const BASE_URL = process.env.REACT_APP_BASE_URL || '/';

export const GET_ALL_USERS = (): Promise<GetUsersResI> => ajax.get(`${BASE_URL}/user`);
