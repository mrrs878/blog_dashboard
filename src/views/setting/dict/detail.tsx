import React, { useEffect, useState } from 'react';
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

const emptyDict: DictI = { _id: '', status: 0, label: '', label_view: '', type: '', type_view: '', name: '', name_view: '', value: 0, createTime: '', updateTime: '' };

const DictDetail = (props: PropsI) => {
  const [dicts] = useState(props.state.dicts);
  const [dataDict, setDataDict] = useState<DictI>(emptyDict);
  const [createOrUpdate, setCreateOrUpdate] = useState(false);
  const [dictStatus, setDictStatus] = useState<Array<{ value: number; title: string }>>([]);
  const [dictTypes, setDictTypes] = useState<Array<{ type: string, type_view: string }>>([]);
  const [dictLabels, setDictLabels] = useState<Array<{ type: string, label_view: string, label: string }>>([]);
  const [inputDictLabels, setInputDictLabels] = useState<Array<{ type: string, label_view: string, label: string }>>([]);
  const [, createDictRes, createDict] = useRequest<CreateDictReqT, GetDictResT>(CREATE_DICT, emptyDict, false);
  const [, updateDictRes, updateDict] = useRequest<UpdateDictReqT, GetDictResT>(UPDATE_DICT, emptyDict, false);
  const [getDicts] = useGetDicts(false);
  const [addDictform] = Form.useForm();

  useEffect(() => {
    const _dictTypes = uniq(dicts.map(({ type, type_view }) => ({ type, type_view })));
    const _dictLabels = uniq(dicts.map(({ type, label, label_view }) => ({ type, label, label_view })));
    const _dictStatus = dicts.filter((item) => item.label === 'status').map((item) => ({ value: item.value, title: item.name_view }));
    setDictLabels(_dictLabels);
    setDictTypes(_dictTypes);
    setDictStatus(_dictStatus);
  }, [dicts]);

  useEffect(() => {
    const { type, type_view, label, label_view, name, status, value, name_view } = dataDict;
    addDictform.setFieldsValue({ type, type_view, label, label_view, name, status, value, name_view });
  }, [dataDict, addDictform, dicts]);

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
    const { type, label, name, status, value, name_view, label_view, type_view } = values;
    const data: DictI = { type, label, name, status, value, type_view, label_view, name_view };
    if (createOrUpdate) createDict(data);
    else updateDict({ ...data, _id: props.match.params.id });
  }

  function onReset() {
    if (createOrUpdate) addDictform.resetFields();
    else {
      addDictform.setFieldsValue({
        type_view: dataDict.type_view,
        label_view: dataDict.label_view,
        name: dataDict.name,
        status: dataDict.status,
        value: dataDict.value,
      });
    }
  }

  function validateDictValue(rule: RuleObject, _value: StoreValue) {
    if (_value === '' || (_value >> 0 === dataDict.value)) return Promise.resolve();
    const { type, label } = addDictform.getFieldsValue(['type', 'label']);
    const tmp = dicts.filter((item) => item.type === type && item.label === label).map(({ value }) => value);
    return tmp.includes(_value >> 0) ? Promise.reject(new Error('该值已被占用，请输入其他值')) : Promise.resolve();
  }

  function validateDictName(rule: RuleObject, value: StoreValue) {
    if (value === '' || value === dataDict.name) return Promise.resolve();
    const { type, label } = addDictform.getFieldsValue(['type', 'label']);
    const tmp = dicts.filter((item) => item.type === type && item.label === label).map(({ name }) => name);
    return tmp.includes(value) ? Promise.reject(new Error('该名称已被占用，请输入其他值')) : Promise.resolve();
  }

  function onDictTypeSelect(_type: string, option: any) {
    setInputDictLabels(dictLabels.filter((item) => item.type === _type).map(({ type, label_view, label }) => ({ label, label_view, type })));
    if (_type === dataDict.type) return;
    addDictform.setFieldsValue({
      type_view: dictTypes.find((item) => item.type === _type)?.type_view || '',
      label_view: '',
      label: '',
    });
  }

  function onDictTypeBlur(event: React.FocusEvent<HTMLElement>) {
    if (event.target.getAttribute('value') === dataDict.type) return;
    addDictform.setFieldsValue({
      type_view: dictTypes.find((item) => item.type === addDictform.getFieldValue('type')) ?.type_view || '',
      label_view: '',
      label: '',
    });
  }

  function onDictLabelSelect(label: string) {
    addDictform.setFieldsValue({
      label_view: dictLabels.find((item) => item.label === label)?.label_view || '',
    });
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
            onBlur={onTypeAndLavelBlur}
            options={inputDictLabels.map(({ label_view, label }) => ({ label: label_view, value: label }))}
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
          <Button type="primary" htmlType="submit">
            { createOrUpdate ? '添加' : '确定' }
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(mapState2Props)(withRouter(DictDetail));
