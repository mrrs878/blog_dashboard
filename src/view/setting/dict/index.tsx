import React, { useState, useEffect } from 'react';
import { Table, Button, Space } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ColumnProps } from 'antd/es/table';
import getColumnSearchProps from '../../../components/MTableSearch';
import { getTableFilters } from '../../../components/MTableFilters';
import useGetDicts from '../../../hooks/useGetDicts';
import { useModel } from '../../../store';
import { ROUTES_MAP } from '../../../route';

interface PropsI extends RouteComponentProps {
}

function getDictListColumns(dicts: Array<IDict>): Array<ColumnProps<IDict>> {
  return [
    {
      title: '名称',
      dataIndex: 'name_view',
      ellipsis: true,
      ...getColumnSearchProps('name_view'),
    },
    {
      title: '值',
      dataIndex: 'value',
    },
    {
      title: '组别',
      dataIndex: 'label_view',
      ellipsis: true,
      onFilter: (value, record) => value === String(record.label_view),
      ...getColumnSearchProps('label_view'),
    },
    {
      title: '类别',
      dataIndex: 'type_view',
      ellipsis: true,
      onFilter: (value, record) => value === String(record.type),
      ...getColumnSearchProps('type_view'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: getTableFilters<IDict>(dicts, (item: IDict) => item.type === 'common' && item.label === 'status'),
      onFilter: (value, record) => value === record.status,
    },
    {
      title: '创建者',
      dataIndex: ['creator', 'name'],
    },
    {
      title: '更新者',
      dataIndex: ['updater', 'name'],
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      sorter: (a, b) => new Date(a.createTime || '').getTime() - new Date(b.createTime || '').getTime(),
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

const Dict: React.FC<PropsI> = (props: PropsI) => {
  const [dict, setDict] = useState<Array<IDict>>([]);
  const [dictListColumns, setDictListColumns] = useState<Array<ColumnProps<IDict>>>([]);
  const [dictCount, setDictCount] = useState(0);
  const [loadMoreF, setLoadMoreF] = useState(false);
  const [, reGetDicts, getDictsLoading] = useGetDicts(false, true);
  const [dicts] = useModel('dicts');

  useEffect(() => {
    setDict(dicts);
    setDictCount(dicts.length);
    setDictListColumns(getDictListColumns(dicts));
  }, [dicts]);

  function onCreateDictsClick() {
    props.history.push(`${ROUTES_MAP.dict}/-1`);
  }

  function onRefreshDictsClick() {
    reGetDicts();
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

  function onDictListRow(record: IDict) {
    return {
      onClick: () => {
        props.history.push(`${ROUTES_MAP.dict}/${record._id}`);
      },
    };
  }

  return (
    <div className="container">
      <Table
        columns={dictListColumns}
        rowKey={(record) => String(record._id)}
        onRow={onDictListRow}
        dataSource={dict}
        pagination={{ defaultPageSize: 20 }}
        title={() => (
          <Space>
            <Button type="primary" style={{ width: 100 }} onClick={onCreateDictsClick}>添加字段</Button>
            <Button type="primary" style={{ width: 100 }} loading={getDictsLoading} onClick={onRefreshDictsClick}>刷新</Button>
            {
              dictCount > dict.length
              && (
              <Button
                style={{ marginLeft: 10, width: 100 }}
                loading={loadMoreF}
                onClick={onLoadMore}
              >
                加载更多
              </Button>
              )
            }
          </Space>
        )}
      />
    </div>
  );
};

export default withRouter(Dict);
