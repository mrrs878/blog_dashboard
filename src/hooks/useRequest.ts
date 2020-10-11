/*
 * @Author: your name
 * @Date: 2020-09-28 19:20:02
 * @LastEditTime: 2020-10-11 19:52:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\hooks\useRequest.ts
 */
import { useEffect, useState, useCallback } from 'react';

function useRequest<P, T>(api: (params: P) => Promise<T>, params?: P|undefined, visiable = true)
  :[boolean, T|undefined, Function, Function] {
  const [res, setRes] = useState<T>();
  const [loading, setLoading] = useState(() => false);
  const [newParams, setNewParams] = useState<P|undefined>(() => params);
  const [autoFetch, setAutoFetch] = useState(() => visiable);

  const fetch = useCallback(async () => {
    if (autoFetch) {
      if (newParams === undefined) return;
      setLoading(true);
      const tmp = await api(newParams);
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

  const reFetch = () => {
    const _newParams = newParams as any;
    setNewParams({ ..._newParams });
  };

  return [loading, res, doFetch, reFetch];
}

export default useRequest;
