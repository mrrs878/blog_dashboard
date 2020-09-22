/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-09-22 13:14:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\interface\ajaxReq.d.ts
 */
interface LoginReqI {
  name: string,
  password: string
}
interface GetMenuReqI {
}

interface GetDictsReqT {
}

interface GetDictReqT {
  id: string
}

interface UpdateDictReqT extends DictI {
}

interface CreateDictReqT extends DictI{
}

interface DeleteDictReqT {
  id: number
}

interface GetMenuReqI {
  role: string
}

interface GetDashboardDataReqI {
}

interface GetArticlesReqT {
}

interface GetArticleReqT {
  id: string
}

interface GetFileBlogReqI {
  sha: string;
}

interface UpdateArticleReqI {
  title: string;
  tag: string;
  categories: string;
  content: string;
  _id: string;
  description: string;
}

interface CreateArticleReqI {
  title: string;
  tag: string;
  categories: string;
  content: string;
  description: string;
}
