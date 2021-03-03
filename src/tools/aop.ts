/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-10-10 10:03:18
 * @LastEditTime: 2020-10-10 10:06:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\tools\aop.ts
 */
export function before(this: any, fn: Function) {
  if (typeof fn !== 'function') throw new TypeError('fn must be a function');
  const that = this;
  return (...args: Array<any>) => {
    const res = fn && fn.apply(this, args);
    if (!res) return () => {};
    return that.apply(this, args);
  };
}

export function after(this: any, fn: Function) {
  if (typeof fn !== 'function') throw new TypeError('fn must be a function');
  const that = this;
  return (...args: Array<any>) => {
    const tmp = that.call(this, args);
    if (tmp === false) return fn && fn.apply(this, args);
    return tmp;
  };
}
