/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-04-13 10:41:57
 * @LastEditTime: 2021-04-13 10:43:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/config/index.ts
 */
export enum USER_ROLE {
  admin,
  people,
  guest,
}

export const ITEM_STATUS_ARRAY = [
  {
    value: 0,
    label: '启用',
  },
  {
    value: 1,
    label: '停用',
  },
  {
    value: 2,
    label: '删除',
  },
];

export enum ITEM_STATUS {
  enable = 0,
  disable = 1,
  removed = 2,
}

export const MAIN_CONFIG = {
  iconPreviewUrl: 'https://ant.design/components/icon-cn',
};
