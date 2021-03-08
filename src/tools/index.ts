/*
 * @Author: your name
 * @Date: 2021-02-26 18:21:49
 * @LastEditTime: 2021-03-05 18:29:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/tool/index.ts
 */
import { createFromIconfontCN } from '@ant-design/icons';
import { curry } from 'ramda';
import MAIN_CONFIG from '../config';

export function getCookie(name: string) {
  const strCookie = document.cookie;
  const arrCookie = strCookie.split('; ');
  for (let i = 0; i < arrCookie.length; i += 1) {
    const arr = arrCookie[i].split('=');
    if (arr[0] === name) {
      return arr[1];
    }
  }
  return '';
}

export function setCookie(name: string, value: string, expireTime?: number) {
  if (expireTime) {
    const date = new Date();
    const expiresDays = 10;
    date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000);
    document.cookie = `${name}=${value}; userName=hulk; expires=${date.toUTCString()}`;
  } else document.cookie = `${name}=${value}`;
}

export function createIconFromIconfont() {
  return createFromIconfontCN({
    scriptUrl: MAIN_CONFIG.ICONFONT_URL,
  });
}

export function getLastItem<T>(src: Array<T>) {
  return src.length === 0 ? src[0] : src[src.length - 1];
}

export const isTruth: (value: any) => boolean = curry((value: any) => !!value);
