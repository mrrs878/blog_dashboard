/*
 * @Author: your name
 * @Date: 2020-09-30 12:40:32
 * @LastEditTime: 2021-03-05 18:06:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\hooks\useGetDicts.ts
 */
import { message } from 'antd';
import { useEffect } from 'react';
import { GET_DICTS } from '../api/setting';
import useRequest from './useRequest';
import { useModel } from '../store';

function useGetDicts(autoMsg = true, authMatch: boolean = false): [
  () => void,
  () => void,
  boolean,
] {
  const [getDictsLoading, getDictsRes, getDicts,
    reGetDicts] = useRequest<GetDictsReqT, GetDictsResT>(GET_DICTS, authMatch);
  const [, updateDicts] = useModel('dicts');
  useEffect(() => {
    if (!getDictsRes) return;
    if (autoMsg) message.info(getDictsRes.msg);
    if (getDictsRes.success) updateDicts(getDictsRes.data || []);
  }, [getDictsRes, autoMsg, updateDicts]);

  return [getDicts, reGetDicts, getDictsLoading];
}

export default useGetDicts;
