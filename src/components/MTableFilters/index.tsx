/*
 * @Author: your name
 * @Date: 2021-03-05 17:29:22
 * @LastEditTime: 2021-03-05 18:59:10
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /test/src/components/MTableFilters/index.tsx
 */
export function getTableFilters<T extends { value: number, name: string }>(
  dicts: Array<T>, conditions: (item: T) => Boolean,
) {
  return dicts.filter(conditions).map((item) => ({ value: item.value, text: item.name }));
}

export default {};
