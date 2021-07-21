/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 14:31:07
 * @LastEditTime: 2021-07-21 15:41:26
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\interfaces\model.d.ts
 */
interface IMenuItem {
  _id?: number;
  key: string;
  icon?: Object;
  icon_name?: string;
  title: string;
  path: string;
  children?: Array<IMenuItem>;
  sub_menu?: Array<number>;
  parent: string;
  role?: Array<number>;
  status: number;
  position: number;
}

interface IPermissionUrl {
  id: number;
  url: string;
  role: number;
}

interface IUser {
  id: number;
  name: string;
  age: number;
  address: string;
  role: number;
}

interface ITag {
  path: string;
  title: string;
}

interface IArticle {
  _id?: string;
  createTime: string;
  updateTime?: string;
  categories: string;
  title: string;
  content: string;
  tags: string;
  description: string;
  author: string;
  author_id?: string;
  comments?: Array<CommentI>;
  likes?: Array<{ name: string }>;
}

type ErrorType = IJSRunTimeError|IAssetsError;

interface IBaseErrorInfo {
  title: string;
  location: string;
  kind: string;
  type: string;
  errorType: string;
}

interface IJSRunTimeError extends IBaseErrorInfo {
  filename: string;
  position: string;
  stack: string;
  selector: string;
  message: string;
}

interface IAssetsError extends IBaseErrorInfo {
  url: string;
  nodeName: string;
  message: string;
}

interface IAjaxError extends IBaseErrorInfo {
  response: string;
  status: number;
  method: string;
  url: string;
  message: string;
}

interface IPromiseError extends IBaseErrorInfo {
  message: string;
  stack: string;
}
