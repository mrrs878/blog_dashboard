/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-10-15 09:49:52
 * @LastEditTime: 2021-09-24 19:44:13
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\interfaces\ajaxRes.d.ts
 */
interface BaseResI<T> {
  success: boolean;
  return_code: number;
  data: T;
  return_message: string;
}

interface User extends IUser { token: string }

interface ILoginRes extends BaseResI<User> {
}
interface GetInfoByTokenResI extends BaseResI<IUser> {
}
interface LogoutResI extends BaseResI<any>{
}
interface IGetMenusRes extends BaseResI<Array<IMenuItem>>{
}
interface ICreateMenuRes extends BaseResI<IMenuItem> {}

interface IUpdateMenuRes extends BaseResI<IMenuItem> {}

interface IGetPuzzleImgRes extends BaseResI<{
  background: string,
  block: string,
  session: string
}> {}

interface ICheckPuzzleRes extends BaseResI<any> {}

interface IGetPermissionUrlsRes extends BaseResI<Array<IPermissionUrl>> {}

interface GetDictsResT extends BaseResI<Array<DictI>>{
}

interface GetDictResT extends BaseResI<DictI>{
}

interface GetAuthorCommentsResI extends BaseResI<Array<AuthorCommentsI>> {}

interface GetUsersResI extends BaseResI<Array<IUser>> {}

interface UpdateIUsernfoResI extends BaseResI<IUser> {}

interface UpdateUserStatusI extends BaseResI<any> {}

interface GetArticlesResI extends BaseResI<Array<IArticle>>{
}

interface GetArticleResI extends BaseResI<IArticle>{
}

interface UpdateArticleResI extends BaseResI<undefined> {}

interface CreateArticleResI extends BaseResI<undefined> {}
