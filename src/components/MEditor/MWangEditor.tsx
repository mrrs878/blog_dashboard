/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-12-23 13:16:42
 * @LastEditTime: 2021-02-03 16:09:55
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: /my-app/src/components/MEditor/MWangEditor.tsx
 */
import React, { useCallback, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import E from 'wangeditor';
import showdown from 'showdown';
import eventEmit from '../../tools/EventEmit';

interface PropsI {
  value: string;
}

const showdownConverter = new showdown.Converter();
let editor: E;

function formatMarkdownSrc(src: string): [string, string] {
  const [, header, content] = src.split('---');
  return [header, content];
}

const MWangEditor = (props: PropsI) => {
  const getEditorContentHandler = useCallback(() => {
    eventEmit.emit('sendEditorContent', showdownConverter.makeMarkdown(editor.txt.text() || '').slice(1));
  }, []);

  useEffect(() => {
    eventEmit.on('getEditorContent', getEditorContentHandler);
    return () => {
      eventEmit.removeHandler('getEditorContent', getEditorContentHandler);
    };
  }, [getEditorContentHandler]);

  useEffect(() => {
    editor = new E('#wEditor');
    editor.config.menus = [
      'head',
      'bold',
      'italic',
      'underline',
      'strikeThrough',
      'link',
      'list',
      'justify',
      'quote',
      'image',
      'table',
      'code',
      'splitLine',
      'undo',
      'redo',
    ];
    const [header, content] = formatMarkdownSrc(props.value);
    editor.create();
    editor.txt.html(`<p>---${header}---</p>${showdownConverter.makeHtml(content)}`);
    return () => {
      editor.destroy();
    };
  }, [props]);

  return (
    <div style={{ height: '100%' }} id="wEditor" />
  );
};

export default MWangEditor;
