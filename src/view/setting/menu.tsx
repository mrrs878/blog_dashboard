/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-04-13 10:19:21
 * @LastEditTime: 2021-04-18 22:55:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/view/setting/menu.tsx
 */
import { PlusCircleOutlined } from '@ant-design/icons';
import {
  Button, Divider, Form, Input, message, Modal, Radio, Space, Tree,
} from 'antd';
import {
  and, clone, compose, equals, filter, find, ifElse, isNil, last, prop, sortBy,
} from 'ramda';
import React, {
  ReactText, useCallback, useEffect, useMemo, useState,
} from 'react';
import { withRouter } from 'react-router-dom';
import * as _Icons from '@ant-design/icons';
// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import { SelectData } from 'rc-tree';
// eslint-disable-next-line import/no-extraneous-dependencies
import { RuleObject, StoreValue } from 'rc-field-form/lib/interface';
import { CREATE_MENU, UPDATE_MENU, UPDATE_MENUS } from '../../api/setting';
import useGetMenu from '../../hook/useGetMenu';
import useRequest from '../../hook/useRequest';
import { useModel } from '../../store';
import { ITEM_STATUS_ARRAY, MAIN_CONFIG } from '../../config';
import style from './menu.module.less';

interface IMenuPositionRange {
  max: number;
  min: number;
}

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
  icon: <PlusCircleOutlined />, title: '添加', id: -1, key: 'root', parent: -1, path: '', status: 1, children: [], position: -1,
};

function formatMenu(src: Array<IMenuItem>) {
  const tmp: Array<IMenuItem> = clone(src);
  tmp.push(AddRootMenu);
  return tmp;
}

function findMenuItemParent(menuItem: IMenuItem) {
  return (src: Array<IMenuItem>) => {
    if (menuItem.parent === -1) return AddRootMenu;
    return find<IMenuItem>((item) => item.id === menuItem.parent, src);
  };
}

function findMenuItemPathsBy(conf: (item: IMenuItem) => boolean) {
  return (src: Array<IMenuItem>) => src.filter(conf).map((item) => last(item.path.split('/')) || '');
}

const MenuSetting = () => {
  const [treeData, setTreeData] = useState<Array<IMenuItem>>([]);
  const [editModalF, setEditModalF] = useState<boolean>(false);
  const [createOrUpdate, setCreateOrUpdate] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<IMenuItem>();
  const [positionRange, setMenuPositionRange] = useState<IMenuPositionRange>({ max: 0, min: 0 });
  const [selectedMenuParent, setSelectedMenuParent] = useState<IMenuItem>();
  const [isMenuAdding, setIsMenuAdding] = useState<boolean>(false);
  const [couldAddMenu, setCouldAddMenu] = useState<boolean>(true);
  const [paths, setPaths] = useState<Array<string>>([]);
  const [, createMenuRes, createMenu] = useRequest(CREATE_MENU, false);
  const [, updateMenuRes, updateMenu] = useRequest(UPDATE_MENU, false);
  const [, updateMenusRes, updateMenus] = useRequest(UPDATE_MENUS, false);
  const { getMenus } = useGetMenu(false, false);
  const [menuTree] = useModel('menu');
  const [menuArray] = useModel('menuArray');
  const [form] = Form.useForm();

  useEffect(() => {
    setTreeData(formatMenu(menuTree));
  }, [menuTree]);

  useEffect(() => {
    if (!createMenuRes) return;
    message.info(createMenuRes.return_message);
    if (createMenuRes.success) getMenus();
  }, [createMenuRes, getMenus]);

  useEffect(() => {
    if (!updateMenuRes) return;
    message.info(updateMenuRes.return_message);
    if (updateMenuRes.success) getMenus();
  }, [getMenus, updateMenuRes]);

  useEffect(() => {
    if (!updateMenusRes) return;
    message.info(updateMenusRes.return_message);
    if (updateMenusRes.success) getMenus();
  }, [getMenus, updateMenusRes]);

  const calculateMenuPosition = useCallback((parentMenuId: number|undefined) => {
    const max = compose(
      prop<'position', IMenuItem['position']>('position'),
      last,
      sortBy(prop('position')),
      filter<IMenuItem, 'array'>((item) => item.parent === parentMenuId),
    )(menuArray);
    return max ?? -1;
  }, [menuArray]);

  const menuItemClickHandlers = useMemo(() => ({
    common(_selectMenu: IMenuItem) {
      const {
        title, path, icon_name, status, position,
      } = _selectMenu;
      form.setFieldsValue({
        title, path: last(path?.split('/') || []), icon_name, status, position,
      });
      setEditModalF(true);
      setCreateOrUpdate(false);
      setCouldAddMenu(_selectMenu.parent === -1 || _selectMenu.key === 'root');
    },
    add: (_selectMenu: IMenuItem | undefined) => () => {
      if (!_selectMenu) return;
      form.resetFields();
      setEditModalF(true);
      setCouldAddMenu(false);
      setCreateOrUpdate(true);
      setPaths(findMenuItemPathsBy((item) => item.parent === _selectMenu.id)(menuArray));
      setSelectedMenuParent(_selectMenu);
      const max = calculateMenuPosition(_selectMenu?.id);
      setMenuPositionRange({ min: 0, max });
      setTimeout(form.setFieldsValue, 500, { position: max + 1 });
    },
  }), [calculateMenuPosition, form, menuArray]);

  const formFinishHandlers = {
    edit(values: any) {
      const {
        role, key, parent, id,
      } = menuArray.find((item) => item.id === selectedMenu?.id) || {};
      const { position } = values;
      const newPosition = parseInt(position, 10);
      const newValues = {
        role, parent, key, id, ...values, position: newPosition, path: `${selectedMenuParent?.path ?? ''}/${values.path}`,
      };
      setEditModalF(false);
      updateMenu(newValues);
    },
    add(values: any) {
      const newValues: IMenuItem = clone(values);
      newValues.key = `${selectedMenuParent?.key}${values.path.slice(0, 1).toUpperCase()}${values.path.slice(1)}`;
      newValues.path = `${selectedMenuParent?.path ?? ''}/${values.path}`;
      newValues.parent = selectedMenuParent?.id ?? -1;
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

  const onTreeItemSelect = useCallback((key: Array<ReactText>, info: SelectData) => {
    if (!info.selected) return;
    const selectMenuTmp: IMenuItem = info.selectedNodes[0];
    const isAddMenuItem = compose(equals(AddRootMenu.key), prop<'key', string>('key'));
    const parentMenu = findMenuItemParent(selectMenuTmp)(menuArray);
    console.log(parentMenu?.id);
    const max = calculateMenuPosition(parentMenu?.id);
    console.log(max);

    setMenuPositionRange({ min: 0, max });
    setSelectedMenu(selectMenuTmp);
    setSelectedMenuParent(parentMenu);
    ifElse(isAddMenuItem,
      menuItemClickHandlers.add(selectMenuTmp), menuItemClickHandlers.common)(selectMenuTmp);
  }, [calculateMenuPosition, menuArray, menuItemClickHandlers]);

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

  const onSwapPositionUp = useCallback(() => {
    const position = selectedMenu?.position ?? -1;
    if (position === 0) return;
    const tmp = clone(menuArray);
    const selectedMenuPosition = tmp.find((item) => item.id === selectedMenu?.id);
    const preMenuPosition = tmp.find(
      (item) => item.position === position - 1 && item.parent === selectedMenu?.parent,
    );
    if (selectedMenuPosition?.position !== undefined) selectedMenuPosition.position -= 1;
    if (preMenuPosition?.position !== undefined) preMenuPosition.position += 1;
    updateMenus(tmp);
    setEditModalF(false);
  }, [menuArray, selectedMenu, updateMenus]);

  const onSwapPositionDown = useCallback(() => {
    const position = selectedMenu?.position ?? -1;
    if (position === positionRange.max) return;
    const tmp = clone(menuArray);
    const selectedMenuPosition = tmp.find((item) => item.id === selectedMenu?.id);
    const preMenuPosition = tmp.find(
      (item) => item.position === position + 1 && item.parent === selectedMenu?.parent,
    );
    if (selectedMenuPosition?.position !== undefined) selectedMenuPosition.position += 1;
    if (preMenuPosition?.position !== undefined) preMenuPosition.position -= 1;
    updateMenus(tmp);
    setEditModalF(false);
  }, [menuArray, positionRange, selectedMenu, updateMenus]);

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
                disabled={selectedMenuParent?.id !== AddRootMenu.id}
                addonAfter={<a href={MAIN_CONFIG.iconPreviewUrl} target="_blank" rel="noopener noreferrer">图标参考</a>}
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
            >
              <Input
                disabled
                type="number"
                addonAfter={(
                  <Space>
                    <Button disabled={selectedMenu?.position === positionRange.min || selectedMenu?.key === 'root'} size="small" className={style.menuPositionCButton} onClick={onSwapPositionUp}>上移</Button>
                    <Button disabled={selectedMenu?.position === positionRange.max || selectedMenu?.key === 'root'} size="small" className={style.menuPositionCButton} onClick={onSwapPositionDown}>下移</Button>
                  </Space>
                )}
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
