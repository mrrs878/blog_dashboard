/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-12-23 13:16:42
 * @LastEditTime: 2021-03-05 17:58:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /my-app/src/components/MEditor/Preview.tsx
 */
import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Space } from 'antd';
import {
  CalendarOutlined, FolderOutlined, UserOutlined, PaperClipOutlined,
} from '@ant-design/icons';
import { Base64 } from 'js-base64';
import CodeBlock from './CodeBlock';
import '../../assets/less/md.theme.orange.less';
import style from './preview.module.less';
import useDocumentTitle from '../../hooks/useDocumentTitle';

interface PropsI {
  value: IArticle;
  fullscreen?: boolean;
}

const Preview = (props: PropsI) => {
  const formattedMd = useMemo(
    () => {
      const {
        title, createTime, updateTime, tags, categories, content, author,
      } = props.value;
      return ({
        title, createTime, updateTime, tags, categories, author, description: '', content: Base64.decode(content).split('---')[2],
      });
    },
    [props.value],
  );
  useDocumentTitle(formattedMd?.title || 'my blog');

  return (
    <div className={`container ${props.fullscreen ? '' : style.editScreen}`} id="write" style={{ display: 'block' }}>
      {
        formattedMd?.title && (
        <div style={{ textAlign: 'center' }}>
          <h1>{ formattedMd?.title }</h1>
          <Space style={{ color: '#999' }}>
            { formattedMd?.author && (
            <span>
              <UserOutlined />
              作者
                { formattedMd?.author }
            </span>
            )}
            { formattedMd?.createTime
              && (
              <span>
                <CalendarOutlined />
                {' '}
                创建于
                  { formattedMd?.createTime }
              </span>
              )}
            { formattedMd?.updateTime && (
              <span>
                更新于
                { formattedMd?.updateTime }
              </span>
            )}
            { formattedMd?.categories && (
              <span>
                <FolderOutlined />
                {' '}
                分类于
                <a href={`/all/category/${formattedMd?.categories}`}>{ formattedMd?.categories }</a>
              </span>
            ) }
            { formattedMd?.tags && (
            <span>
              <PaperClipOutlined />
              {' '}
              标签
              <a href={`/all/category/${formattedMd?.tags}`}>{ formattedMd?.tags }</a>
            </span>
            ) }
          </Space>
        </div>
        )
}
      <ReactMarkdown
        source={formattedMd?.content}
        renderers={{ code: CodeBlock }}
      />
    </div>
  );
};

Preview.defaultProps = {
  fullscreen: false,
};

export default Preview;
