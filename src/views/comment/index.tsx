import React, { useState, useEffect } from 'react';
import { ColumnProps } from 'antd/lib/table';
import { Space, Table, Button } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import useRequest from '../../hooks/useRequest';
import { GET_AUTHOR_COMMENTS } from '../../api/comment';
import getColumnSearchProps from '../../components/MTableSearch';
import { ROUTES_MAP } from '../../router';

interface PropsI extends RouteComponentProps {}

function getCommentListColumns(comments: Array<AuthCommentsI>): Array<ColumnProps<AuthCommentsI>> {
  return [
    {
      title: '文章',
      dataIndex: ['article', 'title'],
      ellipsis: true,
    },
    {
      title: '内容',
      dataIndex: 'content',
      ellipsis: true,
      ...getColumnSearchProps('content'),
    },
    {
      title: '评论者',
      dataIndex: 'name',
      ellipsis: true,
      ...getColumnSearchProps('name'),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
      sortDirections: ['descend', 'ascend'],
    },
  ];
}

const Comments = (props: PropsI) => {
  const [, getCommentsRes] = useRequest<GetCommentsReqI, GetAuthCommentsResI>(GET_AUTHOR_COMMENTS, { id: '' });
  const [commentListColumns, setCommentListColumns] = useState<Array<ColumnProps<AuthCommentsI>>>([]);
  const [loadMoreF, setLoadMoreF] = useState(false);
  const [comment, setComment] = useState<Array<AuthCommentsI>>([]);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    if (!getCommentsRes) return;
    setComment(getCommentsRes.data || []);
    setCommentCount(getCommentsRes.data?.length || 0);
    setCommentListColumns(getCommentListColumns(getCommentsRes.data || []));
  }, [getCommentsRes]);

  function onCommentListRow(record: AuthCommentsI) {
    return {
      onClick: () => {
        props.history.push(`${ROUTES_MAP.comment}/${record._id}`);
      },
    };
  }

  function onUpdateCommentClick() {}

  async function onLoadMore() {
    try {
      setLoadMoreF(true);
      setLoadMoreF(false);
    } catch (e) {
      console.log(e);
    }
    setLoadMoreF(true);
  }

  return (
    <div className="container">
      <Table
        columns={commentListColumns}
        rowKey={(record) => String(record._id)}
        onRow={onCommentListRow}
        dataSource={comment}
        pagination={{ defaultPageSize: 20 }}
        scroll={{ y: 100 }}
        title={() => (
          <Space>
            <Button type="primary" style={{ width: 100 }} onClick={onUpdateCommentClick}>刷新</Button>
            {
            commentCount > comment.length
            && <Button style={{ marginLeft: 10, width: 100 }} loading={loadMoreF} onClick={onLoadMore}>加载更多</Button>
          }
          </Space>
        )}
      />
    </div>
  );
};

export default withRouter(Comments);
