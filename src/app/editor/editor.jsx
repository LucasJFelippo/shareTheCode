import React from 'react';
import Editor from '@monaco-editor/react';
import './editor.css';

const defaultSnippet = `// Welcome to Share The Code!
function helloWorld() {
  console.log("Real-time collaborative editing starts here.");
}

helloWorld();
`;

export const CodeEditor = () => {
  const handleEditorChange = (value) => {
    console.log('Current buffer:', value);
  };

  return (
    <div className="editorWrapper">
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="javascript"
        defaultValue={defaultSnippet}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          padding: { top: 14 },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default CodeEditor;