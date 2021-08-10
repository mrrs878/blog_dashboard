/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-09-30 12:40:32
 * @LastEditTime: 2021-08-10 20:04:11
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: d:\Data\Personal\MyPro\blog_dashboard\src\hook\useGetArticles.ts
 */
import { message } from 'antd';
import { useEffect } from 'react';
import { reactHooks } from '@mrrs878/js-library';
import { GET_USER_ARTICLES } from '../api/article';
import { useModel } from '../store';

const { useRequest } = reactHooks;

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
