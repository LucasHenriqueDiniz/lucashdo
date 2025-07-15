import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, RotateCcw, Search, X, Home } from 'lucide-react';
import { BrowserTab } from '../types/BrowserTab';
import './AddressBar.css';

interface AddressBarProps {
  tab: BrowserTab;
  availableTabs?: BrowserTab[];
  onTabSelect?: (tabId: string) => void;
  onTransformToHome?: (tabIndex: number) => void;
  currentTabIndex: number;
  isInteractive: boolean;
}

const AddressBar: React.FC<AddressBarProps> = ({
  tab,
  availableTabs = [],
  onTabSelect,
  onTransformToHome,
  currentTabIndex,
  isInteractive,
}) => {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtrar tabs baseado na pesquisa
  const filteredTabs = availableTabs.filter(availableTab =>
    availableTab.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Entrar no modo de pesquisa
  const handleUrlClick = useCallback(() => {
    if (!isInteractive) return;
    setIsSearchMode(true);
    setSearchQuery('');
    setShowDropdown(true);
    setTimeout(() => inputRef.current?.focus(), 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sair do modo de pesquisa
  const handleExitSearch = useCallback(() => {
    setIsSearchMode(false);
    setSearchQuery('');
    setShowDropdown(false);
  }, []);

  // Selecionar uma tab da pesquisa
  const handleTabSelect = useCallback(
    (tabId: string) => {
      onTabSelect?.(tabId);
      handleExitSearch();
    },
    [onTabSelect, handleExitSearch]
  );

  // Refresh button animation
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 3000);
  }, []);

  // Transformar em home
  const handleHomeClick = useCallback(() => {
    onTransformToHome?.(currentTabIndex);
  }, [onTransformToHome, currentTabIndex]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        handleExitSearch();
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, handleExitSearch]);

  return (
    <div className="address-bar">
      {/* Navigation buttons */}
      <div className="nav-buttons">
        {isInteractive && (
          <>
            <button className="nav-btn" disabled aria-label="Voltar" title="Voltar">
              <ChevronLeft size={16} />
            </button>
            <button className="nav-btn" disabled aria-label="Avançar" title="Avançar">
              <ChevronRight size={16} />
            </button>
          </>
        )}
        <button
          className={`nav-btn refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
          onClick={handleRefresh}
          aria-label="Recarregar"
          title="Recarregar"
        >
          <RotateCcw size={16} />
        </button>
        {isInteractive && (
          <button
            className="nav-btn home-btn"
            onClick={handleHomeClick}
            disabled={tab?.type === 'home' || !tab}
            aria-label="Ir para Home"
            title={tab?.type === 'home' ? 'Já está na Home' : 'Ir para Home'}
          >
            <Home size={16} />
          </button>
        )}
      </div>

      {/* URL/Search container */}
      <div className="url-container">
        <div className="url-icon">
          {typeof tab?.icon === 'string' ? (
            <Image
              src={tab.icon}
              alt={tab?.title || ''}
              width={16}
              height={16}
              className="url-icon-img"
            />
          ) : (
            tab?.icon || <span>{tab?.title?.charAt(0)?.toUpperCase() || 'H'}</span>
          )}
        </div>

        {isSearchMode && isInteractive ? (
          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input
              ref={inputRef}
              className="search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Pesquisar projetos..."
              autoComplete="off"
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Limpar pesquisa"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ) : (
          <div className="url-display" onClick={isInteractive ? handleUrlClick : undefined}>
            <span className="url-text">{tab?.url || 'loading...'}</span>
            {isInteractive && <span className="url-hint">Clique para pesquisar</span>}
          </div>
        )}
      </div>

      {/* Search dropdown */}
      {isInteractive && showDropdown && (isSearchMode || searchQuery) && (
        <div ref={dropdownRef} className="search-dropdown">
          {filteredTabs.length > 0 ? (
            filteredTabs.map(availableTab => (
              <div
                key={availableTab.id}
                className="search-result"
                onClick={() => handleTabSelect(availableTab.id)}
              >
                <div className="result-icon">
                  {typeof availableTab.icon === 'string' ? (
                    <Image
                      src={availableTab.icon}
                      alt={availableTab.title}
                      width={24}
                      height={24}
                      className="result-icon-img"
                    />
                  ) : (
                    availableTab.icon || <span>{availableTab.title.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="result-content">
                  <div className="result-title">{availableTab.title}</div>
                  <div className="result-url">{availableTab.url}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <Search size={20} />
              <span>Nenhum projeto encontrado</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressBar;
