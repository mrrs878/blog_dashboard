/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-30 23:35:48
 * @LastEditTime: 2021-03-30 23:43:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dashboard_template\src\hook\useThrottle.ts
 */
import { useRef } from 'react';

export default function useThrottle(fn: any, delay = 1000) {
  const { current } = useRef<any>({});// 用于防止其他hook导致的重新渲染
  return (...args: any) => {
    if (!current?.timer) {
      current.timer = setTimeout(() => {
        delete current.timer;
      }, delay);
      fn(...args);
    }
  };
}
