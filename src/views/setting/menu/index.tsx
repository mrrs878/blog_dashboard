import React, { ReactText, useEffect, useState } from 'react';
import { Button, Tree, Modal, Input, Form, Divider, Radio, message } from 'antd';
import * as _Icons from '@ant-design/icons';
// @ts-ignore
import { SelectData } from 'rc-tree';
import { and, clone, compose, equals, find, ifElse, isNil, last, prop } from 'ramda';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { PlusCircleOutlined } from '@ant-design/icons';
import { RuleObject, StoreValue } from 'rc-field-form/lib/interface';

import { AppState } from '../../../store';
import MAIN_CONFIG from '../../../config';
import { CREATE_MENU, UPDATE_MENU } from '../../../api/auth';
import useRequest from '../../../hooks/useRequest';
import useGetMenus from '../../../hooks/useGetMenus';

interface PropsI extends RouteComponentProps<{ id: string }> {
  state: CommonStateI
}

const Icons = clone<DynamicObjectKey<any>>(_Icons);

const mapState2Props = (state: AppState) => ({
  state: state.common,
});

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

const AddRootMenu: MenuItemI = { icon: <PlusCircleOutlined />, title: '添加', key: 'root', sub_menu: [], parent: 'root', path: '', status: 1, children: [], position: -1 };

function formatMenu(src: Array<MenuItemI>) {
  const tmp: Array<MenuItemI> = clone(src);
  tmp.push(AddRootMenu);
  return tmp;
}

function findMenuItemParent(menuItem: MenuItemI) {
  return (src: Array<MenuItemI>) => find<MenuItemI>((item) => item.key === menuItem.parent, src);
}

function findMenuItemPathsBy(cond: (item: MenuItemI) => boolean) {
  return (src: Array<MenuItemI>) => src.filter(cond).map((item) => last(item.path.split('/')) || '');
}

const MenuSetting = (props: PropsI) => {
  const [menuItemArray, setMenuItemArray] = useState<Array<MenuItemI>>([]);
  const [treeData, setTreeData] = useState<Array<MenuItemI>>([]);
  const [editModalF, setEditModalF] = useState<boolean>(false);
  const [createOrUpdate, setCreateOrUpdate] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuItemI>();
  const [selectedMenuParent, setSelectedMenuParent] = useState<MenuItemI>();
  const [dictStatus, setDictStatus] = useState<Array<{ value: number; title: string }>>([]);
  const [couldIcon, setCouldIcon] = useState<boolean>(false);
  const [isMenuAdding, setIsMenuAdding] = useState<boolean>(false);
  const [couldAddMenu, setCouldAddMenu] = useState<boolean>(true);
  const [paths, setPaths] = useState<Array<string>>([]);
  const [, createMenuRes, createMenu] = useRequest(CREATE_MENU, false);
  const [, updateMenuRes, updateMenu] = useRequest(UPDATE_MENU, false);
  const { getMenus } = useGetMenus(false, false);
  const [form] = Form.useForm();

  useEffect(() => {
    setTreeData(formatMenu(props.state.menu));
  }, [props.state.menu]);
  useEffect(() => {
    setMenuItemArray(props.state.menuArray);
  }, [props.state.menuArray]);
  useEffect(() => {
    const _dictStatus = props.state.dicts.filter((item) => item.label === 'status')
      .map((item) => ({ value: item.value, title: item.name }));
    setDictStatus(_dictStatus);
  }, [props.state.dicts]);

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
    common(_selectMenu: MenuItemI) {
      const { title, path, icon_name, status, position } = _selectMenu;
      form.setFieldsValue({ title, path: last(path?.split('/') || []), icon_name, status, position });
      setEditModalF(true);
      setCouldAddMenu(true);
    },
    add: (_selectMenu: MenuItemI | undefined) => () => {
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
      const { role, sub_menu, key, parent, _id } = props.state.menuArray.find((item) => item._id === selectedMenu?._id) || {};
      const { position, path } = values;
      const _values = { role, sub_menu, parent, key, _id, ...values, position: position >> 0, path: path.startsWith('/') ? path : `/${path}` };
      setEditModalF(false);
      updateMenu(_values);
    },
    add(values: any) {
      const _values = { ...values, role: [0, 1], sub_menu: [] };
      _values.key = `${selectedMenuParent?.key}${values.path.slice(0, 1).toUpperCase()}${values.path.slice(1)}`;
      _values.path = `${selectedMenuParent?.path ?? ''}/${values.path}`;
      _values.parent = selectedMenuParent?.key ?? '';
      setEditModalF(false);
      createMenu(_values);
    },
  };
  const formResetHandlers = {
    common() {
      const { title, path, icon_name, status, position } = selectedMenu ?? {};
      form.setFieldsValue({ title, path: last(path?.split('/') || []), icon_name, status, position });
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
    ifElse(equals(selectedMenu), formResetHandlers.add, formResetHandlers.common)(selectedMenuParent);
  }

  function onTreeItemSelect(key: Array<ReactText>, info: SelectData) {
    if (!info.selected) return;
    const _selectMenu: MenuItemI = info.selectedNodes[0];
    const isAddMenuItem = compose(equals(AddRootMenu.key), prop<'key', string>('key'));
    setSelectedMenu(_selectMenu);
    setCouldIcon(_selectMenu?.parent === AddRootMenu.parent);
    compose(setSelectedMenuParent, findMenuItemParent(_selectMenu))(menuItemArray);
    ifElse(isAddMenuItem, menuItemClickHandlers.add(_selectMenu), menuItemClickHandlers.common)(_selectMenu);
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
                  dictStatus.map((item) => (
                    <Radio key={item.title} value={item.value}>{ item.title }</Radio>
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
              <Button onClick={menuItemClickHandlers.add(selectedMenu)} disabled={!couldAddMenu}>添加下一级</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default connect(mapState2Props)(withRouter(MenuSetting));
