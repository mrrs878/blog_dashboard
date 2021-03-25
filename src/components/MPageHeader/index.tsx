/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 10:26:28
 * @LastEditTime: 2021-03-08 22:39:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/src/components/MPageHeader.tsx
 */
import React, { useEffect, useState } from 'react';
import { Breadcrumb } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import style from './index.module.less';
import { ROUTES_MAP } from '../../route';
import { getLastItem } from '../../tools';
import { useModel } from '../../store';

interface PropsI extends RouteComponentProps {
}

const MPageHeader = (props: PropsI) => {
  const [menuTitles] = useModel('menuTitles');
  const [breadcrumb, setBreadcrumb] = useState<Array<any>>([]);

  useEffect(() => {
    function getPaths(pathname: string) {
      if (pathname === ROUTES_MAP.home) return ['home'];
      const paths = props.location.pathname.match(/\/\w+/gi);
      if (!paths) return [];
      if (/\d/g.test(getLastItem(paths))) paths.pop();
      const fullPath = paths.join('');
      paths.pop();
      paths.push(fullPath);
      return paths;
    }
    const paths = getPaths(props.location.pathname);
    const newBreadcrumb = paths.map((item) => ({ path: item, breadcrumbName: menuTitles[item] }));
    setBreadcrumb(newBreadcrumb);
  }, [props.location.pathname, menuTitles]);

  return (
    <div className={style.container} style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
      <Breadcrumb>
        {
          breadcrumb.map((item) => (
            <Breadcrumb.Item key={item.path}>
              { item.breadcrumbName }
            </Breadcrumb.Item>
          ))
        }
      </Breadcrumb>
    </div>
  );
};

export default withRouter(MPageHeader);
