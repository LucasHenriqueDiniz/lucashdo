import React from 'react';
import './WindowControls.css';

export interface WindowControlsProps {
  isInteractive?: boolean;
  isMaximized?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

const WindowControls = React.memo<WindowControlsProps>(
  ({ isInteractive = true, isMaximized = false, onClose, onMinimize, onMaximize }) => {
    const handleClose = React.useCallback(() => {
      if (isInteractive && onClose) {
        onClose();
      }
    }, [isInteractive, onClose]);

    const handleMinimize = React.useCallback(() => {
      if (isInteractive && onMinimize) {
        onMinimize();
      }
    }, [isInteractive, onMinimize]);

    const handleMaximize = React.useCallback(() => {
      if (isInteractive && onMaximize) {
        onMaximize();
      }
    }, [isInteractive, onMaximize]);

    return (
      <div className="window-controls-right">
        <button
          className="control-btn minimize relative group"
          onClick={handleMinimize}
          aria-label="Minimize"
          disabled={!isInteractive}
        >
          <div className="tooltip-text">Minimize</div>
        </button>
        <button
          className={`control-btn maximize relative group ${isMaximized ? 'active' : ''}`}
          onClick={handleMaximize}
          aria-label={isMaximized ? 'Restore' : 'Maximize'}
          disabled={!isInteractive}
        >
          <div className="tooltip-text">{isMaximized ? 'Restore' : 'Maximize'}</div>
        </button>
        <button
          className="control-btn close relative group"
          onClick={handleClose}
          aria-label="Close"
          disabled={!isInteractive}
        >
          <div className="tooltip-text">Close</div>
        </button>
      </div>
    );
  }
);

WindowControls.displayName = 'WindowControls';

export default WindowControls;
