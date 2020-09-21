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
  category: string;
  content: string;
  _id: string;
}
