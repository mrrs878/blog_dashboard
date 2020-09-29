import { useEffect, useState, useCallback } from 'react';

function useRequest<P, T>(api: (params: P) => Promise<T>, params?: P|undefined, visiable = true)
  :[boolean, T|undefined, Function, Function] {
  const [res, setRes] = useState<T>();
  const [loading, setLoading] = useState(false);
  const [autoFetch, setAutoFetch] = useState(visiable);
  const [newParams, setNewParams] = useState<P|undefined>(params);

  const fetch = useCallback(async () => {
    if (autoFetch && newParams) {
      setLoading(true);
      const tmp = await api(newParams);
      setRes(tmp);
      setLoading(false);
    }
  }, [api, newParams, autoFetch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const doFetch = useCallback((rest) => {
    setAutoFetch(true);
    setNewParams(rest);
  }, []);

  const reFetch = () => {
    if (newParams) setNewParams({ ...newParams });
  };
  return [loading, res, doFetch, reFetch];
}

export default useRequest;
