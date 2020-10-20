/*
 * @Author: your name
 * @Date: 2020-09-28 19:20:02
 * @LastEditTime: 2020-10-20 16:48:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\hooks\useRequest.ts
 */
import { useEffect, useState, useCallback } from 'react';

function useRequest<P, T>(api: (params: P) => Promise<T>, params?: P, visiable = true)
  :[boolean, T|undefined, (params?: P) => void, () => void] {
  const [res, setRes] = useState<T>();
  const [loading, setLoading] = useState(() => false);
  const [newParams, setNewParams] = useState(() => params);
  const [autoFetch, setAutoFetch] = useState(() => visiable);

  const fetch = useCallback(async () => {
    if (!newParams && autoFetch === false) return;
    if (autoFetch) {
      const _params = (newParams || {}) as P;
      setLoading(true);
      const tmp = await api(_params);
      setRes(tmp);
      setLoading(false);
    }
  }, [api, autoFetch, newParams]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const doFetch = useCallback((rest = null) => {
    setNewParams(rest);
    setAutoFetch(true);
  }, []);

  return [loading, res, doFetch, fetch];
}

export default useRequest;
