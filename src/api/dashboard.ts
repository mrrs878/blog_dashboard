/*
 * @Author: your name
 * @Date: 2021-03-05 17:25:09
 * @LastEditTime: 2021-03-05 17:28:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /test/src/api/dashboard.ts
 */
import ajax from '../tools/ajax';

const BASE_URL = `${process.env.REACT_APP_BASE_URL || ''}/dashboard`;

export const GET_DASHBOARD_DATA = (): Promise<GetDashboardDataResI> => ajax.get(`${BASE_URL}`);

export default {};
