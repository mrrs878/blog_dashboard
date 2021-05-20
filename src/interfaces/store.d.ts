/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 09:45:17
 * @LastEditTime: 2021-05-20 14:15:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/interfaces/index.d.ts
 */
interface IUser {
  name: string;
  age: number;
}

interface IState {
  fullScreen: boolean;
  user: IUser;
  addresses?: Array<string>;
  menu: Array<IMenuItem>;
  menuArray: Array<IMenuItem>,
  menuRoutes: Record<string, string>;
  menuTitles: Record<string, string>;
  permissionUrls: Array<IPermissionUrl>;
  tags: Array<ITag>,
  articles: Array<IArticle>;
}

interface IActions<T extends Actions, P> {
  type: T;
  data: P;
}
