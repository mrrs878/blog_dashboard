/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-10-10 18:53:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\config\index.ts
 */
const MAIN_CONFIG = {
  TOKEN_NAME: 'token',
  ICONFONT_URL: 'https://at.alicdn.com/t/font_1814014_dlu1crv75b.js',
  ICON_PREVIEW_URL: 'https://ant.design/components/icon-cn',
  APP_NAME: 'MyDashboard',
  FULL_SCREEN_PAGE: ['/auth/login', '/auth/reg'],
  API_WHITE_LIST: [`${process.env.REACT_APP_BASE_URL}/auth/login`],
};

export default MAIN_CONFIG;
