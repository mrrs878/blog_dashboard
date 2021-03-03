/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-10-14 19:54:48
 * @LastEditTime: 2020-10-30 17:52:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\model\index.ts
 */
export const EMPTY_USER: UserI = {
  _id: '',
  name: '',
  role: -1,
  token: '',
  avatar: '',
  createdBy: -1,
  signature: '--',
  department: '--',
  address: '--',
  profession: '--',
  tags: [],
  teams: [],
  status: 0,
  updateTime: '',
  createTime: '',
};

export const EMPTY_ARTICLE: ArticleI = { title: '', categories: '', tags: '', content: '', createTime: '', description: '', author: '', _id: '' };
