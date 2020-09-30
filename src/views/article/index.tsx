import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router';
import { ColumnProps } from 'antd/es/table';
import { connect } from 'react-redux';
import getColumnSearchProps from '../../components/MTableSearch';
import { AppState } from '../../store';
import { ROUTES_MAP } from '../../router';
import ARTICLE_MODULE from '../../modules/article';
import useGetArticles from '../../hooks/useGetArticles';

const mapState2Props = (state: AppState) => ({
  articles: state.common.articles,
});

interface PropsI extends RouteComponentProps {
  articles: Array<ArticleI>
}

function getCategories(articles: Array<ArticleI>) {
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

function getDictListColumns(articles: Array<ArticleI>): Array<ColumnProps<ArticleI>> {
  return [
    {
      title: '名称',
      dataIndex: 'title',
      ellipsis: true,
      ...getColumnSearchProps('title'),
    },
    {
      title: '类别',
      dataIndex: 'categories',
      ellipsis: true,
      filters: getCategories(articles),
      onFilter: (value, record) => value === String(record.categories),
    },
    {
      title: '标签',
      dataIndex: 'tag',
      ellipsis: true,
      onFilter: (value, record) => value === String(record.categories),
      ...getColumnSearchProps('tag'),
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
  ];
}

const Articles: React.FC<PropsI> = (props: PropsI) => {
  const [article, setArticle] = useState<Array<ArticleI>>([]);
  const [dictListColumns, setDictListColumns] = useState<Array<ColumnProps<ArticleI>>>([]);
  const [articleCount, setArticleCount] = useState(0);
  const [loadMoreF, setLoadMoreF] = useState(false);
  const [getArticles] = useGetArticles();

  useEffect(() => {
    getArticles();
  }, [getArticles]);

  useEffect(() => {
    setArticle(props.articles);
    setArticleCount(props.articles.length);
    setDictListColumns(getDictListColumns(props.articles));
  }, [props.articles]);

  function onCreateArticleClick() {
    props.history.push(`${ROUTES_MAP.article}/-1`);
  }

  async function onUpdateArticleClick() {
    await ARTICLE_MODULE.getArticles();
    message.info('刷新成功');
  }

  async function onLoadMore() {
    try {
      setLoadMoreF(true);
      setLoadMoreF(false);
    } catch (e) {
      console.log(e);
    }
    setLoadMoreF(true);
  }

  function onArticleListRow(record: ArticleI) {
    return {
      onClick: () => {
        props.history.push(`${ROUTES_MAP.article}/${record._id}`);
      },
    };
  }

  return (
    <div className="container">
      <Table
        columns={dictListColumns}
        rowKey={(record) => String(record._id)}
        onRow={onArticleListRow}
        dataSource={article}
        pagination={{ defaultPageSize: 20 }}
        scroll={{ y: 100 }}
      />
      <Space>
        <Button type="primary" style={{ width: 100 }} onClick={onCreateArticleClick}>创建文章</Button>
        <Button type="primary" style={{ width: 100 }} onClick={onUpdateArticleClick}>刷新</Button>
        {
        articleCount > article.length
        && <Button style={{ marginLeft: 10, width: 100 }} loading={loadMoreF} onClick={onLoadMore}>加载更多</Button>
      }
      </Space>
    </div>
  );
};

export default connect(mapState2Props)(withRouter(Articles));
