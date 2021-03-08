import React, { ReactText, useEffect, useState } from 'react';
import {
  Button, message, Space, Tree,
} from 'antd';
import { clone } from 'ramda';
import { RouteComponentProps, withRouter } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { EventDataNode } from 'rc-tree/lib/interface';
import { UPDATE_MENU } from '../../../api/auth';
import useRequest from '../../../hooks/useRequest';
import { useModel } from '../../../store';

interface PropsI extends RouteComponentProps<{ id: string }> {
}

function getCheckedKeys(src: Array<IMenuItem>, role: number) {
  if (role === -1) return [];

  const tmp = clone(src);
  const keyArray: Array<string> = [];
  const keyMap: Map<string, boolean> = new Map();

  tmp.forEach((menuItem) => {
    if (menuItem.role?.includes(role)) {
      keyMap.set(menuItem.key, true);
      keyMap.set(menuItem.parent, false);
    }
  });

  keyMap.forEach((value, key) => value && keyArray.push(key));

  return keyArray;
}

const RoleDetail = (props: PropsI) => {
  const [menu] = useModel('menu');
  const [menuArray] = useModel('menu');
  const [treeData] = useState<Array<any>>(menu);
  const [checkedKeys, setCheckedKeys] = useState<Array<ReactText>>([]);
  const [originCheckedKeys, setOriginCheckedKeys] = useState<Array<ReactText>>([]);
  const [modifyKeys, setModifyKeys] = useState<Array<string>>([]);
  const [,updateMenuRes, updateMenu] = useRequest(UPDATE_MENU, false);

  useEffect(() => {
    (async () => {
      const tmp = getCheckedKeys(menuArray, parseInt(props.match.params.id, 10));
      setCheckedKeys(tmp);
      setOriginCheckedKeys(tmp);
    })();
  }, [props.match.params.id, menuArray]);

  useEffect(() => {
    if (!updateMenuRes) return;
    message.info(updateMenuRes?.msg);
  }, [updateMenuRes]);

  function onCheck(keys: Array<ReactText> | { checked: ReactText[]; halfChecked:
  ReactText[]; }, info: { checked: boolean, node: EventDataNode }) {
    if (!Array.isArray(keys)) return;
    setCheckedKeys(keys);
    setModifyKeys([...modifyKeys, String(info.node.key)]);
  }

  function onSaveClick() {
    if (originCheckedKeys === checkedKeys) return;
    const modifyKeysTmp = Array.from(new Set(modifyKeys));
    const menuItemsTmp = clone(menuArray);
    const modifyItemsTmp: Array<IMenuItem> = [];
    const roleTmp = parseInt(props.match.params.id, 10);
    modifyKeysTmp.forEach((key) => {
      const tmp = menuItemsTmp.find((menuItem) => menuItem.key === key);
      if (tmp && (checkedKeys.includes(key) && !tmp?.role?.includes(roleTmp))) {
        tmp.role?.push(roleTmp);
        modifyItemsTmp.push(tmp);
      }
      if (tmp && (!checkedKeys.includes(key) && tmp?.role?.includes(roleTmp))) {
        tmp.role = tmp.role.filter((item) => item !== roleTmp);
        modifyItemsTmp.push(tmp);
      }
    });
    modifyItemsTmp.forEach((modify) => {
      const {
        key, icon_name, title, path, parent, role, sub_menu, status, _id, position,
      } = modify;
      updateMenu({
        key, icon_name, title, path, parent, role, sub_menu, status, _id, position,
      });
    });
  }

  function onResetClick() {
    setCheckedKeys(originCheckedKeys);
    setModifyKeys([]);
  }

  return (
    <div className="container">
      <div style={{ paddingLeft: 120, width: 360 }}>
        <Tree
          className="draggable-tree"
          draggable
          blockNode
          checkable
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          treeData={treeData}
        />
        <br />
        <Space direction="horizontal">
          <Button type="primary" style={{ width: 120 }} onClick={onSaveClick}>保存</Button>
          <Button type="primary" style={{ width: 120 }} onClick={onResetClick}>重置</Button>
        </Space>
      </div>
    </div>
  );
};

export default withRouter(RoleDetail);
