import { Tag, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, {
  useCallback, useReducer, useRef, useState,
} from 'react';
import { clone } from 'ramda';

interface PropsI {
  tags: Array<string>;
}

interface ComplexStateI {
  editInputIndex: number;
  tags: Array<string>;
}

const STYLE: Record<string, React.CSSProperties> = {
  siteTagPlus: {
    background: '#fff',
    borderStyle: 'dashed',
  },
  editTag: {
    userSelect: 'none',
  },
  tagInput: {
    width: '78px',
    marginRight: '8px',
    verticalAlign: 'top',
  },
};

function reducer(state: ComplexStateI, action: any): ComplexStateI {
  switch (action.type) {
    case 'removeTag': {
      const { tags, editInputIndex } = state;
      const { removedTag } = action.data;
      return { editInputIndex, tags: tags.filter((tag) => tag !== removedTag) };
    }
    case 'addTag': {
      const { tags, editInputIndex } = state;
      const { newTag } = action.data;
      if (newTag && tags.indexOf(newTag) === -1) {
        return { editInputIndex, tags: [...tags, newTag] };
      }
      return state;
    }
    case 'updateIndex': {
      const { tags } = state;
      const { editInputIndex } = action.data;
      return { editInputIndex, tags };
    }
    case 'confirm': {
      const { editInputIndex, tags } = state;
      const { newTag } = action.data;
      const tmp = clone(tags);
      tmp[editInputIndex] = newTag || '';
      return { editInputIndex: -1, tags: tmp };
    }
    default:
      return state;
  }
}

const EditableTagGroup = (props: PropsI) => {
  const [inputVisible, setAddInputVisible] = useState(false);
  const editInputRef = useRef<Input>(null);
  const addInputRef = useRef<Input>(null);
  const [state, dispatch] = useReducer(reducer, { editInputIndex: -1, tags: props.tags });

  const handleClose = useCallback((removedTag) => {
    dispatch({ type: 'removeTag', data: { removedTag } });
  }, []);

  const showAddInput = useCallback(() => {
    setAddInputVisible(true);
    addInputRef.current?.focus();
  }, []);

  const handleAddInputConfirm = useCallback(() => {
    const newTag = addInputRef.current?.state.value;
    dispatch({ type: 'addTag', data: { newTag } });
    setAddInputVisible(false);
  }, []);

  const handleEditInputConfirm = useCallback((): any => {
    const { tags } = state;
    dispatch({ type: 'confirm', data: { index: -1, tags } });
  }, [state]);

  return (
    <>
      {state.tags.map((tag, index) => {
        if (state.editInputIndex === index) {
          return (
            <Input
              ref={editInputRef}
              key={tag}
              size="small"
              style={STYLE.tagInput}
              defaultValue={tag}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }

        const isLongTag = tag.length > 20;

        const tagElem = (
          <Tag
            style={STYLE.editTag}
            key={tag}
            closable
            onClose={() => handleClose(tag)}
          >
            <span
              onDoubleClick={(e) => {
                dispatch({ type: 'updateIndex', data: { editInputIndex: index } });
                editInputRef.current?.focus();
                e.preventDefault();
              }}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible && (
      <Input
        ref={addInputRef}
        type="text"
        size="small"
        style={STYLE.tagInput}
        onBlur={handleAddInputConfirm}
        onPressEnter={handleAddInputConfirm}
      />
      )}
      {!inputVisible && (
      <Tag style={STYLE.siteTagPlus} onClick={showAddInput}>
        <PlusOutlined />
        {' '}
        New Tag
      </Tag>
      )}
    </>
  );
};

export default EditableTagGroup;
