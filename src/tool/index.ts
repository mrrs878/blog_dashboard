/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-26 18:21:49
 * @LastEditTime: 2021-04-15 23:22:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/tool/index.ts
 */
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

export function insertBefore<T>(list: T[], from: T, to?: T): T[] {
  const copy = [...list];
  const fromIndex = copy.indexOf(from);
  if (from === to) {
    return copy;
  }
  copy.splice(fromIndex, 1);
  const newToIndex = to ? copy.indexOf(to) : -1;
  if (to && newToIndex >= 0) {
    copy.splice(newToIndex, 0, from);
  } else {
    // 没有 To 或 To 不在序列里，将元素移动到末尾
    copy.push(from);
  }
  return copy;
}

/** 判断是否数组相等 */
export function isEqualBy<T>(a: T[], b: T[], key: keyof T) {
  const aList = a.map((item) => item[key]);
  const bList = b.map((item) => item[key]);

  let flag = true;
  aList.forEach((i, idx) => {
    if (i !== bList[idx]) {
      flag = false;
    }
  });
  return flag;
}

export function isFunction(value: any) {
  return typeof value === 'function';
}
