/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2021-03-05 17:27:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\api\setting.ts
 */
import ajax from '../tools/ajax';

const BASE_URL = `${process.env.REACT_APP_BASE_URL || ''}`;

export const GET_DICTS = (): Promise<GetDictsResT> => ajax.get(`${BASE_URL}/dict`);
export const GET_DICT = (data: GetDictReqT): Promise<GetDictResT> => ajax.get(`${BASE_URL}/dict/${data.id}`);
export const UPDATE_DICT = (data: UpdateDictReqT): Promise<GetDictResT> => ajax.put(`${BASE_URL}/dict/${data._id}`, data);
export const CREATE_DICT = (data: CreateDictReqT): Promise<GetDictResT> => ajax.post(`${BASE_URL}/dict`, data);
export const DELETE_DICT = (data: DeleteDictReqT): Promise<GetDictResT> => ajax.delete(`${BASE_URL}/dict${data.id}`);
