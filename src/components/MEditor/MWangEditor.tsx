import React, { useEffect } from 'react';
import E from 'wangeditor';

const MWangEditor = () => {
  useEffect(() => {
    const editor = new E('#wEditor');
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
    editor.create();
  }, []);

  return (
    <div id="wEditor" />
  );
};

export default MWangEditor;
