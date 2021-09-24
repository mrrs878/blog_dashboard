/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-26 18:23:22
 * @LastEditTime: 2021-09-24 10:53:20
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\interfaces\index.d.ts
 */
interface IRouteConfig {
  path: string;
  component: React.LazyExoticComponent<any>;
  exact?: boolean;
  auth?: boolean;
  fullScreen?: boolean;
}

interface IExceptionSentryConfig {
  url: string;
}
