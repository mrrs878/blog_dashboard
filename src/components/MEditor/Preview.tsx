import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Space } from 'antd';
import { CalendarOutlined, FolderOutlined } from '@ant-design/icons';
import { Base64 } from 'js-base64';
import CodeBlock from './CodeBlock';
import '../../assets/less/md.theme.orange.less';
import style from './preview.module.less';

interface PropsI {
  value: ArticleI;
  fullscreen?: boolean;
}

const Preview = (props: PropsI) => {
  const [formattedMd, setFormattedMd] = useState<{ head: ArticleSubI; content: string }>();
  useEffect(() => {
    const { title, createTime, tag, categories, content } = props.value;
    console.log(Base64.decode(content).split('---')[2]);
    setFormattedMd({ head: { title, createTime, tag, categories }, content: Base64.decode(content).split('---')[2] });
  }, [props]);
  useEffect(() => {
    document.title = formattedMd?.head?.title || 'my blog';
  }, [formattedMd]);

  return (
    <div className={`container ${props.fullscreen ? '' : style.editScreen}`} id="write" style={{ display: 'block' }}>
      {
        formattedMd?.head.title && (
        <div style={{ textAlign: 'center' }}>
          <h1>{ formattedMd?.head?.title }</h1>
          <Space style={{ color: '#999' }}>
            { formattedMd?.head?.createTime
              && (
              <span>
                <CalendarOutlined />
                {' '}
                创建于
                  { formattedMd?.head?.createTime }
              </span>
            )}
            { formattedMd?.head?.modifyTime && (
              <span>
                更新于
                { formattedMd?.head?.modifyTime }
              </span>
            )}
            { formattedMd?.head?.categories && (
              <span>
                <FolderOutlined />
                {' '}
                分类于
                <a href={`/all/category/${formattedMd?.head?.categories}`}>{ formattedMd?.head?.categories }</a>
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
