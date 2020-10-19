/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-10-19 11:48:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\interface\model.d.ts
 */
interface UserI {
  _id: string;
  name: string;
  role: number;
  token: string;
  avatar: string;
  createdBy: number;
  profession: string;
  signature: string;
  department: string;
  address: string;
  tags: Array<string>;
  status: number;
  teams: Array<string>;
  updateTime?: string;
  createTime: string;
}

interface MenuItemI {
  _id?: string;
  key: string;
  icon?: Object;
  icon_name?: string;
  title: string;
  path: string;
  children?: Array<MenuItemI>;
  sub_menu: Array<string>;
  parent: string;
  role?: Array<number>;
  status: number;
  position: number;
}

interface DictI {
  _id?: string;
  status: number;
  label: string;
  label_view: string;
  type: string;
  type_view: string;
  name: string;
  name_view: string;
  value: number;
  createTime?: string;
  updateTime?: string;
  creator?: {
    name: string;
  };
  updater?: {
    name: string;
  };
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
  tags: string;
  description: string;
  author: string;
  comments?: Array<CommentI>;
  likes?: Array<{ name: string }>;
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

interface CommentI {
  name: string;
  content: string;
  user_id: string;
  article_id: string;
  _id: string;
  createTime: string;
  avatar?: string;
}

interface AuthorCommentsI {
  _id: string;
  content: string;
  name: string;
  createTime: string;
  article: {
    title: string;
    categories: string;
    author: string;
    createTime: string;
  },
  creator: {
    name: string;
  }
}
