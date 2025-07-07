import React from 'react';
import './DefaultRestoreButton.css';

export interface DefaultRestoreButtonProps {
  onRestore: () => void;
}

const DefaultRestoreButton: React.FC<DefaultRestoreButtonProps> = ({ onRestore }) => {
  const handleRestore = React.useCallback(() => {
    onRestore();
  }, [onRestore]);

  return (
    <div className="default-restore-button">
      <button className="restore-btn" onClick={handleRestore} aria-label="Restaurar Navegador">
        Restaurar Navegador
      </button>
    </div>
  );
};

export default DefaultRestoreButton;
