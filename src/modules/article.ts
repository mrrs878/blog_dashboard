import apis from '../api';
import store, { actions } from '../store';

const { GET_FILE_BLOB, GET_PATH_CONTENT } = apis;

function generateArticleList(source: Array<PathContentItemI>): Array<ArticleI> {
  const articles: Array<ArticleI> = source.map((item) => ({
    sha: item.sha,
    status: 0,
    create_time: 0,
    category: '-',
    category_view: '-',
    title: item.name,
    content: '-',
    tag: '-',
    description: '-',
  }));
  return articles;
}

const ARTICLE_MODULE = {
  async getArticles() {
    try {
      const res = await GET_PATH_CONTENT();
      const data = generateArticleList(res);
      store.dispatch({ type: actions.UPDATE_ARTICLES, data });
    } catch (e) {
      console.log(e);
    }
  },
  async getArticle(param: GetFileBlogReqI) {
    try {
      const res = await GET_FILE_BLOB(param);
      return res;
    } catch (e) {
      console.log(e);
    }
  },
};

export default ARTICLE_MODULE;
