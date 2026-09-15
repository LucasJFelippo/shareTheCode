import React, { useState } from 'react';
import './menu.css';
import Members from './members/members';
import Config from './config/config';

const USER_ICON_URL = 'https://unpkg.com/lucide-static@latest/icons/user.svg';
const SETTINGS_ICON_URL = 'https://unpkg.com/lucide-static@latest/icons/settings.svg';

export const Menu = () => {
  const [activeMenuTab, setActiveMenuTab] = useState('members');

  return (
    <div className="menuContainer">
      <div className="menuHeaderTabs">
        <div
          className={`menuTabButton ${activeMenuTab === 'members' ? 'focusedMenuTab' : ''}`}
          onClick={() => setActiveMenuTab('members')}
          title="Session Members"
        >
          <img src={USER_ICON_URL} alt="Members" className="menuTabIcon" />
        </div>

        <div
          className={`menuTabButton ${activeMenuTab === 'config' ? 'focusedMenuTab' : ''}`}
          onClick={() => setActiveMenuTab('config')}
          title="Configuration"
        >
          <img src={SETTINGS_ICON_URL} alt="Config" className="menuTabIcon" />
        </div>
      </div>

      {/* Tab Body */}
      <div className="menuContentArea">
        {activeMenuTab === 'members' && <Members />}
        {activeMenuTab === 'config' && <Config />}
      </div>
    </div>
  );
};

export default Menu;