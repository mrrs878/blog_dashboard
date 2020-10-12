import React from 'react';
import { Col, Row, Divider, Tabs, Tag, Space } from 'antd';
import { HomeOutlined, ContactsOutlined, ClusterOutlined, MessageOutlined, LikeOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import MEditableTagGroup from '../../components/MEditableTagGroup';

interface PropsI {
  user: UserI;
  articles: Array<ArticleI>;
}

const mapState2Props = (state: AppState) => ({
  user: state.common.user,
  articles: state.common.articles,
});

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

const Profile = (props: PropsI) => (
  <div className="container" style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
    <Row>
      <Col style={{ backgroundColor: '#fff', padding: 20, height: 'max-content' }} span={7}>
        <div style={{ textAlign: 'center' }}>
          <img width={140} style={{ marginBottom: 20 }} src="https://mrrsblog.oss-cn-shanghai.aliyuncs.com/avatar.jpg" alt="" srcSet="" />
          <p style={{ fontSize: 20, fontWeight: 700 }}>{props.user.name}</p>
          <p>Read the fucking source code</p>
        </div>
        <div style={{ marginLeft: 40 }}>
          <p>
            <ContactsOutlined />
            ：
            前端开发
          </p>
          <p>
            <ClusterOutlined />
            ：
            啊啊啊
          </p>
          <p>
            <HomeOutlined />
            ：
            顶顶顶
          </p>
        </div>
        <Divider />
        <div>
          <p>标签</p>
          <MEditableTagGroup defaultTags={['切图仔', '掏粪工']} addBtnText="添加标签" />
        </div>
        <Divider />
        <div>
          <p>团队</p>
          <MEditableTagGroup addBtnText="添加团队" />
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
  </div>
);

export default connect(mapState2Props)(Profile);
