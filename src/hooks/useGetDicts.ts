/*
 * @Author: your name
 * @Date: 2020-09-30 12:40:32
 * @LastEditTime: 2020-10-10 16:29:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\hooks\useGetDicts.ts
 */
import { message } from 'antd';
import { useEffect } from 'react';
import { GET_DICTS } from '../api/setting';
import store, { actions } from '../store';
import useRequest from './useRequest';

export default function useGetDicts(autoMsg = true) {
  const [, getDictsRes, getDicts] = useRequest<GetDictsReqT, GetDictsResT>(GET_DICTS, undefined, false);
  useEffect(() => {
    if (!getDictsRes) return;
    if (autoMsg) message.info(getDictsRes.msg);
    if (getDictsRes.success) store.dispatch({ type: actions.UPDATE_DICTS, data: getDictsRes.data || [] });
  }, [getDictsRes, autoMsg]);

  return [getDicts];
}
