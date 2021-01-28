/*
 * @Author: your name
 * @Date: 2020-09-30 12:40:32
 * @LastEditTime: 2021-01-18 22:21:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\hooks\useGetDicts.ts
 */
import { message } from 'antd';
import { useEffect } from 'react';
import { GET_DICTS } from '../api/setting';
import store, { actions } from '../store';
import useRequest from './useRequest';

function useGetDicts(autoMsg = true, authMatch: boolean = false): [
  () => void,
  () => void,
  boolean,
] {
  const [getDictsLoading, getDictsRes, getDicts, reGetDicts] = useRequest<GetDictsReqT, GetDictsResT>(GET_DICTS, authMatch);
  useEffect(() => {
    if (!getDictsRes) return;
    if (autoMsg) message.info(getDictsRes.msg);
    if (getDictsRes.success) store.dispatch({ type: actions.UPDATE_DICTS, data: getDictsRes.data || [] });
  }, [getDictsRes, autoMsg]);

  return [getDicts, reGetDicts, getDictsLoading];
}

export default useGetDicts;
