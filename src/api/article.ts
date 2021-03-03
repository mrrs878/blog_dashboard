/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-11-02 22:44:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\api\article.ts
 */
import ajax from '../tools/ajax';

const BASE_URL = process.env.REACT_APP_BASE_URL || '/';

export const GET_ALL_ARTICLES = (): Promise<GetArticlesResI> => ajax.get(`${BASE_URL}/article/all/1`);
export const GET_USER_ARTICLES = (): Promise<GetArticlesResI> => ajax.get(`${BASE_URL}/article/user/0`);
export const GET_ARTICLE = (param: GetArticleReqI): Promise<GetArticleResI> => ajax.get(`${BASE_URL}/article/${param.id}`);
export const UPDATE_ARTICLE = (data: UpdateArticleReqI): Promise<UpdateArticleResI> => ajax.put(`${BASE_URL}/article`, data);
export const UPDATE_ARTICLE_STATUS = (data: UpdateArticleStatusReqI): Promise<UpdateArticleResI> => ajax.put(`${BASE_URL}/article`, data);
export const CREATE_ARTICLE = (data: CreateArticleReqI): Promise<CreateArticleResI> => ajax.post(`${BASE_URL}/article`, data);
