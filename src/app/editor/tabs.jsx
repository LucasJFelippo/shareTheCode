import React, { useState } from 'react';
import './tabs.css';

const initialFiles = [
  { fileId: 'file-1', fileName: 'main.rs' },
  { fileId: 'file-2', fileName: 'packetParser.py' },
  { fileId: 'file-3', fileName: 'config.json' },
];

export const Tabs = () => {
  const [fileList] = useState(initialFiles);
  const [activeFileId, setActiveFileId] = useState('file-1');

  const handleTabClick = (fileId) => {
    setActiveFileId(fileId);
  };

  return (
    <div className="tabContainer">
      {fileList.map((file) => {
        const isFocused = file.fileId === activeFileId;
        return (
          <div
            key={file.fileId}
            className={`tabItem ${isFocused ? 'focusedTab' : ''}`}
            onClick={() => handleTabClick(file.fileId)}
          >
            <span className="tabTitle">{file.fileName}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Tabs;