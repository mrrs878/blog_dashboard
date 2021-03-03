/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-09-28 19:20:02
 * @LastEditTime: 2020-12-09 15:38:09
 * @LastEditors: mrrs878
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\hooks\useRequest.ts
 */
import { useEffect, useState, useCallback } from 'react';

function useRequest<P, T>(api: (params: P) => Promise<T>, visible = true, params?: P)
  :[boolean, T|undefined, (params?: P) => void, () => void] {
  const [res, setRes] = useState<T>();
  const [loading, setLoading] = useState(() => false);
  const [newParams, setNewParams] = useState(() => params);
  const [autoFetch, setAutoFetch] = useState(() => visible);

  const fetch = useCallback(async () => {
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
