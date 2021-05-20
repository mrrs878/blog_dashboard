/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-26 18:23:22
 * @LastEditTime: 2021-04-23 18:38:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/interfaces/index.d.ts
 */
interface IRouteConfig {
  path: string;
  component: any;
  exact?: boolean;
  auth?: boolean;
  fullScreen?: boolean;
}

interface IExceptionSentryConfig {
  url: string;
}
