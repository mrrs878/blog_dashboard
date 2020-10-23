import React, { useCallback, useEffect, useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-darker.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlembedded/htmlembedded';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/markdown/markdown';

import style from './editor.module.less';
import eventEmit from '../../tools/EventEmit';

interface PropsI {
  value: string;
  mode: string;
  theme: string;
  keyMap: string;
}

const Editor = (props: PropsI) => {
  const [content, setContent] = useState(props.value);

  const getEditorContentHandler = useCallback(() => {
    eventEmit.emit('sendEditorContent', content);
  }, [content]);

  useEffect(() => {
    eventEmit.on('getEditorContent', getEditorContentHandler);
    return () => {
      eventEmit.removeHandler('getEditorContent', getEditorContentHandler);
    };
  }, [getEditorContentHandler]);

  return (
    <CodeMirror
      className={style.codeMirror}
      value={props.value}
      onChange={(instance: CodeMirror.Editor, data: CodeMirror.EditorChange, value: string) => setContent(value)}
      options={{
        mode: props.mode,
        theme: 'material-darker',
        lineWrapping: true,
      }}
    />
  );
};

export default Editor;
