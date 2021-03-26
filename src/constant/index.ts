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
