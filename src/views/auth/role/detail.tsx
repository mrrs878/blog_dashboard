import React, { ReactText, useEffect, useState } from 'react';
import { Button, message, Space, Tree } from 'antd';
import { clone } from 'ramda';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { EventDataNode } from 'rc-tree/lib/interface';
import { AppState } from '../../../store';
import { UPDATE_MENU } from '../../../api/auth';
import useRequest from '../../../hooks/useRequest';

interface PropsI extends RouteComponentProps<{ id: string }> {
  state: CommonStateI
}

const mapState2Props = (state: AppState) => ({
  state: state.common,
});

function getCheckedKeys(src: Array<MenuItemI>, role: number) {
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
  const [treeData] = useState<Array<any>>(props.state.menu);
  const [checkedKeys, setCheckedKeys] = useState<Array<ReactText>>([]);
  const [originCheckedKeys, setOriginCheckedKeys] = useState<Array<ReactText>>([]);
  const [modifyKeys, setModifyKeys] = useState<Array<string>>([]);
  const [,updateMenuRes, updateMenu] = useRequest(UPDATE_MENU, false);

  useEffect(() => {
    (async () => {
      const tmp = getCheckedKeys(props.state.menuArray, parseInt(props.match.params.id, 10));
      setCheckedKeys(tmp);
      setOriginCheckedKeys(tmp);
    })();
  }, [props.match.params.id, props.state.menuArray]);

  useEffect(() => {
    if (!updateMenuRes) return;
    message.info(updateMenuRes?.msg);
  }, [updateMenuRes]);

  function onCheck(keys: Array<ReactText> | { checked: ReactText[]; halfChecked: ReactText[]; }, info: { checked: boolean, node: EventDataNode }) {
    if (!Array.isArray(keys)) return;
    setCheckedKeys(keys);
    setModifyKeys([...modifyKeys, String(info.node.key)]);
  }

  function onSaveClick() {
    if (originCheckedKeys === checkedKeys) return;
    const _modifyKeys = Array.from(new Set(modifyKeys));
    const _menuItems = clone(props.state.menuArray);
    const _modifyItems: Array<MenuItemI> = [];
    const _role = parseInt(props.match.params.id, 10);
    _modifyKeys.forEach((key) => {
      const tmp = _menuItems.find((menu) => menu.key === key);
      if (tmp && (checkedKeys.includes(key) && !tmp?.role?.includes(_role))) {
        tmp.role?.push(_role);
        _modifyItems.push(tmp);
      }
      if (tmp && (!checkedKeys.includes(key) && tmp?.role?.includes(_role))) {
        tmp.role = tmp.role.filter((item) => item !== _role);
        _modifyItems.push(tmp);
      }
    });
    _modifyItems.forEach((modify) => {
      const { key, icon_name, title, path, parent, role, sub_menu, status, _id, position } = modify;
      updateMenu({ key, icon_name, title, path, parent, role, sub_menu, status, _id, position });
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

export default connect(mapState2Props)(withRouter(RoleDetail));
