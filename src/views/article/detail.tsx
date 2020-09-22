import React, { useEffect, useState, useCallback } from 'react';
import { Button, Space, Upload, message, Row, Col } from 'antd';
import { EditOutlined, UploadOutlined, SaveOutlined, RedoOutlined, EyeOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { RcCustomRequestOptions, UploadChangeParam } from 'antd/lib/upload/interface';
import { RouteComponentProps, withRouter } from 'react-router';
import { Base64 } from 'js-base64';
import { connect } from 'react-redux';
import MEditor from '../../components/MEditor/Editor';
import MPreview from '../../components/MEditor/Preview';
import ARTICLE_MODULE from '../../modules/article';
import store, { AppState } from '../../store';

const mapState2Props = (state: AppState) => ({
  fullScreen: state.common.fullScreen,
});

interface PropsI extends RouteComponentProps<{ id: string }>{
  fullScreen: boolean
}

const emptyArticle = { title: '', categories: '', tag: '', content: '', createTime: '', description: '' };

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
  const [markdownSrc, setMarkdownSrc] = useState('');
  const [article, setArticle] = useState<ArticleI>(emptyArticle);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [createOrEdit, setCreateOrEdit] = useState<boolean>(false);

  const getArticleDetail = useCallback(async () => {
    if (props.match.params.id === '-1') return;
    const res = await ARTICLE_MODULE.getArticle({ id: props.match.params.id });
    setMarkdownSrc(Base64.decode(res?.data?.content || ''));
    setArticle(res?.data || emptyArticle);
  }, [props.match.params.id]);

  useEffect(() => {
    getArticleDetail();
  }, [getArticleDetail, props.match.params.id]);

  useEffect(() => {
    setCreateOrEdit(props.match.params.id === '-1');
    setIsEdit(props.match.params.id === '-1');
  }, [props.match.params.id]);

  function onMarkdownChange(instance: CodeMirror.Editor) {
    setMarkdownSrc(instance.getValue());
  }

  function onToggleEditable() {
    setIsEdit(!isEdit);
  }

  function onToggleScreenClick() {
    store.dispatch({ type: 'UPDATE_FULL_SCREEN', data: !props.fullScreen });
  }

  function onUploadChange(info: UploadChangeParam) {
    console.log(info);
  }

  async function onSyncClick() {
    const res = await ARTICLE_MODULE.getArticle({ id: props.match.params.id });
    setMarkdownSrc(Base64.decode(res?.data?.content || ''));
    message.info('同步成功');
  }

  function upload(options: RcCustomRequestOptions) {
    const fileReader = new FileReader();
    fileReader.readAsText(options.file);
    fileReader.onload = async () => {
      setMarkdownSrc(fileReader.result?.toString() || '');
      const _article = formatMarkdownSrc(fileReader.result?.toString() || '');
      setArticle({ ..._article, createTime: new Date().toLocaleString() });
    };
    fileReader.onerror = () => message.error('上传失败！');
  }

  async function onSaveClick() {
    const _article = formatMarkdownSrc(markdownSrc);
    if (createOrEdit) {
      await ARTICLE_MODULE.creatreArticle(_article);
      await ARTICLE_MODULE.getArticles();
      message.info('发表成功');
    } else {
      await ARTICLE_MODULE.updateArticle({ ..._article, _id: props.match.params.id });
      await ARTICLE_MODULE.getArticles();
      await getArticleDetail();
      message.info('更新成功');
    }
  }

  return (
    <div className="container">
      <Row>
        <Col flex={1}>
          <Space className="controller">
            <Button icon={isEdit ? <EyeOutlined /> : <EditOutlined />} onClick={onToggleEditable} type={isEdit ? 'primary' : 'default'}>{ isEdit ? '预览' : '编辑' }</Button>
            <Button icon={<RedoOutlined />} onClick={onSyncClick}>同步仓库</Button>
            <Upload accept=".md" onChange={onUploadChange} customRequest={upload} showUploadList={false}>
              <Button>
                <UploadOutlined />
                上传Markdown文件
              </Button>
            </Upload>
            <Button icon={<SaveOutlined />} onClick={onSaveClick}>{ createOrEdit ? '发表' : '保存更改' }</Button>
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
