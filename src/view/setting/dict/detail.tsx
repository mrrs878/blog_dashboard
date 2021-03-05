import React, { useEffect, useMemo, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  Button, Divider, Form, Input, Radio, message, AutoComplete,
} from 'antd';
import { uniq } from 'ramda';
import { Store } from 'antd/lib/form/interface';
// eslint-disable-next-line import/no-extraneous-dependencies
import { RuleObject, StoreValue } from 'rc-field-form/lib/interface';

import { CREATE_DICT, UPDATE_DICT } from '../../../api/setting';
import useRequest from '../../../hooks/useRequest';
import useGetDicts from '../../../hooks/useGetDicts';
import { useModel } from '../../../store';

interface PropsI extends RouteComponentProps<{ id: string }> {
}

interface IDictLabel { type: string, label_view: string, label: string }

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

const emptyDict: IDict = {
  _id: '', status: 0, label: '', label_view: '', type: '', type_view: '', name: '', name_view: '', value: 0, createTime: '', updateTime: '', creator: { name: '' }, updater: { name: '' },
};

const DictDetail = (props: PropsI) => {
  const [dicts] = useModel('dicts');
  const [dataDict, setDataDict] = useState<IDict>(emptyDict);
  const dictLabels = useMemo(
    () => uniq(dicts.map(
      ({ type, label, label_view }) => ({ type, label, label_view }),
    )),
    [dicts],
  );
  const dictTypes = useMemo(
    () => uniq(dicts.map(({ type, type_view }) => ({ type, type_view }))),
    [dicts],
  );
  const dictStatus = useMemo(
    () => dicts.filter((item) => item.label === 'status').map((item) => ({ value: item.value, title: item.name_view })),
    [dicts],
  );
  const [createOrUpdate, setCreateOrUpdate] = useState(false);
  const [inputDictLabels, setInputDictLabels] = useState<Array<IDictLabel>>([]);
  const [createDictLoading, createDictRes, createDict] = useRequest(CREATE_DICT, false);
  const [updateDictLoading, updateDictRes, updateDict] = useRequest(UPDATE_DICT, false);
  const [getDicts] = useGetDicts(false);
  const [addDictForm] = Form.useForm();

  useEffect(() => {
    const {
      type, type_view, label, label_view, name, status, value, name_view,
    } = dataDict;
    addDictForm.setFieldsValue({
      type, type_view, label, label_view, name, status, value, name_view,
    });
  }, [dataDict, addDictForm, dicts]);

  useEffect(() => {
    if (props.match.params.id === String(-1)) {
      setCreateOrUpdate(true);
      setTimeout(addDictForm.resetFields);
      return;
    }
    const data = dicts.find((item) => item._id === props.match.params.id) || emptyDict;
    setDataDict(data);
  }, [addDictForm, props.match.params.id, dicts]);

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
    const {
      type, label, name, status, value, name_view, label_view, type_view,
    } = values;
    const data = {
      type, label, name, status, value, type_view, label_view, name_view,
    };
    if (createOrUpdate) createDict(data);
    else updateDict({ ...data, _id: props.match.params.id });
  }

  function onReset() {
    if (createOrUpdate) addDictForm.resetFields();
    else {
      addDictForm.setFieldsValue({
        type_view: dataDict.type_view,
        label_view: dataDict.label_view,
        name: dataDict.name,
        status: dataDict.status,
        value: dataDict.value,
      });
    }
  }

  function validateDictValue(rule: RuleObject, _value: StoreValue) {
    if (_value === '' || (parseInt(_value, 10) === dataDict.value)) return Promise.resolve();
    const { type, label } = addDictForm.getFieldsValue(['type', 'label']);
    const tmp = dicts.filter((item) => item.type === type && item.label === label)
      .map(({ value }) => value);
    return tmp.includes(parseInt(_value, 10)) ? Promise.reject(new Error('该值已被占用，请输入其他值')) : Promise.resolve();
  }

  function validateDictName(rule: RuleObject, value: StoreValue) {
    if (value === '' || value === dataDict.name) return Promise.resolve();
    const { type, label } = addDictForm.getFieldsValue(['type', 'label']);
    const tmp = dicts.filter((item) => item.type === type && item.label === label)
      .map(({ name }) => name);
    return tmp.includes(value) ? Promise.reject(new Error('该名称已被占用，请输入其他值')) : Promise.resolve();
  }

  function onDictTypeSelect(_type: string) {
    setInputDictLabels(dictLabels.filter((item) => item.type === _type)
      .map(({ type, label_view, label }) => ({ label, label_view, type })));
    if (_type === dataDict.type) return;
    addDictForm.setFieldsValue({
      type_view: dictTypes.find((item) => item.type === _type)?.type_view || '',
      label_view: '',
      label: '',
    });
  }

  function onDictTypeBlur(event: React.FocusEvent<HTMLElement>) {
    if (event.target.getAttribute('value') === dataDict.type) return;
    addDictForm.setFieldsValue({
      type_view: dictTypes.find((item) => item.type === addDictForm.getFieldValue('type'))?.type_view || '',
      label_view: '',
      label: '',
    });
  }

  function onDictLabelSelect(label: string) {
    addDictForm.setFieldsValue({
      label_view: dictLabels.find((item) => item.label === label)?.label_view || '',
    });
  }

  function onTypeAndLevelBlur() {
    // addDictform.setFieldsValue({ typeAndLabel: ['1', '2'] });
  }

  return (
    <div className="container">
      <Form
        form={addDictForm}
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
            onBlur={onDictTypeBlur}
            options={dictTypes.map(({ type_view, type }) => ({ label: type_view, value: type }))}
          />
        </Form.Item>
        <Form.Item
          label="字段类名称"
          name="type_view"
          rules={[{ required: true, message: '请输入字段类名称!' }]}
        >
          <Input placeholder="请输入字段类名称" />
        </Form.Item>
        <Form.Item
          label="字段组"
          name="label"
          rules={[{ required: true, message: '请选择字段组!' }]}
        >
          <AutoComplete
            placeholder="请输入字段组"
            onSelect={onDictLabelSelect}
            onBlur={onTypeAndLevelBlur}
            options={inputDictLabels
              .map(({ label_view, label }) => ({ label: label_view, value: label }))}
          />
        </Form.Item>
        <Form.Item
          label="字段组名称"
          name="label_view"
          rules={[{ required: true, message: '请输入字段组名称!' }]}
        >
          <Input placeholder="请输入字段组名称" />
        </Form.Item>
        <Form.Item
          name="name"
          label="字段"
          rules={[{ required: true, message: '请输入字段!' }, { validator: validateDictName }]}
        >
          <Input placeholder="请输入字段" />
        </Form.Item>
        <Form.Item
          label="字段名称"
          name="name_view"
          rules={[{ required: true, message: '请选择字段名称!' }]}
        >
          <Input placeholder="请输入字段名称" />
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
          <Button type="primary" loading={createDictLoading || updateDictLoading} htmlType="submit">
            { createOrUpdate ? '添加' : '确定' }
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default withRouter(DictDetail);
