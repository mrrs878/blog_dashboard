/*
 * @Author: your name
 * @Date: 2020-09-30 12:40:32
 * @LastEditTime: 2020-09-30 14:11:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\hooks\useGetArticles.ts
 */
import { message } from 'antd';
import { useEffect } from 'react';
import { GET_ALL_ARTICLES } from '../api/article';
import store, { actions } from '../store';
import useRequest from './useRequest';

export default function useGetArticles(autoMsg = true) {
  const [, getArticlesRes, getArticles] = useRequest<GetArticlesReqT, GetArticlesResI>(GET_ALL_ARTICLES, undefined, false);
  useEffect(() => {
    if (!getArticlesRes) return;
    if (autoMsg) message.info(getArticlesRes.msg);
    if (getArticlesRes.success) store.dispatch({ type: actions.UPDATE_ARTICLES, data: getArticlesRes.data });
  }, [getArticlesRes, autoMsg]);

  return [getArticles];
}
