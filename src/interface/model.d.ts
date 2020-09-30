/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-09-30 12:23:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\interface\model.d.ts
 */
interface UserI {
  name: string;
  token: string;
  avatar: string;
  role: number;
}

interface MenuItemI {
  _id?: string;
  key: string;
  icon?: Object;
  icon_name?: string;
  title: string;
  path: string;
  children: Array<MenuItemI>;
  sub_menu: Array<string>;
  parent: string;
  role?: Array<number>;
  status: number;
}

interface DictI {
  _id?: string;
  status: number;
  label: string;
  label_view: string;
  type: string;
  type_view: string;
  name: string;
  value: number;
  createTime?: string;
  updateTime?: string;
}

interface AjaxErrorI extends Error{
  date: number;
  data: any;
  url: string;
  referer: string;
  method: string;
  status: number;
}

interface CommonErrorI extends Error{
  date: number;
}

interface DashboardDataI {
  group: string;
  label: string;
  key: string;
  value: number;
}

interface ArticleI {
  _id?: string;
  createTime: string;
  updateTime?: string;
  categories: string;
  title: string;
  content: string;
  tag: string;
  description: string;
}

interface PathContentItemI {
  type: string;
  size: number;
  name: string;
  path: string;
  sha: string;
  url: string;
  html_url: string;
  download_url: string;
}

interface FileBlobI {
  sha: string;
  size: number;
  url: string;
  content: string;
  encoding: string;
}

interface ArticleSubI {
  title: string;
  description?: string;
  categories: string;
  tag: string;
  createTime: string;
  modifyTime?: string;
  watch?: number;
}
