import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import html from 'highlight.js/lib/languages/vbscript-html';
import ts from 'highlight.js/lib/languages/typescript';
import shell from 'highlight.js/lib/languages/shell';
import yaml from 'highlight.js/lib/languages/yaml';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/github.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('jsx', javascript);
hljs.registerLanguage('html', html);
hljs.registerLanguage('ts', ts);
hljs.registerLanguage('tsx', ts);
hljs.registerLanguage('typescript', ts);
hljs.registerLanguage('shell script', shell);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('json', json);

interface PropsI {
  value: string;
  language: string
}

const CodeBlock = (props: PropsI) => {
  const codeEl = useRef<HTMLElement>(null);

  function highlightCode() {
    if (codeEl.current) hljs.highlightBlock(codeEl.current);
  }

  useEffect(() => {
    highlightCode();
  });

  return (
    <pre>
      <code ref={codeEl} className={`language-${props.language}`}>
        {props.value}
      </code>
    </pre>
  );
};

export default CodeBlock;
