import React from 'react';
import Image from 'next/image';
import { BrowserTab } from '../types/BrowserTab';
import './Tab.css';

export interface TabProps {
  tab: BrowserTab;
  isActive: boolean;
  isInteractive?: boolean;
  onClick: (tabIndex: number) => void;
  onClose?: (tabIndex: number) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: () => void;
  tabIndex: number;
}

const Tab = React.memo(
  React.forwardRef<HTMLDivElement, TabProps>(
    (
      {
        tab,
        isActive,
        isInteractive = true,
        onClick,
        onClose,
        onMouseEnter,
        onMouseMove,
        onMouseLeave,
        tabIndex,
      },
      ref
    ) => {
      const handleClick = React.useCallback(() => {
        if (!tab.isDisabled) {
          onClick(tabIndex);
        }
      }, [tabIndex, tab.isDisabled, onClick]);

      const handleClose = React.useCallback(
        (e: React.MouseEvent) => {
          e.stopPropagation();
          if (onClose) {
            onClose(tabIndex);
          }
        },
        [tabIndex, onClose]
      );

      const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        },
        [handleClick]
      );

      return (
        <div
          ref={ref}
          className={`tab group ${isActive ? 'active' : ''} ${tab.isPinned ? 'pinned' : ''} ${tab.isDisabled ? 'disabled' : ''}`}
          data-tab-id={tab.id}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onMouseEnter={onMouseEnter}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          role="tab"
          aria-selected={isActive}
          aria-disabled={tab.isDisabled}
          tabIndex={0}
        >
          <div className="tab-icon">
            {typeof tab.icon === 'string' ? (
              <Image
                width={16}
                height={16}
                alt={tab.title}
                src={tab.icon}
                className="tab-icon-img"
              />
            ) : (
              tab.icon || <span>{tab.title.charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div className="tab-title">
            {tab.title}
            {tab.hasUnsavedChanges && (
              <span className="tab-unsaved-indicator" title="Mudanças não salvas">
                •
              </span>
            )}
          </div>

          {isInteractive && onClose && tab.id !== 'home-tab' && !tab.isPinned && (
            <button
              className="tab-close-btn"
              onClick={handleClose}
              aria-label={`Fechar aba ${tab.title}`}
              title={`Fechar aba ${tab.title}`}
            >
              &times;
            </button>
          )}
        </div>
      );
    }
  )
);

Tab.displayName = 'Tab';

export default Tab;
