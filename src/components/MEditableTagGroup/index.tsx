import React, { useCallback, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Tag, Input } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';

interface PropsI {
  defaultTags?: Array<string>;
  addBtnText?: string;
  onConfirm: (tags: Array<string>) => void;
  onRemove: (tags: Array<string>) => void;
}

const MEditableTagGroup = (props: PropsI) => {
  const [tags, setTags] = useState<Array<string>>(props.defaultTags || []);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleClose = useCallback((removedTag: string) => {
    const _tags = tags.filter((tag) => tag !== removedTag);
    setTags(_tags);
    props.onRemove(_tags);
  }, [props, tags]);

  const ForMap = (tag: string) => (
    <span key={tag} style={{ display: 'inline-block' }}>
      <Tag
        closable
        onClose={(e: any) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    </span>
  );

  const showInput = useCallback(() => {
    setInputVisible(true);
  }, []);

  const handleInputChange = useCallback((e: any) => {
    setInputValue(e.target.value);
  }, []);

  const handleInputConfirm = useCallback(() => {
    let _tags: Array<string> = [];
    if (inputValue && tags.indexOf(inputValue) === -1) {
      _tags = [...tags, inputValue];
    }
    setTags(_tags);
    setInputValue('');
    setInputVisible(false);
    props.onConfirm(_tags);
  }, [inputValue, props, tags]);

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <TweenOneGroup
          enter={{
            scale: 0.8,
            opacity: 0,
            type: 'from',
            duration: 100,
            onComplete: (e: any) => {
              e.target.style = '';
            },
          }}
          leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
          appear={false}
        >
          {tags.map(ForMap)}
        </TweenOneGroup>
      </div>
      {inputVisible && (
      <Input
        autoFocus
        type="text"
        size="small"
        style={{ width: 78 }}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputConfirm}
        onPressEnter={handleInputConfirm}
      />
      )}
      {!inputVisible && (
      <Tag onClick={showInput} className="site-tag-plus">
        <PlusOutlined />
        {' '}
        { props.addBtnText || 'New Tag' }
      </Tag>
      )}
    </>
  );
};

MEditableTagGroup.defaultProps = {
  defaultTags: [],
  addBtnText: '',
};

export default MEditableTagGroup;
