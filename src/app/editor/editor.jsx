import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './editor.css';
import { sessionData } from '../service/sessionData';
import { emitCodeUpdate } from '../service/service';

export const CodeEditor = () => {
  const editorRef = useRef(null);
  const isRemoteUpdate = useRef(false);

  const activeFileId = sessionData((state) => state.activeFileId);
  const activeFile = sessionData((state) =>
    state.files.find((f) => f.fileId === state.activeFileId)
  );
  const updateFileContent = sessionData((state) => state.updateFileContent);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    console.log('[editor]   INFO     Monaco editor mounted successfully');
    
    if (activeFile?.content) {
      editor.setValue(activeFile.content);
    }
  };

  useEffect(() => {
    if (!editorRef.current || !activeFile) return;

    const currentBuffer = editorRef.current.getValue();
    if (activeFile.content !== currentBuffer) {
      isRemoteUpdate.current = true;
      const model = editorRef.current.getModel();
      const cursorPosition = editorRef.current.getPosition();

      if (model) {
        editorRef.current.executeEdits('remote-sync', [
          {
            range: model.getFullModelRange(),
            text: activeFile.content,
            forceMoveMarkers: true,
          },
        ]);
        if (cursorPosition) {
          editorRef.current.setPosition(cursorPosition);
        }
      }
      isRemoteUpdate.current = false;
      console.log('[editor]   DEBUG    Applied remote buffer update to active file');
    }
  }, [activeFile?.content]);

  useEffect(() => {
    if (editorRef.current && activeFile) {
      const currentBuffer = editorRef.current.getValue();
      if (currentBuffer !== activeFile.content) {
        isRemoteUpdate.current = true;
        editorRef.current.setValue(activeFile.content || '');
        isRemoteUpdate.current = false;
      }
    }
  }, [activeFileId]);

  const handleEditorChange = (value) => {
    if (isRemoteUpdate.current || !activeFileId) return;

    const newContent = value ?? '';
    updateFileContent(activeFileId, newContent);
    emitCodeUpdate('default-session', activeFileId, newContent);
    console.log(`[editor]   DEBUG    Emitted code:update for file "${activeFileId}"`);
  };

  return (
    <div className="editorWrapper">
      <Editor
        height="100%"
        width="100%"
        language={activeFile?.language || 'javascript'}
        defaultValue={activeFile?.content ?? ''}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          padding: { top: 14 },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default CodeEditor;