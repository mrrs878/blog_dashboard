/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-09-30 12:40:32
 * @LastEditTime: 2021-05-20 14:16:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\hooks\useGetArticles.ts
 */
import { message } from 'antd';
import { useEffect } from 'react';
import { GET_USER_ARTICLES } from '../api/article';
import useRequest from './useRequest';
import { useModel } from '../store';

export default function useGetArticles(autoMsg = true, autoFetch = false) {
  const [getArticlesLoading, getArticlesRes,
    getArticles, reGetArticles] = useRequest(GET_USER_ARTICLES, autoFetch);
  const [, updateArticles] = useModel('articles');
  useEffect(() => {
    if (!getArticlesRes) return;
    if (autoMsg) message.info(getArticlesRes?.return_message);
    if (getArticlesRes.success) updateArticles(getArticlesRes.data || []);
  }, [getArticlesRes, autoMsg, updateArticles]);

  return {
    getArticlesLoading, getArticlesRes, getArticles, reGetArticles,
  };
}
