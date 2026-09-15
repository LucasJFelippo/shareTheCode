import React, { useState } from 'react';
import './config.css';

export const Config = () => {
  const [openSections, setOpenSections] = useState({
    editorSettings: true,
    sessionDefaults: false,
    privacy: false,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="configWrapper">
      <div className="configSection">
        <div
          className="configSectionHeader"
          onClick={() => toggleSection('editorSettings')}
        >
          <span>Editor Display</span>
          <span className="configArrow">
            {openSections.editorSettings ? '▲' : '▼'}
          </span>
        </div>
        {openSections.editorSettings && (
          <div className="configSectionBody">
            <div className="configRow">
              <span>Font Size</span>
              <span>14px</span>
            </div>
            <div className="configRow">
              <span>Tab Size</span>
              <span>2 spaces</span>
            </div>
          </div>
        )}
      </div>

      <div className="configSection">
        <div
          className="configSectionHeader"
          onClick={() => toggleSection('sessionDefaults')}
        >
          <span>Default Permissions</span>
          <span className="configArrow">
            {openSections.sessionDefaults ? '▲' : '▼'}
          </span>
        </div>
        {openSections.sessionDefaults && (
          <div className="configSectionBody">
            <div className="configRow">
              <span>Viewer Default Read</span>
              <span>Allowed</span>
            </div>
            <div className="configRow">
              <span>Viewer Default Write</span>
              <span>Denied</span>
            </div>
          </div>
        )}
      </div>

      <div className="configSection">
        <div
          className="configSectionHeader"
          onClick={() => toggleSection('privacy')}
        >
          <span>Privacy & Security</span>
          <span className="configArrow">
            {openSections.privacy ? '▲' : '▼'}
          </span>
        </div>
        {openSections.privacy && (
          <div className="configSectionBody">
            <div className="configRow">
              <span>Blur Inactive Files</span>
              <span>Active</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Config;