import React, { ReactText, useEffect, useState } from 'react';
import {
  Button, Tree, Modal, Input, Form, Divider, Radio, message,
} from 'antd';
import * as _Icons from '@ant-design/icons';
// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import { SelectData } from 'rc-tree';
import {
  and, clone, compose, equals, find, ifElse, isNil, last, prop,
} from 'ramda';
import { withRouter } from 'react-router-dom';
import { PlusCircleOutlined } from '@ant-design/icons';
// eslint-disable-next-line import/no-extraneous-dependencies
import { RuleObject, StoreValue } from 'rc-field-form/lib/interface';

import MAIN_CONFIG from '../../../config';
import { CREATE_MENU, UPDATE_MENU } from '../../../api/auth';
import useRequest from '../../../hooks/useRequest';
import useGetMenus from '../../../hooks/useGetMenu';
import { useModel } from '../../../store';
import { ITEM_STATUS_ARRAY } from '../../../constant';
import useGetDicts from '../../../hooks/useGetDicts';

const Icons = clone<Record<string, any>>(_Icons);

const formItemLayout = {
  labelCol: {
    xs: { span: 7 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 12 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 16,
      offset: 6,
    },
    sm: {
      span: 16,
      offset: 6,
    },
  },
};

const AddRootMenu: IMenuItem = {
  icon: <PlusCircleOutlined />, title: '添加', key: 'root', sub_menu: [], parent: 'root', path: '', status: 1, children: [], position: -1,
};

function formatMenu(src: Array<IMenuItem>) {
  const tmp: Array<IMenuItem> = clone(src);
  tmp.push(AddRootMenu);
  return tmp;
}

function findMenuItemParent(menuItem: IMenuItem) {
  return (src: Array<IMenuItem>) => find<IMenuItem>((item) => item.key === menuItem.parent, src);
}

function findMenuItemPathsBy(cond: (item: IMenuItem) => boolean) {
  return (src: Array<IMenuItem>) => src.filter(cond).map((item) => last(item.path.split('/')) || '');
}

const MenuSetting = () => {
  const [menuItemArray, setMenuItemArray] = useState<Array<IMenuItem>>([]);
  const [treeData, setTreeData] = useState<Array<IMenuItem>>([]);
  const [editModalF, setEditModalF] = useState<boolean>(false);
  const [createOrUpdate, setCreateOrUpdate] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<IMenuItem>();
  const [selectedMenuParent, setSelectedMenuParent] = useState<IMenuItem>();
  const [couldIcon, setCouldIcon] = useState<boolean>(false);
  const [isMenuAdding, setIsMenuAdding] = useState<boolean>(false);
  const [couldAddMenu, setCouldAddMenu] = useState<boolean>(true);
  const [paths, setPaths] = useState<Array<string>>([]);
  const [, createMenuRes, createMenu] = useRequest(CREATE_MENU, false);
  const [, updateMenuRes, updateMenu] = useRequest(UPDATE_MENU, false);
  const { getMenus } = useGetMenus(false, false);
  const [menuTree] = useModel('menuTree');
  const [menuArray] = useModel('menu');
  const [form] = Form.useForm();

  useEffect(() => {
    setTreeData(formatMenu(menuTree));
  }, [menuTree]);
  useEffect(() => {
    setMenuItemArray(menuArray);
  }, [menuArray]);

  useEffect(() => {
    if (!createMenuRes) return;
    message.info(createMenuRes.msg);
    if (createMenuRes.success) getMenus();
  }, [createMenuRes, getMenus]);

  useEffect(() => {
    if (!updateMenuRes) return;
    message.info(updateMenuRes.msg);
    if (updateMenuRes.success) getMenus();
  }, [getMenus, updateMenuRes]);

  const menuItemClickHandlers = {
    common(_selectMenu: IMenuItem) {
      const {
        title, path, icon_name, status, position,
      } = _selectMenu;
      form.setFieldsValue({
        title, path: last(path?.split('/') || []), icon_name, status, position,
      });
      setEditModalF(true);
      setCouldAddMenu(true);
    },
    add: (_selectMenu: IMenuItem | undefined) => () => {
      if (!_selectMenu) return;
      form.resetFields();
      setEditModalF(true);
      setCouldAddMenu(false);
      setCreateOrUpdate(true);
      setPaths(findMenuItemPathsBy((item) => item.parent === _selectMenu.key)(menuItemArray));
      setSelectedMenuParent(_selectMenu);
    },
  };

  const formFinishHandlers = {
    edit(values: any) {
      const {
        role, sub_menu, key, parent, _id,
      } = menuArray.find((item) => item._id === selectedMenu?._id) || {};
      const { position } = values;
      const newPosition = parseInt(position, 10);
      const newValues = {
        role, sub_menu, parent, key, _id, ...values, position: newPosition, path: `${selectedMenuParent?.path ?? ''}/${values.path}`,
      };
      setEditModalF(false);
      updateMenu(newValues);
    },
    add(values: any) {
      const newValues = { ...values, role: [0, 1], sub_menu: [] };
      newValues.key = `${selectedMenuParent?.key}${values.path.slice(0, 1).toUpperCase()}${values.path.slice(1)}`;
      newValues.path = `${selectedMenuParent?.path ?? ''}/${values.path}`;
      newValues.parent = selectedMenuParent?.key ?? '';
      setEditModalF(false);
      createMenu(newValues);
    },
  };
  const formResetHandlers = {
    common() {
      const {
        title, path, icon_name, status, position,
      } = selectedMenu ?? {};
      form.setFieldsValue({
        title, path: last(path?.split('/') || []), icon_name, status, position,
      });
    },
    add() {
      form.resetFields();
    },
  };

  function onFormFinish(values: any) {
    setIsMenuAdding(true);
    ifElse(and(createOrUpdate), formFinishHandlers.add, formFinishHandlers.edit)(values);
    setIsMenuAdding(false);
  }

  function onFormReset() {
    ifElse(equals(selectedMenu), formResetHandlers.add,
      formResetHandlers.common)(selectedMenuParent);
  }

  function onTreeItemSelect(key: Array<ReactText>, info: SelectData) {
    if (!info.selected) return;
    const selectMenuTmp: IMenuItem = info.selectedNodes[0];
    const isAddMenuItem = compose(equals(AddRootMenu.key), prop<'key', string>('key'));
    setSelectedMenu(selectMenuTmp);
    setCouldIcon(selectMenuTmp?.parent === AddRootMenu.parent);
    compose(setSelectedMenuParent, findMenuItemParent(selectMenuTmp))(menuItemArray);
    ifElse(isAddMenuItem,
      menuItemClickHandlers.add(selectMenuTmp), menuItemClickHandlers.common)(selectMenuTmp);
  }

  function onModalCancel() {
    setEditModalF(false);
  }

  function validateIcon(rule: RuleObject, value: StoreValue) {
    if (!value) return Promise.resolve();
    const Icon = Icons[value];
    return isNil(Icon) ? Promise.reject(new Error('该图标不存在，请输入其他值')) : Promise.resolve();
  }

  function validatePath(rule: RuleObject, value: StoreValue) {
    if (!value) return Promise.resolve();
    return paths.includes(value) ? Promise.reject(new Error('该路径已被占用，请输入其他值')) : Promise.resolve();
  }

  return (
    <div className="container">
      <div style={{ paddingLeft: 120, width: 360 }}>
        <Tree
          className="draggable-tree"
          defaultExpandAll
          showIcon
          blockNode
          onSelect={onTreeItemSelect}
          treeData={treeData}
        />
        <Button style={{ width: 240 }} type="primary">保存</Button>
        <Modal visible={editModalF} footer={null} getContainer={false} onCancel={onModalCancel}>
          <Form
            form={form}
            labelCol={formItemLayout.labelCol}
            wrapperCol={formItemLayout.wrapperCol}
            onFinish={onFormFinish}
            onReset={onFormReset}
          >
            <Form.Item
              label="名称"
              name="title"
              rules={[{ required: true, message: '请输入名称' }]}
            >
              <Input placeholder="请输入名称" />
            </Form.Item>
            <Form.Item
              label="路由"
              name="path"
              rules={[{ required: true, message: '请输入路由' }, { validator: validatePath }]}
            >
              <Input
                addonBefore={<span>{ `${selectedMenuParent?.path || ''}/` }</span>}
                placeholder="请输入路由"
              />
            </Form.Item>
            <Form.Item
              label="图标"
              name="icon_name"
              rules={[{ validator: validateIcon }]}
            >
              <Input
                disabled={!couldIcon}
                addonAfter={<a href={MAIN_CONFIG.ICON_PREVIEW_URL} target="_blank" rel="noopener noreferrer">图标参考</a>}
              />
            </Form.Item>
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择字段状态!' }]}
            >
              <Radio.Group>
                {
                  ITEM_STATUS_ARRAY.map((item) => (
                    <Radio key={item.label} value={item.value}>{ item.label }</Radio>
                  ))
                }
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="position"
              label="位置"
              rules={[{ required: true, message: '请设置菜单位置!' }]}
            >
              <Input
                type="number"
                placeholder="请设置菜单位置"
              />
            </Form.Item>
            <Form.Item wrapperCol={tailFormItemLayout.wrapperCol}>
              <Button htmlType="reset">重置</Button>
              <Divider type="vertical" />
              <Button type="primary" htmlType="submit" loading={isMenuAdding}>
                { createOrUpdate ? '添加' : '保存' }
              </Button>
              <Divider type="vertical" />
              <Button
                onClick={menuItemClickHandlers.add(selectedMenu)}
                disabled={!couldAddMenu}
              >
                添加下一级
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default withRouter(MenuSetting);
