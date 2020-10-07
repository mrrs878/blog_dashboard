/*
 * @Author: your name
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2020-09-29 18:36:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\views\article\detail.tsx
 */
import React, { useEffect, useState } from 'react';
import { Button, Space, Upload, message, Row, Col } from 'antd';
import { EditOutlined, UploadOutlined, SaveOutlined, RedoOutlined, EyeOutlined, FullscreenOutlined, FullscreenExitOutlined, ReloadOutlined } from '@ant-design/icons';
import { RcCustomRequestOptions, UploadChangeParam } from 'antd/lib/upload/interface';
import { RouteComponentProps, withRouter } from 'react-router';
import { Base64 } from 'js-base64';
import { connect } from 'react-redux';
import MEditor from '../../components/MEditor/Editor';
import MPreview from '../../components/MEditor/Preview';
import store, { AppState } from '../../store';
import useRequest from '../../hooks/useRequest';
import { CREATE_ARTICLE, GET_ALL_ARTICLES, GET_ARTICLE, UPDATE_ARTICLE } from '../../api/article';

const mapState2Props = (state: AppState) => ({
  fullScreen: state.common.fullScreen,
});

interface PropsI extends RouteComponentProps<{ id: string }>{
  fullScreen: boolean
}

const emptyArticle = { title: '', categories: '', tag: '', content: '', createTime: '', description: '', author: '' };
const emptyMarkdownSrc = '---\n title: \n tags: \n categories: \n ---';

function formatMarkdownSrc(markdownSrc: string): CreateArticleReqI {
  const [, summary, content] = markdownSrc?.split('---');
  const info = summary
          ?.replace(/\r\n/g, '')
          ?.replace(/\n/g, '')
          ?.match(/title:(.+)tags:(.+)categories:(.+)/) || [];
  const [title, tag, categories] = info.slice(1, 5).map((infoItem: string) => infoItem.trimStart());
  const article = { title, tag, categories, description: content.slice(0, 200), content: Base64.encode(markdownSrc) };
  return article;
}

const ArticleDetail = (props: PropsI) => {
  const [markdownSrc, setMarkdownSrc] = useState(emptyMarkdownSrc);
  const [article, setArticle] = useState<ArticleI>(emptyArticle);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [createOrEdit, setCreateOrEdit] = useState<boolean>(false);
  const [, getArticleRes, reGetArticle] = useRequest<GetArticleReqT, GetArticleResI>(GET_ARTICLE, { id: props.match.params.id }, props.match.params.id !== '-1');
  const [, , updateArticle] = useRequest<UpdateArticleReqI, UpdateArticleResI>(UPDATE_ARTICLE, undefined, false);
  const [, , getArticles] = useRequest<GetArticlesReqT, GetArticlesResI>(GET_ALL_ARTICLES, undefined, false);
  const [, , createArticle] = useRequest<CreateArticleReqI, CreateArticleResI>(CREATE_ARTICLE, undefined, false);

  useEffect(() => {
    if (createOrEdit) return;
    if (getArticleRes && !getArticleRes.success) {
      message.error(getArticleRes?.msg);
      return;
    }
    setArticle(getArticleRes?.data || emptyArticle);
    setMarkdownSrc(Base64.decode(getArticleRes?.data?.content || '') || emptyMarkdownSrc);
  }, [getArticleRes, createOrEdit]);

  useEffect(() => {
    setCreateOrEdit(props.match.params.id === '-1');
    setIsEdit(props.match.params.id === '-1');
  }, [props.match.params.id]);

  function onMarkdownChange(instance: CodeMirror.Editor) {
    setMarkdownSrc(instance.getValue());
  }

  function onToggleEditable() {
    setIsEdit(!isEdit);
    setArticle({ ...formatMarkdownSrc(markdownSrc), createTime: '', author: '' });
  }

  function onToggleScreenClick() {
    store.dispatch({ type: 'UPDATE_FULL_SCREEN', data: !props.fullScreen });
  }

  function onUploadChange(info: UploadChangeParam) {
    console.log(info);
  }

  async function onSyncClick() {
    await reGetArticle();
    message.info('刷新成功');
  }

  function upload(options: RcCustomRequestOptions) {
    const fileReader = new FileReader();
    fileReader.readAsText(options.file);
    fileReader.onload = async () => {
      setMarkdownSrc(fileReader.result?.toString() || '');
      const _article = formatMarkdownSrc(fileReader.result?.toString() || '');
      setArticle({ ..._article, createTime: new Date().toLocaleString(), author: '' });
    };
    fileReader.onerror = () => message.error('上传失败！');
  }

  async function onSaveClick() {
    const _article = formatMarkdownSrc(markdownSrc);
    if (createOrEdit) {
      await createArticle(_article);
      await getArticles();
      message.info('发表成功');
    } else {
      await updateArticle({ ..._article, _id: props.match.params.id });
      await getArticles();
      await reGetArticle();
      message.info('更新成功');
    }
  }

  async function onResetClick() {
    window.location.href = props.location.pathname;
  }

  return (
    <div className="container">
      <Row>
        <Col flex={1}>
          <Space className="controller">
            <Button icon={isEdit ? <EyeOutlined /> : <EditOutlined />} onClick={onToggleEditable} type={isEdit ? 'primary' : 'default'}>{ isEdit ? '预览' : '编辑' }</Button>
            {
              !createOrEdit && <Button icon={<RedoOutlined />} onClick={onSyncClick}>刷新</Button>
            }
            <Upload accept=".md" onChange={onUploadChange} customRequest={upload} showUploadList={false}>
              <Button>
                <UploadOutlined />
                上传Markdown文件
              </Button>
            </Upload>
            <Button icon={<SaveOutlined />} onClick={onSaveClick}>{ createOrEdit ? '发表' : '保存更改' }</Button>
            <Button icon={<ReloadOutlined />} onClick={onResetClick}>重置</Button>
          </Space>
        </Col>
        <Col>
          <Button icon={props.fullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} onClick={onToggleScreenClick}>全屏</Button>
        </Col>
      </Row>
      <br />
      <div style={{
        display: isEdit ? 'flex' : 'unset', justifyContent: 'space-between', flexDirection: 'row', overflow: 'auto',
      }}
      >
        {
          !isEdit
          && <MPreview value={article} fullscreen={!isEdit} />
        }
        {
          isEdit
          && (
          <MEditor
            mode="markdown"
            theme="base16-dark"
            keyMap="sublime"
            value={markdownSrc}
            onChange={onMarkdownChange}
          />
          )
        }
      </div>
    </div>
  );
};

export default connect(mapState2Props)(withRouter(ArticleDetail));
