/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-01-13 22:32:05
 * @LastEditTime: 2021-01-13 22:34:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\api\mockApi.ts
 */
import ajax from '../tools/ajax';

const BASE_URL = `${process.env.REACT_APP_BASE_URL || ''}/mockApi`;

export const GET_MOCK_APIS = (): Promise<any> => ajax.get(`${BASE_URL}/all/0`);
export const GET_MOCK_API = (data: any): Promise<any> => ajax.get(`${BASE_URL}/${data.id}`);
