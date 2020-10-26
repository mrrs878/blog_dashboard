/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-10-26 23:00:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\tools\index.ts
 */
import { createFromIconfontCN } from '@ant-design/icons/es';
import Mock from 'mockjs';
import { curry } from 'ramda';
import MAIN_CONFIG from '../config';

export function createIconFromIconfont() {
  return createFromIconfontCN({
    scriptUrl: MAIN_CONFIG.ICONFONT_URL,
  });
}

export function createMockRes<T, P>(url: string | RegExp, type: MockMethodT, template: (req: MockReqI<T>) => P) {
  return Mock.mock(url, type, template);
}

export function getLastItem<T>(src: Array<T>) {
  return src.length === 0 ? src[0] : src[src.length - 1];
}

export const isTruth: (value: any) => boolean = curry((value: any) => !!value);
