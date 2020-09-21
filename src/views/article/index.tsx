import React, { useState, useEffect } from 'react';
import { Table, Button, Space } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router';
import { ColumnProps } from 'antd/es/table';
import { connect } from 'react-redux';
import getColumnSearchProps from '../../components/MTableSearch';
import { AppState } from '../../store';
import { ROUTES_MAP } from '../../router';

const mapState2Props = (state: AppState) => ({
  articles: state.common.articles,
});

interface PropsI extends RouteComponentProps {
  articles: Array<ArticleI>
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
      dataIndex: 'category',
      ellipsis: true,
      onFilter: (value, record) => value === String(record.category_view),
      ...getColumnSearchProps('category'),
    },
    {
      title: '标签',
      dataIndex: 'tag',
      ellipsis: true,
      onFilter: (value, record) => value === String(record.category_view),
      ...getColumnSearchProps('tag'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      onFilter: (value, record) => value === record.status,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      sorter: (a, b) => a.createTime - b.createTime,
      sortDirections: ['descend', 'ascend'],
    },
  ];
}

const Articles: React.FC<PropsI> = (props: PropsI) => {
  const [article, setArticle] = useState<Array<ArticleI>>([]);
  const [dictListColumns, setDictListColumns] = useState<Array<ColumnProps<ArticleI>>>([]);
  const [articleCount, setArticleCount] = useState(0);
  const [loadMoreF, setLoadMoreF] = useState(false);

  useEffect(() => {
    setArticle(props.articles);
    setArticleCount(props.articles.length);
    setDictListColumns(getDictListColumns(props.articles));
  }, [props.articles]);

  function onCreateArticleClick() {
    props.history.push(`${ROUTES_MAP.article}/-1`);
  }

  function onUpdateArticleClick() {}

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
        scroll={{ y: '75vh' }}
      />
      <br />
      <Space>
        <Button type="primary" style={{ width: 100 }} onClick={onCreateArticleClick}>创建文章</Button>
        <Button type="primary" style={{ width: 100 }} onClick={onUpdateArticleClick}>同步仓库</Button>
        {
        articleCount > article.length
        && <Button style={{ marginLeft: 10, width: 100 }} loading={loadMoreF} onClick={onLoadMore}>加载更多</Button>
      }
      </Space>
    </div>
  );
};

export default connect(mapState2Props)(withRouter(Articles));
