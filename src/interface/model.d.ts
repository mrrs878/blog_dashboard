interface UserI {
  name: string;
  accessToken: string;
  avatar: string;
  role: number;
}

interface MenuItemI {
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
}

interface DictI {
  id?: number;
  status: number;
  create_time: number;
  label: string;
  label_view: string;
  type: string;
  type_view: string;
  name: string;
  value: number;
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
  sha: string;
  status: number;
  createTime: number;
  category: string;
  category_view: string;
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
  category: string;
  tag: string;
  createTime: string;
  modifyTime?: string;
  watch?: number;
}
