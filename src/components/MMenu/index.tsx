/*
 * @Author: your name
 * @Date: 2021-02-24 10:25:01
 * @LastEditTime: 2021-03-01 14:37:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/src/components/MMenu.tsx
 */
import React, { useCallback, useMemo } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import * as _Icon from '@ant-design/icons';
import { clone } from 'ramda';
import style from './index.module.less';
import { useModel } from '../../store';

const { SubMenu } = Menu;
const Icon: Record<string, any> = clone(_Icon);

type MenuClickActions = 'navigate';

interface PropsI extends RouteComponentProps {
}

const MMenu: React.FC<PropsI> = (props: PropsI) => {
  const [menu] = useModel('menu');

  const MENU_CLICK_HANDLER: Record<MenuClickActions, Function> = useMemo(() => ({
    navigate(path: string) {
      props.history.push(`${path}`);
    },
  }), [props.history]);

  const onMenuClick = useCallback(({ key }: any) => {
    MENU_CLICK_HANDLER.navigate(key);
  }, [MENU_CLICK_HANDLER]);

  const dynamicIcon = useCallback((iconName: string | Object | undefined) => {
    if (typeof iconName !== 'string') return iconName;
    return iconName ? React.createElement(Icon[iconName]) : '';
  }, []);

  const walkMenu = useCallback((item: IMenuItem) => {
    const icon = dynamicIcon(item.icon_name);
    if (item.status !== 0) return <></>;
    if (item.sub_menu.length > 0) {
      return (
        <SubMenu key={item.path} icon={icon} title={item.title}>
          {
            item.children?.map((child) => walkMenu(child))
          }
        </SubMenu>
      );
    }
    return <Menu.Item icon={icon} key={item.path}>{ item.title }</Menu.Item>;
  }, [dynamicIcon]);

  const generateMenu = useCallback((menuTree: Array<IMenuItem> | undefined) => (
    menuTree && (
      <Menu onClick={onMenuClick} activeKey={window.location.pathname} defaultSelectedKeys={[window.location.pathname]} mode="inline" theme="dark">
        <div className={style.logo}>
          <a href="https://" target="_blank" rel="noreferrer">
            Mr.RS
          </a>
        </div>
        {
          menuTree?.map((item) => walkMenu(item))
        }
      </Menu>
    )
  ), [onMenuClick, walkMenu]);

  return (
    <div className={style.menuContainer}>
      {
        generateMenu(menu)
      }
    </div>
  );
};

export default withRouter(MMenu);
