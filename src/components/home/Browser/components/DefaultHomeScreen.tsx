import React from 'react';
import Image from 'next/image';
import { BrowserTab } from '../types/BrowserTab';
import './DefaultHomeScreen.css';

export interface DefaultHomeScreenProps {
  tabs: BrowserTab[];
  onTabClick: (tabId: string) => void;
}

const DefaultHomeScreen: React.FC<DefaultHomeScreenProps> = ({ tabs, onTabClick }) => {
  const handleTabClick = React.useCallback(
    (tabId: string) => {
      onTabClick(tabId);
    },
    [onTabClick]
  );

  return (
    <div className="browser-showcase">
      <h2 className="browser-showcase-title">Projetos Disponíveis</h2>
      <div className="browser-showcase-grid">
        {tabs.map((tab: BrowserTab) => (
          <div
            key={tab.id}
            className="browser-showcase-item"
            onClick={() => handleTabClick(tab.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTabClick(tab.id);
              }
            }}
            aria-label={`Abrir ${tab.title}`}
          >
            <div className="browser-showcase-card">
              <div className="browser-showcase-icon">
                {typeof tab.icon === 'string' ? (
                  <Image
                    src={tab.icon}
                    alt={tab.title}
                    width={32}
                    height={32}
                    className="browser-showcase-icon-img"
                  />
                ) : (
                  tab.icon || <div>{tab.title.charAt(0).toUpperCase()}</div>
                )}
              </div>
              <div className="browser-showcase-content">
                <h3 className="browser-showcase-title">{tab.title}</h3>
                <div className="browser-showcase-url">{tab.url}</div>
                <div className="browser-showcase-action">Visitar →</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DefaultHomeScreen;
