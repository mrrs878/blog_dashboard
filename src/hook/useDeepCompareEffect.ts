/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-29 23:17:20
 * @LastEditTime: 2021-03-29 23:18:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dashboard_template\src\hook\useDeepCompareEffect.ts
 */
import {
  DependencyList, EffectCallback, useEffect, useRef,
} from 'react';

import isEqual from 'react-fast-compare';

const isPrimitive = (val:any) => val !== Object(val);

export default function useDeepCompareEffect(effect:EffectCallback, deps:any[]) {
  if (!deps || !deps.length) {
    console.warn('deps 里面不能没有数据');
  }

  if (deps.every(isPrimitive)) {
    console.warn('原始类型的值,使用useEffect来替代吧');
  }

  const ref = useRef<DependencyList | undefined>(undefined);

  if (!isEqual(deps, ref.current)) {
    ref.current = deps;
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, ref.current);
}
