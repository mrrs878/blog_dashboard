import React, { useState, useEffect } from 'react';
import { Col, Row, Divider, Tabs, Tag, Space, Form, Button, Modal, Input, message } from 'antd';
import { HomeOutlined, ContactsOutlined, ClusterOutlined, MessageOutlined, LikeOutlined, EditOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import MEditableTagGroup from '../../components/MEditableTagGroup';
import useRequest from '../../hooks/useRequest';
import { UPDATE_USER } from '../../api/user';
import useGetUserInfoByToken from '../../hooks/useGetUserInfoByToken';

interface PropsI {
  user: UserI;
  articles: Array<ArticleI>;
}

const mapState2Props = (state: AppState) => ({
  user: state.common.user,
  articles: state.common.articles,
});

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 14 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 4,
      offset: 4,
    },
    sm: {
      span: 8,
      offset: 8,
    },
  },
};

const { TabPane } = Tabs;

const ArticleSummary = (props: { article: ArticleI }) => (
  <Space direction="vertical">
    <h2 style={{ cursor: 'pointer' }}>{ props.article.title }</h2>
    {
      props.article.tags.split(' ').map((item) => (
        <Tag>{item}</Tag>
      ))
    }
    <span>{ props.article.description }</span>
    <div>
      <span style={{ fontSize: 18, color: '#1890ff' }}>{ props.article.author }</span>
      { ' ' }
      发表在
      <a href="https://blog.mrrs.top" target="_blank" rel="noopener noreferrer">https://blog.mrrs.top</a>
      { ' ' }
      { props.article.createTime }
      { ' ' }
      {
        props.article.updateTime && `更新于 ${props.article.updateTime}`
      }
    </div>
    <Space split={<Divider type="vertical" />}>
      <span>
        <MessageOutlined />
        { ' ' }
        12
      </span>
      <span>
        <LikeOutlined />
        { ' ' }
        12
      </span>
    </Space>
    <Divider />
  </Space>
);

const Profile = (props: PropsI) => {
  const [editModalF, setEditModalF] = useState(false);
  const [editForm] = Form.useForm();
  const [, updateUserRes, updateUser] = useRequest(UPDATE_USER, undefined, false);
  const [getUserInfo] = useGetUserInfoByToken(false, false);

  useEffect(() => {
    editForm.setFieldsValue(props.user);
  }, [editForm, props.user]);

  useEffect(() => {
    if (!updateUserRes) return;
    const { msg, success } = updateUserRes;
    message.info(msg);
    if (success) getUserInfo();
  }, [getUserInfo, updateUserRes]);

  function onEditClick() {
    setEditModalF(true);
  }

  function onFinish(value: any) {
    const {
      _id, name, role, avatar, createdBy, profession, tags, signature, department, address, teams,
    } = props.user;
    const newInfo = { _id, name, role, avatar, createdBy, profession, tags, signature, department, address, teams, ...value };
    updateUser(newInfo);
    setEditModalF(false);
  }

  function onReset() {
    editForm.setFieldsValue(props.user);
  }

  function onTagsEdit(tags: Array<string>) {
    const {
      _id, name, role, avatar, createdBy, profession, signature, department, address, teams,
    } = props.user;
    const newInfo = { _id, name, role, avatar, createdBy, profession, signature, department, address, teams, tags };
    updateUser(newInfo);
    setEditModalF(false);
  }

  function onTeamsEdit(teams: Array<string>) {
    const {
      _id, name, role, avatar, createdBy, profession, signature, tags, department, address,
    } = props.user;
    const newInfo = { _id, name, role, avatar, createdBy, profession, signature, department, address, tags, teams };
    updateUser(newInfo);
    setEditModalF(false);
  }

  return (
    <div className="container" style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
      <Row>
        <Col style={{ backgroundColor: '#fff', padding: 20, height: 'max-content', position: 'relative' }} span={7}>
          <Button onClick={onEditClick} style={{ position: 'absolute', right: 20, top: 20 }} icon={<EditOutlined />} />
          <div style={{ textAlign: 'center' }}>
            <img width={140} style={{ marginBottom: 20 }} src={props.user.avatar} alt="" srcSet="" />
            <p style={{ fontSize: 20, fontWeight: 700 }}>{props.user.name}</p>
            <p>{props.user.signature}</p>
          </div>
          <div style={{ marginLeft: 40 }}>
            <p>
              <ContactsOutlined />
              ：
              { props.user.profession }
            </p>
            <p>
              <ClusterOutlined />
              ：
              { props.user.department }
            </p>
            <p>
              <HomeOutlined />
              ：
              { props.user.address }
            </p>
          </div>
          <Divider />
          <div>
            <p>标签</p>
            <MEditableTagGroup
              onConfirm={onTagsEdit}
              onRemove={onTagsEdit}
              defaultTags={props.user.tags.map((item) => item)}
              addBtnText="添加标签"
            />
          </div>
          <Divider />
          <div>
            <p>团队</p>
            <MEditableTagGroup
              onConfirm={onTeamsEdit}
              onRemove={onTeamsEdit}
              defaultTags={props.user.teams.map((item) => item)}
              addBtnText="添加团队"
            />
          </div>
        </Col>
        <Col style={{ backgroundColor: '#fff', padding: 20 }} span={16} offset={1}>
          <Tabs type="card">
            <TabPane tab="文章" key="article">
              <div onClick={(e) => console.log(e)}>
                {
                  props.articles.map((item) => <ArticleSummary key={item._id} article={item} />)
                }
              </div>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
      <Modal
        footer={false}
        visible={editModalF}
        forceRender
        onCancel={() => setEditModalF(false)}
      >
        <Form
          form={editForm}
          labelCol={formItemLayout.labelCol}
          wrapperCol={formItemLayout.wrapperCol}
          onFinish={onFinish}
          onReset={onReset}
        >
          <Form.Item
            label="用户名"
            name="name"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            label="签名"
            name="signature"
          >
            <Input placeholder="请输入签名" />
          </Form.Item>
          <Form.Item
            label="职业"
            name="profession"
          >
            <Input placeholder="请输入职业" />
          </Form.Item>
          <Form.Item
            label="部门"
            name="department"
          >
            <Input placeholder="请输入部门" />
          </Form.Item>
          <Form.Item
            label="住址"
            name="address"
          >
            <Input placeholder="请输入住址" />
          </Form.Item>
          <Form.Item wrapperCol={tailFormItemLayout.wrapperCol}>
            <Button htmlType="reset">重置</Button>
            <Divider type="vertical" />
            <Button type="primary" htmlType="submit">保存</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect(mapState2Props)(Profile);
