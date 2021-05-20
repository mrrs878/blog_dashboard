/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-30 10:04:47
 * @LastEditTime: 2021-04-08 13:07:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/api/user.ts
 */
import ajax from '../tool/ajax';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}/user`;

export const GET_USERS = (): Promise<any> => ajax.get(`${BASE_URL}`);
export const GET_USER = (data: any): Promise<any> => ajax.get(`${BASE_URL}/${data.role}`);
