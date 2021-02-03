/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2021-02-03 15:29:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\tools\index.ts
 */
import { createFromIconfontCN } from '@ant-design/icons';
import { curry } from 'ramda';
import MAIN_CONFIG from '../config';

export function createIconFromIconfont() {
  return createFromIconfontCN({
    scriptUrl: MAIN_CONFIG.ICONFONT_URL,
  });
}

export function getLastItem<T>(src: Array<T>) {
  return src.length === 0 ? src[0] : src[src.length - 1];
}

export const isTruth: (value: any) => boolean = curry((value: any) => !!value);
