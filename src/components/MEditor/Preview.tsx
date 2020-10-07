import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Space } from 'antd';
import { CalendarOutlined, FolderOutlined, UserOutlined } from '@ant-design/icons';
import { Base64 } from 'js-base64';
import CodeBlock from './CodeBlock';
import '../../assets/less/md.theme.orange.less';
import style from './preview.module.less';

interface PropsI {
  value: ArticleI;
  fullscreen?: boolean;
}

const Preview = (props: PropsI) => {
  const [formattedMd, setFormattedMd] = useState<ArticleI>();
  useEffect(() => {
    const { title, createTime, updateTime, tag, categories, content, author } = props.value;
    setFormattedMd({ title, createTime, updateTime, tag, categories, author, description: '', content: Base64.decode(content).split('---')[2] });
  }, [props]);
  useEffect(() => {
    document.title = formattedMd?.title || 'my blog';
  }, [formattedMd]);

  return (
    <div className={`container ${props.fullscreen ? '' : style.editScreen}`} id="write" style={{ display: 'block' }}>
      {
        formattedMd?.title && (
        <div style={{ textAlign: 'center' }}>
          <h1>{ formattedMd?.title }</h1>
          <Space style={{ color: '#999' }}>
            { formattedMd?.updateTime && (
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

export default Preview;
