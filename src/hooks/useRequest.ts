import { useEffect, useState, useCallback } from 'react';

function useRequest<T, P>(api: (params: P) => Promise<T>, params: P, visible = true) {
  const [res, setRes] = useState({});
  const [loading, setLoading] = useState(false);
  const [newParams, setNewParams] = useState(params);

  const fetch = useCallback(async () => {
    if (visible) {
      setLoading(true);
      const tmp = await api(newParams);
      setRes(tmp);
      setLoading(false);
    }
  }, [api, newParams, visible]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const doFetch = useCallback((rest) => {
    setNewParams(rest);
  }, []);

  const reFetch = () => {
    setNewParams({ ...newParams });
  };
  return [loading, res, doFetch, reFetch];
}

export default useRequest;
