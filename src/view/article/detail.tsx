/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2021-09-23 20:33:37
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\view\article\detail.tsx
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Editor } from '@bytemd/react';
import gfm from '@bytemd/plugin-gfm';
import hl from '@bytemd/plugin-highlight';
import breaks from '@bytemd/plugin-breaks';
import {
  Button, Space, Upload, message, Row, Col,
} from 'antd';
import {
  UploadOutlined, SaveOutlined, RedoOutlined, ReloadOutlined,
} from '@ant-design/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Base64 } from 'js-base64';
import { clone } from 'ramda';
import { useRequest } from '@mrrs878/hooks';
import 'bytemd/dist/index.min.css';
import useGetArticles from '../../hook/useGetArticles';
import { CREATE_ARTICLE, GET_ARTICLE, UPDATE_ARTICLE } from '../../api/article';
import '../../assets/less/md.theme.orange.less';
import style from './detail.module.less';
import { useFullScreen } from '../../store';

interface IProps extends RouteComponentProps<{ id: string }>{
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

const ArticleDetail = (props: IProps) => {
  const [markdownSrc, setMarkdownSrc] = useState(emptyMarkdownSrc);
  const [createOrEdit, setCreateOrEdit] = useState<boolean>(false);
  const [, getArticleRes, , reGetArticle] = useRequest(GET_ARTICLE, props.match.params.id !== '-1', { id: props.match.params.id });
  const [updateArticleLoading, , updateArticle] = useRequest(UPDATE_ARTICLE, false);
  const { getArticles } = useGetArticles(false);
  const [createArticleLoading, createArticleRes, createArticle] = useRequest(CREATE_ARTICLE, false);
  const [, fullScreen, exitFullScreen] = useFullScreen();

  useEffect(() => {
    fullScreen();
    return exitFullScreen;
  }, [exitFullScreen, fullScreen]);

  useEffect(() => {
    if (createOrEdit) return;
    if (getArticleRes && !getArticleRes.success) {
      message.error(getArticleRes.return_message);
      return;
    }
    setMarkdownSrc(Base64.decode(getArticleRes?.data?.content || '') || emptyMarkdownSrc);
  }, [getArticleRes, createOrEdit]);

  useEffect(() => {
    if (!createArticleRes) return;
    message.info(createArticleRes.return_message).then(() => {
      if (createArticleRes.success) {
        props.history.goBack();
      }
    });
  }, [createArticleRes, getArticles, props.history]);

  useEffect(() => {
    setCreateOrEdit(props.match.params.id === '-1');
  }, [props.match.params.id]);

  const onEditorChange = useCallback((value) => {
    setMarkdownSrc(value);
  }, []);

  const onSyncClick = useCallback(async () => {
    await reGetArticle();
    message.info('刷新成功');
  }, [reGetArticle]);

  const upload = useCallback((options: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(options.file);
    fileReader.onload = async () => {
      setMarkdownSrc(fileReader.result?.toString() || '');
    };
    fileReader.onerror = () => message.error('上传失败！');
  }, []);

  const onSaveClick = useCallback(async () => {
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
    } catch {
      message.error('网络错误，请稍后重试');
    }
  }, [createArticle, createOrEdit, getArticles, markdownSrc,
    props.match.params.id, reGetArticle, updateArticle]);

  const onResetClick = useCallback(() => {
    window.location.href = props.location.pathname;
  }, [props.location.pathname]);

  return (
    <div className={style.container}>
      <Row>
        <Col flex={1}>
          <Space className="controller">
            {
              !createOrEdit && <Button icon={<RedoOutlined />} onClick={onSyncClick}>刷新</Button>
            }
            <Upload accept=".md" customRequest={upload} showUploadList={false}>
              <Button>
                <UploadOutlined />
                上传Markdown文件
              </Button>
            </Upload>
            <Button icon={<SaveOutlined />} loading={updateArticleLoading || createArticleLoading} onClick={onSaveClick}>{ createOrEdit ? '发表' : '保存更改' }</Button>
            <Button icon={<ReloadOutlined />} onClick={onResetClick}>重置</Button>
          </Space>
        </Col>
      </Row>
      <br />
      <Editor
        value={markdownSrc}
        onChange={onEditorChange}
        plugins={[
          hl(),
          gfm(),
          breaks(),
        ]}
      />
    </div>
  );
};

export default withRouter(ArticleDetail);
