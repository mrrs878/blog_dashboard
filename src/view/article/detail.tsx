/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2021-03-08 22:46:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\views\article\detail.tsx
 */
import React, { useEffect, useState } from 'react';
import {
  Button, Space, Upload, message, Row, Col, Menu, Dropdown,
} from 'antd';
import {
  EditOutlined, UploadOutlined, SaveOutlined, RedoOutlined, EyeOutlined, ReloadOutlined,
} from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload/interface';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Base64 } from 'js-base64';
import { clone } from 'ramda';
import MCodeMirror from '../../components/MEditor/MCodeMirror';
import MPreview from '../../components/MEditor/Preview';
import useRequest from '../../hooks/useRequest';
import useGetArticles from '../../hooks/useGetArticles';
import { CREATE_ARTICLE, GET_ARTICLE, UPDATE_ARTICLE } from '../../api/article';
import eventEmit from '../../tools/EventEmit';
import { useModel } from '../../store';

const EMPTY_ARTICLE: IArticle = {
  title: '',
  categories: '',
  tags: '',
  content: '',
  createTime: '',
  description: '',
  author: '',
  _id: '',
};

interface PropsI extends RouteComponentProps<{ id: string }>{
}

const emptyMarkdownSrc = '---\n\n title: \n\n tags: \n\n categories: \n\n---';

function formatMarkdownSrc(markdownSrc: string): CreateArticleReqI {
  const [, summary, content] = clone(markdownSrc?.split('---'));
  const info = summary
    ?.replace(/\r\n/g, '')
    ?.replace(/\n/g, '')
    ?.match(/title:(.+)tags:(.+)categories:(.+)/) || [];
  const [_title, tags, categories] = info
    .slice(1, 5)
    .map((infoItem: string) => infoItem.trimStart());
  const title = _title.replace(/date(.+)/, '');
  const article = {
    title,
    tags,
    categories,
    description: content.slice(0, 200),
    content: Base64.encode(markdownSrc),
  };
  return article;
}

const ArticleDetail = (props: PropsI) => {
  const [user] = useModel('user');
  const [markdownSrc, setMarkdownSrc] = useState(emptyMarkdownSrc);
  const [article, setArticle] = useState<IArticle>(EMPTY_ARTICLE);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [createOrEdit, setCreateOrEdit] = useState<boolean>(false);
  const [, getArticleRes, , reGetArticle] = useRequest(GET_ARTICLE, props.match.params.id !== '-1', { id: props.match.params.id });
  const [updateArticleLoading, , updateArticle] = useRequest(UPDATE_ARTICLE, false);
  const { getArticles } = useGetArticles(false);
  const [createArticleLoading, createArticleRes, createArticle] = useRequest(CREATE_ARTICLE, false);

  useEffect(() => {
    eventEmit.on('sendEditorContent', (value: string) => {
      setMarkdownSrc(value);
      setArticle(({ createTime }) => ({
        ...formatMarkdownSrc(value),
        createTime,
        author: user.name,
        updateTime: new Date().toLocaleString(),
      }));
    });
    return () => {
      eventEmit.removeHandler('sendEditorContent', setMarkdownSrc);
    };
  }, [user.name]);

  useEffect(() => {
    if (createOrEdit) return;
    if (getArticleRes && !getArticleRes.success) {
      message.error(getArticleRes?.msg);
      return;
    }
    console.log(getArticleRes);

    setArticle(getArticleRes?.data || EMPTY_ARTICLE);
    setMarkdownSrc(Base64.decode(getArticleRes?.data?.content || '') || emptyMarkdownSrc);
  }, [getArticleRes, createOrEdit]);

  useEffect(() => {
    if (!createArticleRes) return;
    message.info(createArticleRes.msg);
    if (createArticleRes.success) {
      getArticles();
    }
  }, [createArticleRes, getArticles]);

  useEffect(() => {
    setCreateOrEdit(props.match.params.id === '-1');
    setIsEdit(props.match.params.id === '-1');
  }, [props.match.params.id]);

  function onToggleEditable() {
    setIsEdit(!isEdit);
    if (isEdit) eventEmit.emit('getEditorContent');
  }

  function selectEditorMode() {
    setIsEdit(!isEdit);
  }

  function onUploadChange(info: UploadChangeParam) {
    console.log(info);
  }

  async function onSyncClick() {
    await reGetArticle();
    message.info('刷新成功');
  }

  function upload(options: any) {
    const fileReader = new FileReader();
    fileReader.readAsText(options.file);
    fileReader.onload = async () => {
      setMarkdownSrc(fileReader.result?.toString() || '');
      const newArticle = formatMarkdownSrc(fileReader.result?.toString() || '');
      setArticle({ ...newArticle, createTime: new Date().toLocaleString(), author: '' });
    };
    fileReader.onerror = () => message.error('上传失败！');
  }

  async function onSaveClick() {
    try {
      const newArticle = formatMarkdownSrc(markdownSrc);
      if (!newArticle.title) throw new Error('文章标题有误，请检查文章头部title');
      if (!newArticle.categories) throw new Error('文章分类有误，请检查文章头部categories');
      if (!newArticle.tags) throw new Error('文章标签有误，请检查文章头部tag');
      if (createOrEdit) {
        createArticle(newArticle);
      } else {
        updateArticle({ ...newArticle, _id: props.match.params.id });
        await message.info('更新成功');
        getArticles();
        reGetArticle();
      }
    } catch (e) {
      message.error(e.message);
    }
  }

  async function onResetClick() {
    window.location.href = props.location.pathname;
  }

  const Editor = () => {
    if (isEdit) {
      return (
        <MCodeMirror
          mode="markdown"
          value={markdownSrc}
        />
      );
    }
    return <MPreview value={article} fullscreen={!isEdit} />;
  };

  return (
    <div className="container">
      <Row>
        <Col flex={1}>
          <Space className="controller">
            {
              isEdit ? (
                <Button icon={<EyeOutlined />} onClick={onToggleEditable} type="default">预览</Button>
              ) : (
                <Dropdown overlay={(
                  <Menu onClick={selectEditorMode}>
                    <Menu.Item key="md">
                      经典模式
                    </Menu.Item>
                    <Menu.Item key="text">
                      富文本模式
                    </Menu.Item>
                  </Menu>
                )}
                >
                  <Button>
                    编辑
                    {' '}
                    <EditOutlined />
                  </Button>
                </Dropdown>
              )
            }
            {
              !createOrEdit && <Button icon={<RedoOutlined />} onClick={onSyncClick}>刷新</Button>
            }
            <Upload accept=".md" onChange={onUploadChange} customRequest={upload} showUploadList={false}>
              <Button>
                <UploadOutlined />
                上传Markdown文件
              </Button>
            </Upload>
            <Button icon={<SaveOutlined />} disabled={isEdit} loading={updateArticleLoading || createArticleLoading} onClick={onSaveClick}>{ createOrEdit ? '发表' : '保存更改' }</Button>
            <Button icon={<ReloadOutlined />} onClick={onResetClick}>重置</Button>
          </Space>
        </Col>
      </Row>
      <br />
      <div style={{
        height: '100%',
      }}
      >
        <Editor />
      </div>
    </div>
  );
};

export default withRouter(ArticleDetail);
