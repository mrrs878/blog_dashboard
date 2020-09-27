/*
 * @Author: mrrs878
 * @LastEditors: mrrs878
 */
import ajax from '../tools/ajax';

const BASE_URL = `${process.env.REACT_APP_BASE_URL || ''}/auth`;

export const LOGIN = (data: LoginReqI): Promise<LoginResI> => ajax.post(`${BASE_URL}/login`, data);
export const LOGOUT = (): Promise<LoginResI> => ajax.post(`${BASE_URL}/logout`);
export const GET_MENUS = (): Promise<GetMenusResI> => ajax.get(`${BASE_URL}/menu`);
export const GET_MENU = (data: GetMenuReqI): Promise<GetMenusResI> => ajax.get(`${BASE_URL}/menu/${data.role}`);
export const UPDATE_MENU = (data: UpdateMenuReqI): Promise<UpdateMenuResI> => ajax.put(`${BASE_URL}/menu/${data._id}`, data);
