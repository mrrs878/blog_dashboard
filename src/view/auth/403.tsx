/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-04-11 14:18:47
 * @LastEditTime: 2021-04-12 22:50:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dashboard_template\src\view\auth\403.tsx
 */
import React from 'react';
import style from './403.module.less';

const ForbiddenPage = () => (
  <div className={style.container}>
    <div className={style.errorPageMain}>
      <h3>
        <strong>哦豁</strong>
        您无权访问此页面！
      </h3>
      <div className={style.errorPageActions}>
        <div />
        <div>
          <h4>可以尝试：</h4>
          <ul>
            <li>联系管理员(mrrs878@foxmail.com)</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default ForbiddenPage;
