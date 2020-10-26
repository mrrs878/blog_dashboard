/*
 * @Author: your name
 * @Date: 2020-10-15 09:49:52
 * @LastEditTime: 2020-10-26 22:26:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\interfaces\ajaxRes.d.ts
 */
interface BaseResI<T> {
  success: boolean;
  code: number;
  data: T;
  msg: string;
}

interface LoginResI extends BaseResI<UserI>{
}
interface GetInfoByTokenResI extends BaseResI<UserI>{
}
interface LogoutResI extends BaseResI<any>{
}
interface GetMenusResI extends BaseResI<Array<MenuItemI>>{
}
interface CreateMenuResI extends BaseResI<MenuItemI> {}

interface UpdateMenuResI extends BaseResI<MenuItemI> {}

interface GetDictsResT extends BaseResI<Array<DictI>>{
}

interface GetDictResT extends BaseResI<DictI>{
}

interface GetDashboardDataResI extends BaseResI<Array<DashboardDataI>>{
}

interface GetArticlesResI extends BaseResI<Array<ArticleI>>{
}

interface GetArticleResI extends BaseResI<ArticleI>{
}

interface UpdateArticleResI extends BaseResI<undefined> {}

interface CreateArticleResI extends BaseResI<undefined> {}

interface GetRepoPathContentResI extends Array<PathContentItemI> {
}

interface GetFileBlogResI extends FileBlobI {}

interface GetCommentsResI extends BaseResI<Array<CommentI>> {}

interface GetAuthorCommentsResI extends BaseResI<Array<AuthorCommentsI>> {}

interface GetCommentResI extends BaseResI<Array<CommentI>> {}

interface GetCommentResI extends BaseResI<CommentI> {}

interface AddCommentResI extends BaseResI<CommentI> {}

interface GetUsersResI extends BaseResI<Array<UserI>> {}

interface UpdateUserInfoResI extends BaseResI<UserI> {}

interface UpdateUserStatusI extends BaseResI<any> {}
