/*
 * @Author: your name
 * @Date: 2021-02-26 18:23:22
 * @LastEditTime: 2021-02-26 18:25:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/interfaces/index.d.ts
 */
interface RouteConfigI {
  path: string;
  component: any;
  exact?: boolean;
  auth?: boolean;
  fullScreen?: boolean;
}
