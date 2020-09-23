/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-09-23 20:04:36
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\modules\article.ts
 */
import apis from '../api';
import store, { actions } from '../store';

const { GET_ALL_ARTICLES, GET_ARTICLE, UPDATE_ARTICLE, CREATE_ARTICLE } = apis;

const ARTICLE_MODULE = {
  async getArticles() {
    try {
      const res = await GET_ALL_ARTICLES();
      store.dispatch({ type: actions.UPDATE_ARTICLES, data: res.data || [] });
    } catch (e) {
      console.log(e);
    }
  },
  async getArticle(param: GetArticleReqT) {
    try {
      const res = await GET_ARTICLE(param);
      return res;
    } catch (e) {
      console.log(e);
    }
  },
  async updateArticle(param: UpdateArticleReqI) {
    try {
      const res = await UPDATE_ARTICLE(param);
      return res;
    } catch (e) {
      console.log(e);
    }
  },
  async creatreArticle(param: CreateArticleReqI) {
    try {
      const res = await CREATE_ARTICLE(param);
      return res;
    } catch (e) {
      console.log(e);
    }
  },
};

export default ARTICLE_MODULE;
