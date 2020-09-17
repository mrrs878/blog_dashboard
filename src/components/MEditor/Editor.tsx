import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/base16-dark.css';

interface PropsI {
  value: string;
  mode: string;
  theme: string;
  keyMap: string;
  onChange: (instance: CodeMirror.Editor, change: CodeMirror.EditorChangeLinkedList[]) => void;
}

const Editor = (props: PropsI) => (
  <CodeMirror
    value={props.value}
    onChange={props.onChange}
    options={{
      keyMap: props.keyMap,
      mode: props.mode,
      theme: props.theme,
      lineWrapping: true,
    }}
  />
);

export default Editor;
