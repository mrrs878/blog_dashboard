/*
 * @Author: mrrs878
 * @LastEditors: Please set LastEditors
 */
import ajax from '../tools/ajax';

const BASE_URL = `${process.env.REACT_APP_BASE_URL || ''}/auth`;

export const LOGIN = (data: LoginReqI): Promise<LoginResI> => ajax.post(`${BASE_URL}/login`, data);
export const LOGOUT = (): Promise<LoginResI> => ajax.post(`${BASE_URL}/logout`);
export const GET_MENUS = (): Promise<GetMenusResI> => ajax.get(`${BASE_URL}/menu`);
export const GET_MENU = (data: GetMenuReqI): Promise<GetMenusResI> => ajax.get(`${BASE_URL}/menu/${data.role}`);
export const UPDATE_MENU = (data: UpdateMenuReqI): Promise<UpdateMenuResI> => ajax.put(`${BASE_URL}/menu/${data._id}`, data);
export const CREATE_MENU = (data: CreateMenuReqI): Promise<CreateMenuResI> => ajax.post(`${BASE_URL}/menu`, data);
export const GET_INFO_BY_TOKEN = (): Promise<GetInfoByTokenResI> => ajax.get(`${BASE_URL}/info`);
export const UPDATE_USER_STATUS = (data: UpdateUserStatusReqI): Promise<UpdateUserStatusI> => ajax.put(`${BASE_URL}/user`, data);
