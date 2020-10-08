import React, { useState, useEffect } from 'react';
import { ColumnProps } from 'antd/lib/table';
import { Space, Table, Button, message } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import useRequest from '../../hooks/useRequest';
import { GET_AUTHOR_COMMENTS } from '../../api/comment';
import getColumnSearchProps from '../../components/MTableSearch';
import { ROUTES_MAP } from '../../router';

interface PropsI extends RouteComponentProps {}

function getCommentListColumns(comments: Array<CommentI>): Array<ColumnProps<CommentI>> {
  return [
    {
      title: '文章',
      dataIndex: 'comment_id',
      ellipsis: true,
      ...getColumnSearchProps('comment_id'),
    },
    {
      title: '内容',
      dataIndex: 'content',
      ellipsis: true,
      ...getColumnSearchProps('content'),
    },
    {
      title: 'user_id',
      dataIndex: 'user_id',
      ellipsis: true,
      ...getColumnSearchProps('user_id'),
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
  const [, getCommentsRes] = useRequest<GetCommentsReqI, GetCommentsResI>(GET_AUTHOR_COMMENTS, { id: '' });
  const [commentListColumns, setCommentListColumns] = useState<Array<ColumnProps<CommentI>>>([]);
  const [loadMoreF, setLoadMoreF] = useState(false);
  const [comment, setComment] = useState<Array<CommentI>>([]);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    if (!getCommentsRes) return;
    message.info(getCommentsRes.msg);
    setComment(getCommentsRes.data || []);
    setCommentCount(getCommentsRes.data?.length || 0);
    setCommentListColumns(getCommentListColumns(getCommentsRes.data || []));
  }, [getCommentsRes]);

  function onCommentListRow(record: CommentI) {
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
      />
      <Space>
        <Button type="primary" style={{ width: 100 }} onClick={onUpdateCommentClick}>刷新</Button>
        {
          commentCount > comment.length
          && <Button style={{ marginLeft: 10, width: 100 }} loading={loadMoreF} onClick={onLoadMore}>加载更多</Button>
        }
      </Space>
    </div>
  );
};

export default withRouter(Comments);
