/*
 * @Author: your name
 * @Date: 2020-12-23 13:16:42
 * @LastEditTime: 2021-03-05 18:03:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /my-app/src/components/MTableSearch/index.tsx
 */
import { Button, Input } from 'antd';
import Highlighter from 'react-highlight-words';
import React, { ReactText, RefObject, useRef } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { FilterConfirmProps, FilterDropdownProps } from 'antd/es/table/interface';

interface SearchInputPropsI {
  selectedKeys?: Array<React.Key>;
  // eslint-disable-next-line react/no-unused-prop-types
  setSelectedKeys?: (selectedKeys: string[]) => void;
  confirm?: (params: FilterConfirmProps) => void;
  clearFilters?: () => void;
}

export default function getColumnSearchProps(dataIndex: string) {
  let inputRef: RefObject<Input | undefined>;
  let searchText: ReactText | undefined;
  let searchedColumn: string;
  const SearchInput: React.FC<SearchInputPropsI> = (props: SearchInputPropsI) => {
    inputRef = useRef<Input>();

    function handleSearch(selectedKeys: React.Key[] | undefined,
      confirm: ((params: FilterConfirmProps) => void) | undefined, index: string) {
      if (confirm) confirm({ closeDropdown: false });
      searchText = selectedKeys && selectedKeys[0];
      searchedColumn = index;
    }

    function handleReset(clearFilters: (() => void) | undefined) {
      if (clearFilters) clearFilters();
      searchText = '';
    }

    return (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`搜索 ${dataIndex}`}
          value={props.selectedKeys && props.selectedKeys[0]}
          onPressEnter={() => handleSearch(props.selectedKeys, props.confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(props.selectedKeys, props.confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          搜索
        </Button>
        <Button onClick={() => handleReset(props.clearFilters)} size="small" style={{ width: 90 }}>
          重置
        </Button>
      </div>
    );
  };
  SearchInput.defaultProps = {
    selectedKeys: [],
    setSelectedKeys: () => {},
    confirm: () => {},
    clearFilters: () => {},
  };

  return {
    filterDropdown({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }: FilterDropdownProps) {
      return (
        <SearchInput
          confirm={confirm}
          setSelectedKeys={setSelectedKeys}
          selectedKeys={selectedKeys}
          clearFilters={clearFilters}
        />
      );
    },
    filterIcon(filtered: boolean) {
      return <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />;
    },
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => inputRef.current?.select());
      }
    },
    render(text: string) {
      return searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[String(searchText)]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      );
    },
  };
}
