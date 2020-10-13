import React, { useCallback, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button, Divider, Form, Input, Radio, message, AutoComplete } from 'antd';
import { connect } from 'react-redux';
import { uniq } from 'ramda';
import { Store } from 'antd/lib/form/interface';
import { RuleObject, StoreValue } from 'rc-field-form/lib/interface';

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
  const [dictNames, setDictNames] = useState<Array<string>>([]);
  const [dictTypes, setDictTypes] = useState<Array<{ type: string, type_view: string, label: string }>>([]);
  const [dictLabels, setDictLabels] = useState<Array<{ type: string, label_view: string, label: string }>>([]);
  const [inputDictLabels, setInputDictLabels] = useState<Array<{ type: string, label_view: string, label: string }>>([]);
  const [, createDictRes, createDict] = useRequest<CreateDictReqT, GetDictResT>(CREATE_DICT, emptyDict, false);
  const [, updateDictRes, updateDict] = useRequest<UpdateDictReqT, GetDictResT>(UPDATE_DICT, emptyDict, false);
  const [getDicts] = useGetDicts(false);
  const [addDictform] = Form.useForm();

  const updateDictNamesAndValues = useCallback(() => {
    if (!addDictform.getFieldValue('typeAndLabel')) return;
    const [type, label] = addDictform.getFieldValue('typeAndLabel');
    const _dictNames = dicts
      ?.filter((item) => item.type === type && item.label === label && (createOrUpdate ? true : item.name !== dataDict.name))
      ?.map((item) => item.name);
    setDictNames(_dictNames);
  }, [addDictform, createOrUpdate, dataDict.name, dicts]);

  useEffect(() => {
    const _dictTypes = uniq(dicts.map(({ type, type_view, label }) => ({ type, type_view, label })));
    const _dictLabels = uniq(dicts.map(({ type, label, label_view }) => ({ type, label, label_view })));
    const _dictStatus = dicts.filter((item) => item.label === 'status').map((item) => ({ value: item.value, title: item.name }));
    setDictLabels(_dictLabels);
    setDictTypes(_dictTypes);
    setDictStatus(_dictStatus);
  }, [dicts]);

  useEffect(() => {
    addDictform.setFieldsValue({
      type_view: dataDict.type_view,
      label_view: dataDict.label_view,
      typeAndLabel: [dataDict.type, dataDict.label],
      name: dataDict.name,
      status: dataDict.status,
      value: dataDict.value,
    });
    updateDictNamesAndValues();
  }, [dataDict, addDictform, dicts, updateDictNamesAndValues]);

  useEffect(() => {
    if (props.match.params.id === String(-1)) {
      setCreateOrUpdate(true);
      setTimeout(addDictform.resetFields);
      return;
    }
    const data = dicts.find((item) => item._id === props.match.params.id) || emptyDict;
    setDataDict(data);
  }, [addDictform, props.match.params.id, dicts]);

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
    const { type, label, name, status, value } = values;
    const { type_view, label_view } = dicts.find((item) => item.type === type) || { type_view: '', label_view: '' };
    const data: DictI = { type, label, name, status, value, type_view, label_view };
    if (createOrUpdate) createDict(data);
    else updateDict({ ...data, _id: props.match.params.id });
  }

  function onReset() {
    if (createOrUpdate) addDictform.resetFields();
    else {
      addDictform.setFieldsValue({
        type_view: dataDict.type_view,
        label_view: dataDict.label_view,
        typeAndLabel: [],
        name: dataDict.name,
        status: dataDict.status,
        value: dataDict.value,
      });
    }
  }

  function validateDictValue(rule: RuleObject, value: StoreValue) {
    if (value === '') return Promise.resolve();
    const _value = value >> 0;
    const { type, label } = addDictform.getFieldsValue(['type', 'label']);
    const tmp = dicts.filter((item) => item.type === type && item.label === label).map(({ value }) => (value >> 0));
    return tmp.includes(_value) ? Promise.reject(new Error('该值已被占用，请输入其他值')) : Promise.resolve();
  }

  function validateDictName(rule: RuleObject, value: StoreValue) {
    if (value === '') return Promise.resolve();
    return dictNames.includes(value) ? Promise.reject(new Error('该名称已被占用，请输入其他值')) : Promise.resolve();
  }

  function onDictTypeSelect(value: string, option: any) {
    setInputDictLabels(dictLabels.filter((item) => item.type === value).map(({ type, label_view, label }) => ({ label, label_view, type })));
  }

  function onTypeAndLavelBlur() {
    // addDictform.setFieldsValue({ typeAndLabel: ['1', '2'] });
  }

  return (
    <div className="container">
      <Form
        form={addDictform}
        labelCol={formItemLayout.labelCol}
        wrapperCol={formItemLayout.wrapperCol}
        onFinish={onFinish}
        onReset={onReset}
      >
        <Form.Item
          label="字段类"
          name="type"
          rules={[{ required: true, message: '请选择字段类!' }]}
        >
          <AutoComplete
            placeholder="请输入字段类"
            onSelect={onDictTypeSelect}
            options={dictTypes.map(({ type_view, type }) => ({ label: type_view, value: type }))}
          />
        </Form.Item>
        <Form.Item
          label="字段组"
          name="label"
          rules={[{ required: true, message: '请选择字段组!' }]}
        >
          <AutoComplete
            placeholder="请输入字段组"
            onBlur={onTypeAndLavelBlur}
            options={inputDictLabels.map(({ label_view, label }) => ({ label: label_view, value: label }))}
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
    </div>
  );
};

export default connect(mapState2Props)(withRouter(DictDetail));
