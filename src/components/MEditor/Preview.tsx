import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Space } from 'antd';
import { CalendarOutlined, FolderOutlined } from '@ant-design/icons';
import CodeBlock from './CodeBlock';
import '../../assets/less/md.theme.orange.less';
import style from './preview.module.less';

interface PropsI {
  value: string;
  fullscreen?: boolean;
}

const Preview = (props: PropsI) => {
  const [formattedMd, setFormattedMd] = useState<{ head: ArticleSubI; content: string }>();
  useEffect(() => {
    const src = props.value.split('---');
    const info = src[1]
      ?.replace(/\r\n/g, '')
      ?.replace(/\n/g, '')
      ?.match(/title:(.+)date:(.+)tags:(.+)categories:(.+)/) || [];
    const [title, createTime, tag, category] = info.slice(1, 5).map((infoItem: string) => infoItem.trimStart());
    const head = { title, category, createTime, tag };
    setFormattedMd({ head, content: src[2] });
  }, [props.value]);
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
            { formattedMd?.head?.category && (
              <span>
                <FolderOutlined />
                {' '}
                分类于
                <a href={`/all/category/${formattedMd?.head?.category}`}>{ formattedMd?.head?.category }</a>
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
