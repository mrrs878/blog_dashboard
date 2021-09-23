/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-09-30 12:40:32
 * @LastEditTime: 2021-09-23 20:29:40
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\hook\useGetArticles.ts
 */
import { message } from 'antd';
import { useEffect } from 'react';
import { useRequest } from '@mrrs878/hooks';
import { GET_USER_ARTICLES } from '../api/article';
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
