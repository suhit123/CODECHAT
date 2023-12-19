import React, { useState } from 'react';
import '../styles/right_click_menu.css'
const Random = () => {
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });

  const handleContextMenu = (event) => {
    event.preventDefault();
    const clickX = event.clientX;
    const clickY = event.clientY;
    setContextMenuPosition({ top: clickY, left: clickX });
    setContextMenuVisible(true);
  };

  const handleCopy = () => {
    // Your logic for copying to clipboard
    console.log('Copying content to clipboard');
    hideContextMenu();
  };

  const handleShare = () => {
    // Your logic for sharing content
    console.log('Sharing content');
    hideContextMenu();
  };

  const hideContextMenu = () => {
    setContextMenuVisible(false);
  };

  return (
    <div onContextMenu={handleContextMenu} onDoubleClick={handleContextMenu}>
      Right-click me!

      {contextMenuVisible && (
        <div
          style={{
            position: 'fixed',
            top: contextMenuPosition.top,
            left: contextMenuPosition.left,
            background: 'white',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            padding: '10px',
            borderRadius: '4px',
            zIndex: 1000,
          }}
        >
          <div className='item_right_click_menu' onClick={handleCopy}>Copy</div>
          <div className='item_right_click_menu' onClick={handleShare}>Share</div>
        </div>
      )}
    </div>
  );
};

export default Random;
