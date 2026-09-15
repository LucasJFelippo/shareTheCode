import React from 'react';
import './layout.css';
import CodeEditor from './editor/editor';
import Tabs from './editor/tabs';
import Profile from './profile/profile';
import Menu from './menu/menu';
import Logger from './logger/logger';
import Service from './service/service';

export const Layout = () => {
  return (
    <div className="layoutContainer">
      <Service />

      <div className="mainArea">
        <div className="leftColumn">
          <div className="tabSelector">
            <Tabs />
          </div>
          <div className="editorArea">
            <CodeEditor />
          </div>
        </div>

        <div className="rightColumn">
          <div className="profileArea">
            <Profile />
          </div>
          <div className="sidebarPanel">
            <Menu />
          </div>
        </div>
      </div>

      <div className="logFooter">
        <Logger />
      </div>
    </div>
  );
};

export default Layout;