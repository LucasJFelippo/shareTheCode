import React, { useState } from 'react';
import './logger.css';

export const Logger = () => {
  const [latestLog] = useState('[SYSTEM] Session initialized. Waiting for connections...');

  return (
    <div className="loggerContainer">
      <div className="loggerTerminalBox">
        <span className="loggerPrefix">λ</span>
        <span className="loggerOutput" title={latestLog}>
          {latestLog}
        </span>
      </div>
    </div>
  );
};

export default Logger;