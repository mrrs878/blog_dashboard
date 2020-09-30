/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-09-30 12:02:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\api\article.ts
 */
import ajax from '../tools/ajax';

const BASE_URL = process.env.REACT_APP_BASE_URL || '/';

export const GET_ALL_ARTICLES = (): Promise<GetArticlesResI> => ajax.get(`${BASE_URL}/article`);
export const GET_ARTICLE = (param: GetArticleReqT): Promise<GetArticleResI> => ajax.get(`${BASE_URL}/article/${param.id}`);
export const UPDATE_ARTICLE = (data: UpdateArticleReqI): Promise<UpdateArticleResI> => ajax.put(`${BASE_URL}/article/${data._id}`, data);
export const CREATE_ARTICLE = (data: CreateArticleReqI): Promise<CreateArticleResI> => ajax.post(`${BASE_URL}/article`, data);
