/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-10-15 09:49:52
 * @LastEditTime: 2021-03-05 17:51:33
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

interface LoginResI extends BaseResI<IUser>{
}
interface GetInfoByTokenResI extends BaseResI<IUser>{
}
interface LogoutResI extends BaseResI<any>{
}
interface GetMenusResI extends BaseResI<Array<IMenuItem>>{
}
interface CreateMenuResI extends BaseResI<IMenuItem> {}

interface UpdateMenuResI extends BaseResI<IMenuItem> {}

interface GetDictsResT extends BaseResI<Array<IDict>>{
}

interface GetDictResT extends BaseResI<IDict>{
}

interface GetDashboardDataResI extends BaseResI<Array<DashboardDataI>>{
}

interface GetArticlesResI extends BaseResI<Array<IArticle>>{
}

interface GetArticleResI extends BaseResI<IArticle>{
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

interface GetUsersResI extends BaseResI<Array<IUser>> {}

interface UpdateUserInfoResI extends BaseResI<IUser> {}

interface UpdateUserStatusI extends BaseResI<any> {}
