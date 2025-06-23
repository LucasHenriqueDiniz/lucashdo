/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, PlusIcon, RotateCw, Star } from 'lucide-react';
import Image from 'next/image';
import React, { ReactNode, useEffect, useState, useRef, forwardRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import './Browser.css';

export interface BrowserTab {
  /** ID único para a aba */
  id: string;
  /** Título da aba */
  title: string;
  /** URL para exibir na barra de endereço */
  url: string;
  /** Conteúdo da aba */
  content: ReactNode;
  /** Ícone opcional para a aba (ReactNode ou string para URL de imagem) */
  icon?: ReactNode | string;
  /** Indica se a aba está favoritada */
  isFavorited?: boolean;
  /** Dados adicionais opcionais que podem ser usados pelo componente */
  data?: Record<string, any>;
}

interface BrowserProps {
  /** Set to true to use as decorative element without interactions */
  isDecorative?: boolean;
  /** Lista inicial de abas a serem exibidas (serão gerenciadas internamente) */
  tabs?: BrowserTab[];
  /** Lista completa de abas disponíveis (para exibir na homescreen) */
  availableTabs?: BrowserTab[];
  /** ID da aba inicialmente ativa (opcional) */
  activeTabId?: string;
  /** Callback informativo quando uma aba é alterada (não controla o estado) */
  onTabChange?: (tabId: string) => void;
  /** Title to display in content area (if showing projects) */
  title?: string;
  /** Subtitle to display in content area (if showing projects) */
  subtitle?: string;
  /** Hide favorites functionality */
  hideFavorites?: boolean;
  /** Callback for when close button is clicked */
  onClose?: () => void;
  /** Callback for when minimize button is clicked */
  onMinimize?: () => void;
  /** Callback for when maximize button is clicked */
  onMaximize?: () => void;
  /** Callback for when back button is clicked */
  onBack?: () => void;
  /** Callback for when forward button is clicked */
  onForward?: () => void;
  /** Hide the new tab button */
  hideNewTabButton?: boolean;
  /** Callback for when refresh button is clicked */
  onRefresh?: () => void;
  /** Callback for when new tab button is clicked */
  onNewTab?: () => void;
  /** Callback informativo quando uma aba é fechada (não controla o estado) */
  onTabClose?: (tabId: string) => void;
  /** Width of the browser (default full width) */
  width?: string;
  /** Height of the browser (default auto) */
  height?: string;
  /** Content to display in the browser if no tabs are provided */
  children?: ReactNode;
  /** Whether to show window controls (close, minimize, maximize) */
  showWindowControls?: boolean;
  /** Custom home screen component to display when no tabs are open */
  CustomHomeScreen?: ReactNode;
  /** Allow closing tabs (default true) */
  allowToCloseTabs?: boolean /** External search query value */;
  searchQuery?: string;
  /** Callback for when search query changes */
  onSearchChange?: (query: string) => void;
  /** Ref for accessing URL bar focus method */
  focusUrlRef?: React.RefObject<BrowserRefType>;
}

// Definir tipo para a ref exposta
export interface BrowserRefType {
  focusUrlBar: () => void;
}

const Browser = forwardRef<BrowserRefType, BrowserProps>(function Browser({
  isDecorative = false,
  title = 'Meu Portfolio',
  subtitle = 'Explore meus projetos e trabalhos',
  tabs = [],
  availableTabs = [],
  activeTabId,
  onTabChange,
  onTabClose,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onRefresh,
  onNewTab,
  onBack,
  onForward,
  width = '900px', // Tamanho fixo de largura
  height = '600px', // Tamanho fixo de altura
  showWindowControls = true,
  hideNewTabButton = false,
  CustomHomeScreen,
  allowToCloseTabs = true,
  searchQuery = '',
  onSearchChange,
  focusUrlRef,
  hideFavorites = false,
}: BrowserProps): React.ReactElement {
  // Browser state
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  // Initialize home screen state based on CustomHomeScreen
  const [isHomeScreen, setIsHomeScreen] = useState(!!CustomHomeScreen && !activeTabId);
  const [internalTabs, setInternalTabs] = useState<BrowserTab[]>(tabs);
  const [internalActiveTabId, setInternalActiveTabId] = useState<string | undefined>(
    // Default to first tab if no CustomHomeScreen or if activeTabId is not provided
    (!CustomHomeScreen && tabs && tabs.length > 0) || (!activeTabId && tabs && tabs.length > 0)
      ? tabs[0].id
      : activeTabId
  );
  const [searchQueryState, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<BrowserTab[]>([]);
  const [searchDropdownVisible, setSearchDropdownVisible] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Ref para o input da URL para poder focar nele programaticamente
  const urlInputRef = useRef<HTMLInputElement>(null);

  // Find active tab object
  const activeTab = internalTabs.find((tab: BrowserTab) => tab.id === internalActiveTabId);
  // Flag to determine whether to show home screen
  const shouldShowHomeScreen =
    isHomeScreen || (!activeTab && CustomHomeScreen) || activeTab?.id === 'home-tab'; // Considerar a aba "home-tab" como a tela inicial

  // Initialize internal tabs when external tabs change
  useEffect(() => {
    if (tabs && tabs.length > 0) {
      setInternalTabs(tabs);
    }
  }, [tabs]);

  // Ensure the effective tab is properly selected on mount and when tabs change
  useEffect(() => {
    if (internalTabs.length > 0 && !isHomeScreen) {
      // If activeTabId is provided and exists in tabs, use it
      const tabExists = internalTabs.some((tab: BrowserTab) => tab.id === activeTabId);

      if (activeTabId && tabExists) {
        console.log(`Browser effect: Setting internal active tab to match parent: ${activeTabId}`);
        setInternalActiveTabId(activeTabId);
      } else if (!activeTabId) {
        // Only default to Windows XP or first tab if no activeTabId is provided at all
        // This prevents overriding the parent's selection after initial mounting
        const windowsXPTab = internalTabs.find((tab: BrowserTab) => tab.id === 'windows-xp-online');
        const newTabId = windowsXPTab?.id || internalTabs[0].id;
        console.log(`Browser effect: No activeTabId provided, defaulting to: ${newTabId}`);
        setInternalActiveTabId(newTabId);

        // Only notify parent if this is the initial setup
        if (onTabChange) {
          console.log(`Browser effect: Notifying parent of initial tab selection: ${newTabId}`);
          onTabChange(newTabId);
        }
      }
      // Removed the !tabExists condition to prevent reverting to Windows XP when a valid tab ID is provided
    }
  }, [internalTabs, activeTabId, isHomeScreen, onTabChange]);

  // Synchronize internal state with external activeTabId changes
  // This ensures the Browser component respects the parent's activeTabId
  useEffect(() => {
    // Always update if activeTabId is provided and valid
    if (activeTabId && internalTabs.some((tab: BrowserTab) => tab.id === activeTabId)) {
      console.log(
        `Browser: External activeTabId changed to ${activeTabId}, updating internal state`
      );
      setInternalActiveTabId(activeTabId);
      // When activeTabId is provided, we're no longer on the home screen
      setIsHomeScreen(false);
    }
  }, [activeTabId, internalTabs]);

  // Make sure we never lose tab selection
  useEffect(() => {
    // If no active tab is selected but we have tabs, select the first one
    if (!internalActiveTabId && internalTabs.length > 0 && !isHomeScreen) {
      console.log('Browser: No active tab selected, selecting first tab');
      const newTabId = internalTabs[0].id;
      setInternalActiveTabId(newTabId);

      if (onTabChange) {
        console.log(`Browser: Notifying parent of default tab selection: ${newTabId}`);
        onTabChange(newTabId);
      }
    }
  }, [internalActiveTabId, internalTabs, isHomeScreen, onTabChange]);

  // Log the active tab for debugging
  useEffect(() => {
    const effectiveActiveTabId = internalActiveTabId;
    const activeTabObj = internalTabs.find((tab: BrowserTab) => tab.id === effectiveActiveTabId);
    console.log('Browser: activeTab is:', activeTabObj?.title);

    if (effectiveActiveTabId === 'windows-xp-online') {
      console.log('Browser: Windows XP Online tab is active!');
    }
  }, [internalActiveTabId, internalTabs]);
  // Handle click on tab
  const handleTabClick = (tabId: string): void => {
    console.log(`Browser handleTabClick: Changing tab to ${tabId}`);

    // Skip if this tab is already active internally
    if (tabId === internalActiveTabId) {
      console.log(`Browser handleTabClick: Tab ${tabId} is already active, skipping update`);
      return;
    }

    // Always exit home screen when a tab is clicked
    setIsHomeScreen(false);

    // Limpar a pesquisa quando mudar de aba
    setSearchQuery('');
    if (onSearchChange) {
      onSearchChange('');
    }

    // Update internal active tab immediately for responsive UI
    setInternalActiveTabId(tabId);

    // Notify parent component of tab change via callback
    if (onTabChange) {
      const tabExists = internalTabs.some((tab: BrowserTab) => tab.id === tabId);
      if (tabExists) {
        console.log(`Browser handleTabClick: Calling external onTabChange with ${tabId}`);
        onTabChange(tabId);
      } else {
        console.error(`Browser handleTabClick: Tab ${tabId} not found in available tabs`);
      }
    }
  };

  // Handle closing a tab
  const handleTabClose = (tabId: string): void => {
    // Não permitir fechar abas no modo decorativo
    if (isDecorative) return;

    // Não permitir fechar a aba Home
    if (tabId === 'home') return;

    // Não permitir fechar a última aba
    if (internalTabs.length <= 1) return;

    if (onTabClose) {
      // Se há um callback externo, informá-lo mas gerenciar internamente também
      onTabClose(tabId);
    }

    // Gerenciar internamente
    // Filtrar para obter as abas restantes após o fechamento
    const remainingTabs = internalTabs.filter((tab: BrowserTab) => tab.id !== tabId);

    // Atualizar o estado interno com as abas restantes
    setInternalTabs(remainingTabs);

    // Se não houver mais abas após o fechamento, voltar para a home screen
    if (remainingTabs.length === 0) {
      setIsHomeScreen(true);
      setInternalActiveTabId(undefined);
    } else {
      // Mudar para a primeira aba disponível
      handleTabClick(remainingTabs[0].id);
    }
  };

  // Handle browser control actions
  const handleCloseClick = (): void => {
    if (isDecorative) return;

    if (onClose) {
      onClose();
    } else {
      setIsClosed(true);
    }
  };

  const handleMinimizeClick = (): void => {
    if (isDecorative) return;

    if (onMinimize) {
      onMinimize();
    } else {
      setIsMinimized(true);
    }
  };

  const handleMaximizeClick = (): void => {
    if (isDecorative) return;

    if (onMaximize) {
      onMaximize();
    } else {
      setIsMaximized(!isMaximized);
    }
  };

  const handleBackClick = (): void => {
    if (isDecorative || !onBack) return;
    onBack();
  };

  const handleForwardClick = (): void => {
    if (isDecorative || !onForward) return;
    onForward();
  };

  const handleRefreshClick = (): void => {
    if (isDecorative || !onRefresh) return;
    onRefresh();
  };
  const handleNewTabClick = (): void => {
    if (isDecorative) return;

    if (onNewTab) {
      // Chamar a função do componente pai para lidar com nova aba
      onNewTab();
      return; // Deixe que o componente pai lide com a nova aba
    }

    // Se não tiver handler externo, crie uma nova aba internamente
    const newTabId = `tab-${Date.now()}`;
    const newTab: BrowserTab = {
      id: newTabId,
      title: 'New Tab',
      url: 'about:blank',
      content: <div>This is a new tab!</div>,
    };

    const updatedTabs = [...internalTabs, newTab];
    setInternalTabs(updatedTabs);

    // Ativar a nova aba e mostrar a home screen
    setInternalActiveTabId(newTabId);
    setIsHomeScreen(true);
  }; // Handle search operations
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const query = e.target.value;

    // Atualizar o estado interno
    setSearchQuery(query);

    // Notificar o componente pai da mudança na pesquisa
    if (onSearchChange) {
      onSearchChange(query);
    }

    // Processar os resultados da pesquisa
    if (query.trim() === '') {
      setSearchResults([]);
      setSearchDropdownVisible(false);
      return;
    }

    // Search in available tabs
    const results = availableTabs.filter(
      (tab: BrowserTab) =>
        tab.title.toLowerCase().includes(query.toLowerCase()) ||
        tab.url.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
    setSearchDropdownVisible(results.length > 0);
  };
  // Sincronizar o estado de searchQuery externo com o interno
  useEffect(() => {
    // Só atualiza se o valor externo for diferente do interno
    if (searchQuery !== undefined && searchQuery !== null && searchQuery !== searchQueryState) {
      // Usar o valor externo para atualizar o estado interno
      setSearchQuery(searchQuery);

      // Atualizar os resultados da pesquisa quando o searchQuery externo mudar
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        setSearchDropdownVisible(false);
      } else {
        const results = availableTabs.filter(
          (tab: BrowserTab) =>
            tab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tab.url.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
        setSearchDropdownVisible(results.length > 0);
      }
    }
  }, [searchQuery, availableTabs, searchQueryState]);

  // Show restore button when browser is minimized/closed
  if (isClosed || isMinimized) {
    return (
      <div className="flex flex-col items-center justify-center mt-12">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            setIsClosed(false);
            setIsMinimized(false);
          }}
        >
          Restaurar Navegador
        </button>
      </div>
    );
  }

  // Function to position tooltip on hover
  const positionTooltip = (e: React.MouseEvent<HTMLDivElement>) => {
    // Get the element that was hovered
    const tabElement = e.currentTarget;
    const tooltipElement = tabElement.querySelector('.tab-preview-tooltip');

    if (tooltipElement) {
      const tabRect = tabElement.getBoundingClientRect();

      // Position the tooltip centered above the tab
      const tooltipLeft = tabRect.left + tabRect.width / 2;
      const tooltipTop = tabRect.top - 130; // Position above the tab with some spacing

      // Set the position as inline styles (since we're using fixed positioning)
      (tooltipElement as HTMLElement).style.left = `${tooltipLeft}px`;
      (tooltipElement as HTMLElement).style.top = `${tooltipTop}px`;
      (tooltipElement as HTMLElement).style.transform = 'translateX(-50%)';
    }
  };

  // Manipulador de teclas para a barra de URL
  const handleUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    // Pressionar ESC fecha o dropdown e limpa a pesquisa
    if (e.key === 'Escape') {
      setSearchDropdownVisible(false);
      setSearchQuery('');
      if (onSearchChange) {
        onSearchChange('');
      }
      e.currentTarget.blur();
    }

    // Pressionar Enter seleciona o primeiro resultado
    if (e.key === 'Enter' && searchResults.length > 0) {
      const firstResult = searchResults[0];
      handleTabClick(firstResult.id);
      setSearchDropdownVisible(false);
      setSearchQuery('');
      if (onSearchChange) {
        onSearchChange('');
      }
      e.currentTarget.blur();
    }

    // Setas para cima/baixo para navegação nos resultados (futuro)
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && searchResults.length > 0) {
      // Impedir o cursor de se mover no input
      e.preventDefault();
    }
  };
  // Verificar se há uma pesquisa ativa mas sem resultados  // Verificar se há uma pesquisa ativa mas sem resultados
  const hasActiveSearchButNoResults =
    searchQueryState && searchQueryState.trim() !== '' && searchResults.length === 0;
  // Método para alternar favorito em uma aba
  const handleToggleFavorite = (tabId: string) => {
    if (isDecorative) return;

    // Atualizar a lista de abas com o status de favorito alterado
    const updatedTabs = internalTabs.map(tab => {
      if (tab.id === tabId) {
        return {
          ...tab,
          isFavorited: !tab.isFavorited,
        };
      }
      return tab;
    });

    setInternalTabs(updatedTabs);
  };

  // Método para focar na barra de URL - será exposto para MacBrowser
  const focusUrlBar = () => {
    if (urlInputRef.current) {
      urlInputRef.current.focus();
      urlInputRef.current.select();
    }
  };

  // Expor o método focusUrlBar através da ref
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (focusUrlRef) {
      focusUrlRef.current = {
        focusUrlBar,
      };
    }
  }, [focusUrlRef]);

  return (
    <motion.div
      className={`browser-container ${isMaximized ? 'maximized' : ''} ${
        isDecorative ? 'decorative-mode' : ''
      }`}
      style={{ width: isMaximized ? '100%' : width, height: isMaximized ? '100vh' : height }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Browser header with tabs and controls */}
      <div className="browser-header">
        <div className="tab-container">
          {internalTabs.map((tab: BrowserTab) => (
            <div
              key={tab.id}
              className={`tab ${tab.id === internalActiveTabId ? 'active' : ''} relative group`}
              data-tab-id={tab.id}
              onClick={() => handleTabClick(tab.id)}
              onMouseEnter={positionTooltip}
              onMouseMove={positionTooltip}
            >
              <div className="tab-icon">
                {typeof tab.icon === 'string' ? (
                  <Image
                    width={16}
                    height={16}
                    alt={tab.title}
                    src={tab.icon as string}
                    className="tab-icon-img"
                  />
                ) : (
                  tab.icon || <span>{tab.title.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="tab-title">{tab.title}</div>
              {!isDecorative && tab.id !== 'home-tab' && allowToCloseTabs && (
                <button
                  className="tab-close-btn"
                  onClick={e => {
                    e.stopPropagation();
                    handleTabClose(tab.id);
                  }}
                >
                  &times;
                </button>
              )}

              {/* Tab Preview Tooltip - only add to non-active tabs */}
              {tab.id !== internalActiveTabId && (
                <div className="tab-preview-tooltip">
                  <div className="tab-preview-content">
                    <div className="tab-preview-header">
                      <div className="tab-preview-title">{tab.title}</div>
                      <div className="tab-preview-url">{tab.url}</div>
                    </div>
                    <div className="tab-preview-image">
                      {typeof tab.icon === 'string' && (
                        <Image src={tab.icon as string} alt="" className="preview-img" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {!isDecorative && !hideNewTabButton && (
            <button className="new-tab-btn" onClick={handleNewTabClick}>
              <PlusIcon size={16} />
            </button>
          )}
        </div>
        {showWindowControls && (
          <div className="window-controls-right">
            <button
              className="control-btn minimize relative group"
              onClick={handleMinimizeClick}
              aria-label="Minimize"
            >
              <div className="tooltip-text">Minimize</div>
            </button>
            <button
              className="control-btn maximize relative group"
              onClick={handleMaximizeClick}
              aria-label="Maximize"
            >
              <div className="tooltip-text">Maximize</div>
            </button>
            <button
              className="control-btn close relative group"
              onClick={handleCloseClick}
              aria-label="Close"
            >
              <div className="tooltip-text">Close</div>
            </button>
          </div>
        )}
      </div>{' '}
      {/* Address bar */}{' '}
      <div className="address-bar">
        <button className="nav-btn" onClick={handleBackClick} disabled={!onBack}>
          <ChevronLeft size={16} />
        </button>
        <button className="nav-btn" onClick={handleForwardClick} disabled={!onForward}>
          <ChevronRight size={16} />
        </button>
        <button className="nav-btn" onClick={handleRefreshClick} disabled={!onRefresh}>
          <RotateCw size={16} />
        </button>{' '}
        <div
          className={`search-url-container ${searchQueryState ? 'search-mode' : ''} ${isSearchActive ? 'search-active' : ''}`}
        >
          <div className="url-icon">
            {activeTab && typeof activeTab.icon === 'string' ? (
              <Image src={activeTab.icon as string} alt="" className="url-icon-img" />
            ) : activeTab?.icon ? (
              activeTab.icon
            ) : (
              <div className="url-icon-fallback">W</div>
            )}
          </div>{' '}
          <input
            ref={urlInputRef}
            type="text"
            className="url-input"
            value={searchQueryState || activeTab?.url || ''}
            onChange={handleSearchChange}
            placeholder="Digite uma URL ou pesquise projetos..."
            onFocus={() => {
              // Ao focar na barra, limpa o valor para começar uma pesquisa zerada
              setSearchQuery('');
              if (onSearchChange) {
                onSearchChange('');
              }
              // Define que a pesquisa está ativa
              setIsSearchActive(true);
              // Não mostra o dropdown inicialmente até que o usuário digite algo
              setSearchDropdownVisible(false);
            }}
            onBlur={() => {
              // Ao perder o foco sem selecionar nada, restaura a URL original
              setTimeout(() => {
                setIsSearchActive(false);
                if (!searchQueryState && activeTab) {
                  // Restaura a URL original somente se não houve seleção
                  if (!searchDropdownVisible) {
                    setSearchQuery('');
                    if (onSearchChange) {
                      onSearchChange('');
                    }
                  }
                }
              }, 200);
            }}
            onClick={e => {
              // Ao clicar, coloca em modo de pesquisa
              e.currentTarget.select();
              setSearchQuery('');
              if (onSearchChange) {
                onSearchChange('');
              }
            }}
            onKeyDown={handleUrlKeyDown}
          />
          {/* Search dropdown */}
          {searchDropdownVisible && (searchResults.length > 0 || hasActiveSearchButNoResults) && (
            <div className="url-search-dropdown">
              {hasActiveSearchButNoResults ? (
                <div className="url-search-no-results">
                  Nenhum resultado encontrado para &quot;{searchQueryState}&quot;
                </div>
              ) : (
                <>
                  {/* Favorites section - Only show if not hidden by prop */}
                  {!hideFavorites && internalTabs.some(tab => tab.isFavorited) && (
                    <>
                      <div className="url-search-category">
                        <div className="category-header">Favoritos</div>
                      </div>
                      {internalTabs
                        .filter(tab => tab.isFavorited)
                        .map(result => (
                          <div
                            key={result.id}
                            className="url-search-result"
                            onClick={() => {
                              handleTabClick(result.id);
                              setSearchDropdownVisible(false);
                              setSearchQuery('');
                              if (onSearchChange) {
                                onSearchChange('');
                              }
                            }}
                          >
                            <div className="url-search-result-icon">
                              {typeof result.icon === 'string' ? (
                                <Image
                                  src={result.icon as string}
                                  alt=""
                                  className="url-search-result-icon-img"
                                />
                              ) : (
                                result.icon || <span>W</span>
                              )}
                            </div>
                            <div className="url-search-result-content">
                              <div className="url-search-result-title">{result.title}</div>
                              <div className="url-search-result-url">{result.url}</div>
                            </div>
                          </div>
                        ))}
                      <div className="url-search-separator"></div>
                    </>
                  )}

                  {/* Search results section */}
                  <div className="url-search-category">
                    <div className="category-header">Resultados da pesquisa</div>
                  </div>
                  {searchResults.map((result: BrowserTab) => (
                    <div
                      key={result.id}
                      className="url-search-result"
                      onClick={() => {
                        // Ao clicar em um resultado, abre a aba correspondente
                        handleTabClick(result.id);
                        // Limpa a pesquisa e fecha o dropdown
                        setSearchDropdownVisible(false);
                        setSearchQuery('');
                        // Notifica o componente pai para limpar a pesquisa também
                        if (onSearchChange) {
                          onSearchChange('');
                        }
                        // Adiciona um efeito visual para destacar a aba selecionada
                        setTimeout(() => {
                          const tabElement = document.querySelector(`[data-tab-id="${result.id}"]`);
                          if (tabElement) {
                            tabElement.classList.add('tab-highlight');
                            setTimeout(() => {
                              tabElement.classList.remove('tab-highlight');
                            }, 600);
                          }
                        }, 100);
                      }}
                    >
                      <div className="url-search-result-icon">
                        {typeof result.icon === 'string' ? (
                          <Image
                            src={result.icon as string}
                            alt=""
                            className="url-search-result-icon-img"
                          />
                        ) : (
                          result.icon || <span>W</span>
                        )}
                      </div>
                      <div className="url-search-result-content">
                        <div className="url-search-result-title">{result.title}</div>
                        <div className="url-search-result-url">{result.url}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
        {/* Favorite button - Outside URL container */}
        {activeTab && !hideFavorites && (
          <div
            className={`url-favorite-icon ${activeTab?.isFavorited ? 'favorited' : ''}`}
            onClick={e => {
              e.stopPropagation();
              if (activeTab) {
                handleToggleFavorite(activeTab.id);
              }
            }}
            title={activeTab?.isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Star
              size={16}
              className={activeTab?.isFavorited ? 'favorite-star favorited' : 'favorite-star'}
              fill={activeTab?.isFavorited ? 'currentColor' : 'none'}
            />
          </div>
        )}
      </div>
      {/* Browser content area */}
      <div className="browser-content">
        {shouldShowHomeScreen ? (
          <div className="browser-home-screen">
            <div className="page-title">{title}</div>
            <div className="page-subtitle">{subtitle}</div>

            {availableTabs && availableTabs.length > 0 ? (
              <>
                <div className="browser-search-container">
                  <div className="browser-search-bar">
                    <input
                      type="text"
                      className="browser-search-input"
                      placeholder="Pesquisar projetos..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    <button className="browser-search-btn">Pesquisar</button>
                  </div>
                </div>

                <div className="browser-showcase">
                  <h2 className="browser-showcase-title">Projetos Disponíveis</h2>
                  <div className="browser-showcase-grid">
                    {availableTabs.map((tab: BrowserTab) => (
                      <div
                        key={tab.id}
                        className="browser-showcase-item"
                        onClick={() => handleTabClick(tab.id)}
                      >
                        <div className="browser-showcase-card">
                          <div className="browser-showcase-icon">
                            {typeof tab.icon === 'string' ? (
                              <Image
                                src={tab.icon as string}
                                alt=""
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
              </>
            ) : CustomHomeScreen ? (
              <div className="custom-home-screen">{CustomHomeScreen}</div>
            ) : (
              <div className="browser-empty-state">
                <div className="browser-empty-icon">?</div>
                <p>Nenhuma página disponível no momento.</p>
                {!isDecorative && !hideNewTabButton && (
                  <button className="browser-new-tab-btn" onClick={handleNewTabClick}>
                    Criar nova aba
                  </button>
                )}
              </div>
            )}
          </div>
        ) : activeTab ? (
          <div className="tab-content-container">{activeTab.content}</div>
        ) : children ? (
          children
        ) : (
          <Skeleton className="w-full h-full mb-4 min-h-[500px]" />
        )}
        {hasActiveSearchButNoResults && (
          <div className="no-results-indicator">
            <p>Nenhum resultado encontrado para &quot;{searchQueryState}&quot;</p>
          </div>
        )}
      </div>
    </motion.div>
  );
});

export default Browser;
