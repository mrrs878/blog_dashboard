/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-10-30 16:45:20
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

interface CreateMenuReqI extends IMenuItem {}

interface UpdateMenuReqI extends IMenuItem {}

interface GetDictsReqT {
}

interface GetDictReqT {
  id: string
}

interface UpdateDictReqT extends IDict {
}

interface CreateDictReqT extends IDict{
}

interface DeleteDictReqT {
  id: number
}

interface GetMenuReqI {
  role: string
}

interface GetDashboardDataReqI {
}

interface GetArticleReqI {
  id: string
}

interface GetArticlesReqI {
}

interface GetFileBlogReqI {
  sha: string;
}

interface UpdateArticleReqI {
  title: string;
  tags: string;
  categories: string;
  content: string;
  _id: string;
  description: string;
}

interface UpdateArticleStatusReqI {
  status: number;
  _id: string;
}

interface CreateArticleReqI {
  title: string;
  tags: string;
  categories: string;
  content: string;
  description: string;
}

interface GetCommentReqI {
  id: string
}

interface AddCommentReqI {
  name: string;
  user_id: string;
  content: string;
  article_id: string;
  avatar: string;
}

interface GetCommentsReqI {
  id: string;
}

interface GetCommentReqI {
  id: string;
}

interface UpdateUserInfoReqI {
  name: string;
  role: number;
  avatar: string;
  createdBy: number;
  profession: string;
  signature: string;
  department: string;
  address: string;
  tags: Array<string>;
  teams: Array<string>;
}

interface UpdateUserStatusReqI {
  status: number;
  userId: string;
}
