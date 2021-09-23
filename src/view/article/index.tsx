import React, { useCallback, useMemo, useEffect } from 'react';
import {
  Table, Button, Space, message, Switch, Modal, Row, Col,
} from 'antd';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ColumnProps } from 'antd/es/table';
import { EyeOutlined, LinkOutlined } from '@ant-design/icons';
import { useRequest } from '@mrrs878/hooks';

import useGetArticles from '../../hook/useGetArticles';
import { UPDATE_ARTICLE_STATUS } from '../../api/article';
import { useModel } from '../../store';

interface PropsI extends RouteComponentProps {
}

function getCategories(articles: Array<IArticle>) {
  const categories: Map<string, number> = new Map();
  articles.forEach((item) => {
    const count = categories.get(item.categories) || 0;
    categories.set(item.categories, count + 1);
  });
  const tmp: Array<{ text: string; value: string }> = [];
  categories.forEach((key, value) => {
    tmp.push({ text: `${value}(${key})`, value });
  });
  return tmp;
}

const Articles: React.FC<PropsI> = (props: PropsI) => {
  const [articles] = useModel('articles');
  const categories = useMemo(() => getCategories(articles), [articles]);
  const [, updateArticleRes, updateArticle] = useRequest(UPDATE_ARTICLE_STATUS, false);
  const { getArticlesLoading, reGetArticles } = useGetArticles(false, true);

  useEffect(() => {
    if (!updateArticleRes) return;
    message.info(updateArticleRes.return_message);
    setTimeout(reGetArticles, 2000);
  }, [reGetArticles, updateArticleRes]);

  const onStatusChange = useCallback((status: boolean, _id = '') => {
    const text = status ? '启用' : '关闭';
    Modal.confirm({
      title: '提示',
      content: `确定${text}该文章吗？`,
      okText: text,
      cancelText: '取消',
      onCancel: () => Promise.resolve(),
      onOk: () => {
        updateArticle({ status: Number(status), _id });
      },
    });
  }, [updateArticle]);

  const onViewClick = useCallback((_id = '') => {
    props.history.push(`/articles/${_id}`);
  }, [props.history]);

  const articleListColumns: Array<ColumnProps<IArticle>> = useMemo(() => [
    {
      title: '名称',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: '作者',
      dataIndex: 'author',
      ellipsis: true,
    },
    {
      title: '类别',
      dataIndex: 'categories',
      ellipsis: true,
      filters: categories,
      onFilter: (value, record) => value === String(record.categories),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      ellipsis: true,
      onFilter: (value, record) => value === String(record.tags),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (item, record) => (
        <Switch
          onChange={(status) => onStatusChange(status, record._id)}
          checked={item === 1}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      ellipsis: true,
      sorter: (a, b) => new Date(a.updateTime || '').getTime() - new Date(b.updateTime || '').getTime(),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'action',
      render: (item, record) => (
        <Button
          onClick={() => onViewClick(record._id)}
          icon={<EyeOutlined />}
        />
      ),
    },
  ], [categories, onStatusChange, onViewClick]);

  const onCreateArticleClick = useCallback(() => {
    props.history.push('/articles/-1');
  }, [props.history]);

  const onUpdateArticleClick = useCallback(async () => {
    await reGetArticles();
    message.info('刷新成功');
  }, [reGetArticles]);

  return (
    <div className="container" style={{ padding: 0 }}>
      <Table
        columns={articleListColumns}
        rowKey={(record) => String(record._id)}
        dataSource={articles}
        pagination={{ defaultPageSize: 20 }}
        title={() => (
          <Row>
            <Col>
              <Space>
                <Button type="primary" style={{ width: 100 }} onClick={onCreateArticleClick}>创建文章</Button>
                <Button type="primary" style={{ width: 100 }} onClick={onUpdateArticleClick} loading={getArticlesLoading}>刷新</Button>
              </Space>
            </Col>
            <Col flex={1} />
            <Col>
              <Button type="link" href="https://blog.mrrs.top" icon={<LinkOutlined />} />
            </Col>
          </Row>
        )}
      />
    </div>
  );
};

export default withRouter(Articles);
