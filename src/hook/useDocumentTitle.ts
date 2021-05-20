/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-26 18:21:03
 * @LastEditTime: 2021-02-26 18:21:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/hook/useDocumentTitle.ts
 */
import { useEffect } from 'react';

export default function useDocumentTitle(newTitle: string) {
  useEffect(() => {
    document.title = newTitle;
    return () => {
      document.title = 'hello mrrs';
    };
  });
}
