/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-10-14 16:23:48
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

interface CreateMenuReqI extends MenuItemI {}

interface UpdateMenuReqI extends MenuItemI {}

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
  tag: string;
  categories: string;
  content: string;
  _id: string;
  description: string;
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

interface UpdateUserInfoReqI extends UserI {}
