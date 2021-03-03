/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-12-23 13:16:42
 * @LastEditTime: 2021-02-03 15:41:16
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: /my-app/src/views/comment/index.tsx
 */
import React, { useState, useEffect } from 'react';
import { ColumnProps } from 'antd/lib/table';
import { Space, Table, Button } from 'antd';
import { withRouter } from 'react-router';
import useRequest from '../../hooks/useRequest';
import { GET_AUTHOR_COMMENTS } from '../../api/comment';
import getColumnSearchProps from '../../components/MTableSearch';

function getCommentListColumns(): Array<ColumnProps<AuthorCommentsI>> {
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
      dataIndex: ['creator', 'name'],
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

const Comments = () => {
  const [getCommentsLoading, getCommentsRes, , reGetComments] = useRequest<GetCommentsReqI, GetAuthorCommentsResI>(GET_AUTHOR_COMMENTS);
  const [commentListColumns, setCommentListColumns] = useState<Array<ColumnProps<AuthorCommentsI>>>([]);
  const [loadMoreF, setLoadMoreF] = useState(false);
  const [comment, setComment] = useState<Array<AuthorCommentsI>>([]);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    if (!getCommentsRes) return;
    setComment(getCommentsRes.data || []);
    setCommentCount(getCommentsRes.data?.length || 0);
    setCommentListColumns(getCommentListColumns());
  }, [getCommentsRes]);

  function onCommentListRow() {
    return {
      onClick: () => {
        // props.history.push(`${ROUTES_MAP.comment}/${record._id}`);
      },
    };
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

  return (
    <div className="container">
      <Table
        columns={commentListColumns}
        rowKey={(record) => String(record._id)}
        onRow={onCommentListRow}
        dataSource={comment}
        pagination={{ defaultPageSize: 20 }}
        title={() => (
          <Space>
            <Button type="primary" style={{ width: 100 }} loading={getCommentsLoading} onClick={reGetComments}>刷新</Button>
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
