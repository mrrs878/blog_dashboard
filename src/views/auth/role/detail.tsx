import React, { ReactText, useEffect, useState } from 'react';
import { Button, Space, Tree } from 'antd';
// @ts-ignore
import { OnDragEnterData, OnDropData } from 'rc-tree';
import { clone } from 'ramda';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { EventDataNode } from 'rc-tree/lib/interface';
import { AppState } from '../../../store';
import AUTH_MODULE from '../../../modules/auth';

interface PropsI extends RouteComponentProps<{ id: string }> {
  state: CommonStateI
}

const mapState2Props = (state: AppState) => ({
  state: state.common,
});

function getExpandKeys(src: Array<MenuItemI>, role: number) {
  if (role === -1) return [];
  const tmp = clone(src);
  const keys: Array<string> = [];

  function walkMenu(menuItem: MenuItemI) {
    if (menuItem.role?.includes(role)) keys.push(menuItem.key);
    if (!menuItem.children) return;
    menuItem.children.forEach((item) => walkMenu(item));
  }

  tmp.forEach((item) => walkMenu(item));
  return keys;
}

const RoleDetail = (props: PropsI) => {
  const [treeData, setTreeData] = useState<Array<any>>(props.state.menu);
  const [checkedKeys, setCheckedKeys] = useState<Array<ReactText>>([]);
  const [originCheckedKeys, setOriginCheckedKeys] = useState<Array<ReactText>>([]);
  const [modifyKeys, setModifyKeys] = useState<Array<string>>([]);

  useEffect(() => {
    (async () => {
      const tmp = getExpandKeys(props.state.menu, parseInt(props.match.params.id, 10));
      setCheckedKeys(tmp);
      setOriginCheckedKeys(tmp);
    })();
  }, [props.match.params.id, props.state.dicts, props.state.menu]);

  function onDrop(info: OnDropData) {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data: Array<any>, key: string, callback: (item: any, index: number, arr: Array<any>) => void) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = clone(treeData);

    let dragObj: any;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0
      && info.node.props.expanded
      && dropPosition === 1
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar: Array<any> = [];
      let i = 0;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    setTreeData(data);
  }

  function onDragEnter(info: OnDragEnterData) {
    // setExpandedKeys(info.expandedKeys);
  }

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
    console.log(_modifyItems);

    _modifyItems.forEach((modify) => {
      const { key, icon_name, title, path, parent, role, sub_menu, status, children, _id } = modify;
      AUTH_MODULE.updateMenu({ key, icon_name, title, path, parent, role, sub_menu, status, children, _id });
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
          defaultExpandAll
          draggable
          blockNode
          checkable
          onDragEnter={onDragEnter}
          onDrop={onDrop}
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
