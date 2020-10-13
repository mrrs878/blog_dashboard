import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button, Divider, Form, Input, Radio, Cascader, message, Modal } from 'antd';
import { connect } from 'react-redux';
import { uniq } from 'ramda';
import { Store } from 'antd/lib/form/interface';
import { RuleObject, StoreValue } from 'rc-field-form/lib/interface';
import { CascaderOptionType } from 'antd/es/cascader';

import { CREATE_DICT, UPDATE_DICT } from '../../../api/setting';
import { AppState } from '../../../store';
import useRequest from '../../../hooks/useRequest';
import useGetDicts from '../../../hooks/useGetDicts';

interface PropsI extends RouteComponentProps<{ id: string }> {
  state: CommonStateI;
}

const mapState2Props = (state: AppState) => ({
  state: state.common,
});

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 12 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 6,
      offset: 6,
    },
    sm: {
      span: 10,
      offset: 10,
    },
  },
};

const emptyDict: DictI = { _id: '', status: 0, label: '', label_view: '', type: '', type_view: '', name: '', value: 0, createTime: '', updateTime: '' };

const DictDetail = (props: PropsI) => {
  const [dicts] = useState(props.state.dicts);
  const [dataDict, setDataDict] = useState<DictI>(emptyDict);
  const [createOrUpdate, setCreateOrUpdate] = useState(false);
  const [dictStatus, setDictStatus] = useState<Array<{ value: number; title: string }>>([]);
  const [dictValues, setDictValues] = useState<Array<number>>([]);
  const [dictNames, setDictNames] = useState<Array<string>>([]);
  const [typeAndLabels, setTypeAndLabels] = useState<Array<CascaderOptionType>>([]);
  const [, createDictRes, createDict] = useRequest<CreateDictReqT, GetDictResT>(CREATE_DICT, emptyDict, false);
  const [, updateDictRes, updateDict] = useRequest<UpdateDictReqT, GetDictResT>(UPDATE_DICT, emptyDict, false);
  const [getDicts] = useGetDicts(false);
  const [addDictModalF, setAddDictModalF] = useState(false);
  const [form] = Form.useForm();

  const updateDictNamesAndValues = useCallback(() => {
    if (!form.getFieldValue('typeAndLabel')) return;
    const [type, label] = form.getFieldValue('typeAndLabel');
    const _dictValues = dicts
      ?.filter((item) => item.type === type && item.label === label && (createOrUpdate ? true : item.value !== dataDict.value))
      ?.map((item) => item.value);
    const _dictNames = dicts
      ?.filter((item) => item.type === type && item.label === label && (createOrUpdate ? true : item.name !== dataDict.name))
      ?.map((item) => item.name);
    setDictNames(_dictNames);
    setDictValues(_dictValues);
  }, [createOrUpdate, dataDict.name, dataDict.value, dicts, form]);

  useEffect(() => {
    const _dictTypes = uniq(dicts.map((item) => ({ value: item.type, label: item.type_view })));
    const _dictLabels = uniq(dicts.map((item) => ({ value: item.label, label: item.label_view, type: item.type })));
    const _dictStatus = dicts.filter((item) => item.label === 'status').map((item) => ({ value: item.value, title: item.name }));
    const _typeAndLabels = _dictTypes.map((item) => ({
      value: item.value,
      label: item.label,
      children: _dictLabels.filter((_item) => _item.type === item.value),
    }));
    setTypeAndLabels(_typeAndLabels);
    setDictStatus(_dictStatus);
  }, [dicts]);

  useEffect(() => {
    form.setFieldsValue({
      type_view: dataDict.type_view,
      label_view: dataDict.label_view,
      typeAndLabel: [dataDict.type, dataDict.label],
      name: dataDict.name,
      status: dataDict.status,
      value: dataDict.value,
    });
    updateDictNamesAndValues();
  }, [dataDict, form, dicts, updateDictNamesAndValues]);

  useEffect(() => {
    if (props.match.params.id === String(-1)) {
      setCreateOrUpdate(true);
      setTimeout(form.resetFields);
      return;
    }
    const data = dicts.find((item) => item._id === props.match.params.id) || emptyDict;
    setDataDict(data);
  }, [form, props.match.params.id, dicts]);

  useEffect(() => {
    if (!createDictRes) return;
    message.info(createDictRes?.msg);
    if (createDictRes?.success) {
      getDicts();
    }
  }, [createDictRes, getDicts]);

  useEffect(() => {
    if (!updateDictRes) return;
    message.info(updateDictRes?.msg);
    if (updateDictRes?.success) {
      getDicts();
    }
  }, [getDicts, updateDictRes]);

  async function onFinish(values: Store) {
    const { typeAndLabel, name, status, value } = values;
    const [type, label] = typeAndLabel;
    const { type_view, label_view } = dicts.find((item) => item.type === type) || { type_view: '', label_view: '' };
    const data: DictI = { type, label, name, status, value, type_view, label_view };
    if (createOrUpdate) createDict(data);
    else updateDict({ ...data, _id: props.match.params.id });
  }

  function onReset() {
    if (createOrUpdate) form.resetFields();
    else {
      form.setFieldsValue({
        type_view: dataDict.type_view,
        label_view: dataDict.label_view,
        typeAndLabel: [],
        name: dataDict.name,
        status: dataDict.status,
        value: dataDict.value,
      });
    }
  }

  function onCascaderChange(e: any) {
    if (e.include('-1')) {
      setAddDictModalF(true);
      return;
    }
    updateDictNamesAndValues();
  }

  function validateDictValue(rule: RuleObject, value: StoreValue) {
    if (value === '') return Promise.resolve();
    const _value = value >> 0;
    return dictValues.includes(_value) ? Promise.reject(new Error('该值已被占用，请输入其他值')) : Promise.resolve();
  }

  function validateDictName(rule: RuleObject, value: StoreValue) {
    if (value === '') return Promise.resolve();
    return dictNames.includes(value) ? Promise.reject(new Error('该名称已被占用，请输入其他值')) : Promise.resolve();
  }

  function dropdownRender(menus: ReactNode) {
    return (
      <div style={{ padding: 10 }}>
        {menus}
        <Divider style={{ margin: 0 }} />
        <Button onClick={() => setAddDictModalF(true)}>新的选项？点击添加</Button>
      </div>
    );
  }

  function onAddDictModalOkClick() {
    setAddDictModalF(false);
  }

  return (
    <div className="container">
      <Form
        form={form}
        labelCol={formItemLayout.labelCol}
        wrapperCol={formItemLayout.wrapperCol}
        onFinish={onFinish}
        onReset={onReset}
      >
        <Form.Item
          label="字段类/组"
          name="typeAndLabel"
          rules={[{ required: true, message: '请选择字段类/组!' }]}
        >
          <Cascader
            onChange={onCascaderChange}
            options={typeAndLabels}
            dropdownRender={dropdownRender}
            placeholder="请选择字段类/组"
          />
        </Form.Item>
        <Form.Item
          name="name"
          label="字段名"
          rules={[{ required: true, message: '请输入字段名!' }, { validator: validateDictName }]}
        >
          <Input placeholder="请输入字段名" />
        </Form.Item>
        <Form.Item
          name="value"
          label="字段值"
          rules={[{ required: true, message: '请输入字段值!' }, { validator: validateDictValue }]}
        >
          <Input placeholder="请输入字段值" value={dataDict.value} />
        </Form.Item>
        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择字段状态!' }]}
        >
          <Radio.Group value={dataDict.status}>
            {
              dictStatus.map((item) => (
                <Radio key={item.title} value={item.value}>{ item.title }</Radio>
              ))
            }
          </Radio.Group>
        </Form.Item>

        <Form.Item wrapperCol={tailFormItemLayout.wrapperCol}>
          <Button htmlType="reset">重置</Button>
          <Divider type="vertical" />
          <Button type="primary" htmlType="submit">
            { createOrUpdate ? '添加' : '确定' }
          </Button>
        </Form.Item>
      </Form>
      <Modal
        visible={addDictModalF}
        onOk={onAddDictModalOkClick}
        onCancel={() => setAddDictModalF(false)}
      >
        <Form
          form={form}
          labelCol={formItemLayout.labelCol}
          wrapperCol={formItemLayout.wrapperCol}
        >
          <Form.Item
            name="type"
            label="字段类"
            rules={[{ required: true, message: '请输入字段类!' }, { validator: validateDictValue }]}
          >
            <Input placeholder="请输入字段类" />
          </Form.Item>
          <Form.Item
            name="label"
            label="字段组"
            rules={[{ required: true, message: '请输入字段组!' }, { validator: validateDictValue }]}
          >
            <Input placeholder="请输入字段组" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect(mapState2Props)(withRouter(DictDetail));
