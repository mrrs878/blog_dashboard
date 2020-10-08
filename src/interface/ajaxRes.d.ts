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

interface UpdateArticleResI extends ArticleI {}

interface GetCommentsResI extends BaseResI<Array<CommentI>> {}

interface GetCommentResI extends BaseResI<Array<CommentI>> {}

interface GetCommentResI extends BaseResI<CommentI> {}

interface AddCommentResI extends BaseResI<CommentI> {}
