'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, PlusIcon, RotateCw } from 'lucide-react';
import { ReactNode, useState, useEffect, useRef } from 'react';
import './Browser.css';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

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
  /** Dados adicionais opcionais que podem ser usados pelo componente */
  data?: Record<string, any>;
}

interface BrowserProps {
  /** Set to true to use as decorative element without interactions */
  isDecorative?: boolean;
  /** Lista de abas a serem exibidas */
  tabs?: BrowserTab[];
  /** Lista de abas disponíveis (para controle de estado) */
  availableTabs?: BrowserTab[];
  /** ID da aba ativa */
  activeTabId?: string;
  /** Handler para mudança de aba */
  onTabChange?: (tabId: string) => void;
  /** Title to display in content area (if showing projects) */
  title?: string;
  /** Subtitle to display in content area (if showing projects) */
  subtitle?: string;
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
  /** Callback for when refresh button is clicked */
  onRefresh?: () => void;
  /** Callback for when new tab button is clicked */
  onNewTab?: () => void;
  /** Callback for when a tab is closed */
  onTabClose?: (tabId: string) => void;
  /** Width of the browser (default full width) */
  width?: string;
  /** Height of the browser (default auto) */
  height?: string;
  /** Content to display in the browser if no tabs are provided */
  children?: ReactNode;
  /** Whether to show window controls (close, minimize, maximize) */
  showWindowControls?: boolean;
}

export default function Browser({
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
}: BrowserProps) {
  // Browser state
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isHomeScreen, setIsHomeScreen] = useState(true); // Sempre começar na home screen
  const [internalTabs, setInternalTabs] = useState<BrowserTab[]>(tabs);
  const [internalActiveTabId, setInternalActiveTabId] = useState<string | undefined>(activeTabId);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Estado para a busca
  const [carouselSlide, setCarouselSlide] = useState(0); // Estado para controlar o carousel
  // Usar tabs internas se não houver props de controle externo
  const effectiveTabs = onTabChange ? tabs : internalTabs;
  const effectiveActiveTabId = onTabChange ? activeTabId : internalActiveTabId;
  // Get current tab information
  const activeTab =
    effectiveTabs.find(tab => tab.id === effectiveActiveTabId) ||
    (effectiveTabs.length > 0 ? effectiveTabs[0] : null);

  // Se a aba atual não tiver conteúdo, mostrar a home screen
  // Isso é para lidar com o caso da "Nova Aba"
  const shouldShowHomeScreen = isHomeScreen || (activeTab && activeTab.content === null);

  const currentUrl = activeTab?.url || 'https://lucashdo.com/';

  // Estado para controlar o dropdown do search
  const [searchDropdownVisible, setSearchDropdownVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<BrowserTab[]>([]);

  // Browser control functions  // Browser control functions
  const closeBrowser = () => {
    if (isDecorative) return;
    if (onClose) {
      onClose();
    } else {
      setIsClosed(true);
    }
  };

  const minimizeBrowser = () => {
    if (isDecorative) return;
    if (onMinimize) {
      onMinimize();
    } else {
      setIsMinimized(true);
    }
  };

  const maximizeBrowser = () => {
    if (isDecorative) return;
    if (onMaximize) {
      onMaximize();
    } else {
      setIsMaximized(prev => !prev);
    }
  };

  const restoreBrowser = () => {
    setIsClosed(false);
    setIsMinimized(false);
  };

  // Navigation functions
  const handleBack = () => {
    if (isDecorative) return;
    if (onBack) {
      onBack();
    } else {
      console.log('Back clicked');
    }
  };

  const handleForward = () => {
    if (isDecorative) return;
    if (onForward) {
      onForward();
    } else {
      console.log('Forward clicked');
    }
  };

  const handleRefresh = () => {
    if (isDecorative) return;
    if (onRefresh) {
      onRefresh();
    } else {
      console.log('Refresh clicked');
    }
  };
  const handleNewTabClick = () => {
    if (isDecorative) return;
    if (onNewTab) {
      // Usar o handler externo se fornecido
      onNewTab();
    } else {
      // Não criar uma nova aba com conteúdo, apenas mostrar a home screen
      // E deixar o usuário escolher qual conteúdo deseja visualizar
      // Isso é mais parecido com o comportamento de um navegador real
      const newTabId = `new-tab-${Date.now()}`;
      const newTab: BrowserTab = {
        id: newTabId,
        title: 'Nova Aba',
        url: 'https://lucashdo.com/',
        content: null, // Conteúdo vazio, pois vamos mostrar a home screen em vez disso
      };
      // Adicionar nova aba à lista interna e ativá-la
      // Para componentes que controlam estado internamente
      const updatedTabs = [...internalTabs, newTab]; // Atualizar o estado interno com a nova aba
      setInternalTabs(updatedTabs);

      // Ativar a nova aba e mostrar a home screen
      // para que o usuário possa escolher um conteúdo
      setInternalActiveTabId(newTabId);
      setIsHomeScreen(true);
    }
  };

  // Tab management functions
  // Always allow tab navigation, even in decorative mode
  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      // Use external handler if provided
      onTabChange(tabId);
    } else {
      // Otherwise manage internally
      setInternalActiveTabId(tabId);
      // Sempre desligamos a home screen ao clicar em uma aba
      setIsHomeScreen(false);
    }
  };
  const handleTabClose = (tabId: string) => {
    // Não permitir fechar abas no modo decorativo
    if (isDecorative) return;

    // Não permitir fechar a aba Home
    if (tabId === 'home') return;

    // Não permitir fechar a última aba
    const currentTabs = onTabClose ? tabs : internalTabs;
    if (currentTabs.length <= 1) return;

    if (onTabClose) {
      // Se há um callback externo, usá-lo
      onTabClose(tabId);
    } else {
      // Gerenciar internamente
      // Filtrar para obter as abas restantes após o fechamento
      const remainingTabs = internalTabs.filter(tab => tab.id !== tabId);

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
    }
  };
  // Go to home screen - always available
  const goToHome = () => {
    setIsHomeScreen(true);
  };

  // Show restore button when browser is minimized/closed
  if (isClosed || isMinimized) {
    return (
      <div className="flex flex-col items-center justify-center mt-12">
        <button className="restore-btn" onClick={restoreBrowser}>
          {isClosed ? 'Reabrir Browser' : 'Restaurar Browser'}
        </button>
      </div>
    );
  }
  return (
    <motion.div
      className={`browser-container ${isMaximized ? 'maximized' : ''} ${isDecorative ? 'decorative-mode' : ''}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ width, height }}
    >
      {/* Window Controls Header */}
      <div className="browser-header">
        {/* Movendo os controles para o lado esquerdo conforme solicitado */}
        {showWindowControls && (
          <div className="window-controls window-controls-left">
            <button className="control-btn close" onClick={closeBrowser} />
            <button className="control-btn minimize" onClick={minimizeBrowser} />
            <button
              className={`control-btn maximize ${isMaximized ? 'active' : ''}`}
              onClick={maximizeBrowser}
            />
          </div>
        )}
        <div className="tab-container">
          {' '}
          {/* Home Tab */}
          <div className={`tab ${isHomeScreen ? 'active' : ''}`} onClick={goToHome}>
            <div className="tab-icon">H</div>
            <span className="tab-title">Home</span>
          </div>
          {/* Opened Tabs */}
          {effectiveTabs.length > 0 &&
            effectiveTabs.map(tab => (
              <div
                key={tab.id}
                className={`tab ${!isHomeScreen && tab.id === effectiveActiveTabId ? 'active' : ''}`}
                onClick={() => {
                  handleTabClick(tab.id);
                  setIsHomeScreen(false);
                }}
              >
                <div className="tab-icon">
                  {tab.icon ? (
                    typeof tab.icon === 'string' ? (
                      <img src={tab.icon} alt={tab.title} className="tab-icon-img" />
                    ) : (
                      tab.icon
                    )
                  ) : (
                    tab.title.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="tab-title">{tab.title}</span>{' '}
                {/* Mostrar o botão de fechar apenas se:
                    1. Esta for a aba ativa
                    2. Não estiver em modo decorativo
                    3. Não for a aba Home
                    4. Houver mais de uma aba aberta (além da Home)
                */}
                {tab.id === effectiveActiveTabId &&
                  !isDecorative &&
                  tab.id !== 'home' &&
                  effectiveTabs.length > 1 && (
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
              </div>
            ))}{' '}
          {/* New Tab button, only shown if not in decorative mode */}
          {!isDecorative && (
            <button className="new-tab-btn" onClick={handleNewTabClick}>
              <PlusIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>{' '}
      {/* Address Bar */}
      <div className="address-bar relative">
        <div className="nav-controls">
          <button className="nav-btn" onClick={handleBack} disabled={isDecorative}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="nav-btn" onClick={handleForward} disabled={isDecorative}>
            <ChevronRight className="w-6 h-6" />
          </button>
          <button className="nav-btn" onClick={handleRefresh} disabled={isDecorative}>
            <RotateCw className="w-5 h-5" />
          </button>{' '}
        </div>{' '}
        <div className="search-url-container relative">
          <div className="url-icon">
            {activeTab?.icon ? (
              typeof activeTab.icon === 'string' ? (
                <img src={activeTab.icon} alt={activeTab.title} className="url-icon-img" />
              ) : (
                activeTab.icon
              )
            ) : (
              <div className="url-icon-fallback">{activeTab?.title?.charAt(0) || 'L'}</div>
            )}
          </div>
          <Input
            type="text"
            className="url-input"
            value={searchQuery || currentUrl}
            onChange={e => {
              const query = e.target.value;
              setSearchQuery(query);

              // Filtrar resultados para o dropdown
              if (query) {
                const lowerQuery = query.toLowerCase();
                const filtered = availableTabs.filter(
                  tab =>
                    tab.title.toLowerCase().includes(lowerQuery) ||
                    tab.url.toLowerCase().includes(lowerQuery) ||
                    (tab.data?.tags &&
                      Array.isArray(tab.data.tags) &&
                      tab.data.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
                );
                setSearchResults(filtered);
                setSearchDropdownVisible(true);
              } else {
                setSearchDropdownVisible(false);
              }
            }}
            onFocus={() => {
              if (searchQuery) setSearchDropdownVisible(true);
            }}
            onBlur={() => {
              // Pequeno delay para permitir que o usuário clique em um resultado
              setTimeout(() => setSearchDropdownVisible(false), 200);
            }}
            placeholder="Pesquise ou digite uma URL..."
            onKeyDown={e => {
              if (e.key === 'Enter' && searchQuery) {
                // Se tiver resultados, usar o primeiro
                if (searchResults.length > 0) {
                  const tabToOpen = searchResults[0];
                  // Adicionar a aba se ela ainda não estiver aberta
                  if (!onTabChange) {
                    const tabExists = internalTabs.some(t => t.id === tabToOpen.id);
                    if (!tabExists) {
                      setInternalTabs(prev => [...prev, tabToOpen]);
                    }
                  }
                  handleTabClick(tabToOpen.id);
                  setIsHomeScreen(false);
                }
                // Limpar a pesquisa e fechar o dropdown
                setSearchQuery('');
                setSearchDropdownVisible(false);
              }

              // Fechar o dropdown ao pressionar Escape
              if (e.key === 'Escape') {
                setSearchDropdownVisible(false);
              }
            }}
            readOnly={isDecorative}
          />

          {/* Dropdown de resultados de pesquisa */}
          {searchDropdownVisible && searchResults.length > 0 && (
            <div className="url-search-dropdown">
              {searchResults.slice(0, 5).map(tab => (
                <div
                  key={tab.id}
                  className="url-search-result"
                  onClick={() => {
                    if (!onTabChange) {
                      const tabExists = internalTabs.some(t => t.id === tab.id);
                      if (!tabExists) {
                        setInternalTabs(prev => [...prev, tab]);
                      }
                    }
                    handleTabClick(tab.id);
                    setIsHomeScreen(false);
                    setSearchQuery('');
                    setSearchDropdownVisible(false);
                  }}
                >
                  <div className="url-search-result-icon">
                    {tab.icon ? (
                      typeof tab.icon === 'string' ? (
                        <img
                          src={tab.icon}
                          alt={tab.title}
                          className="url-search-result-icon-img"
                        />
                      ) : (
                        tab.icon
                      )
                    ) : (
                      tab.title.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="url-search-result-content">
                    <div className="url-search-result-title">{tab.title}</div>
                    <div className="url-search-result-url">{tab.url}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Link
          className="open-link-icon"
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="w-5 h-5" />
        </Link>
      </div>{' '}
      {/* Content Area */}
      <div className="browser-content">
        {/* Home Screen with available tabs - mostrar quando:
            1. Estiver na tela home explicitamente 
            2. Quando uma aba vazia/nova aba for selecionada 
        */}
        {shouldShowHomeScreen ? (
          <div className="browser-home-screen">
            <div className="space-y-6">
              <h1 className="page-title">{title}</h1>
              {subtitle && <p className="page-subtitle">{subtitle}</p>}

              {/* Projetos em destaque em grid */}
              {availableTabs.length > 0 ? (
                <>
                  {/* Seção de projetos pinados */}
                  <section className="pinned-projects-section">
                    <h2 className="browser-section-title">Projetos em Destaque</h2>
                    <div className="pinned-projects-grid">
                      {availableTabs
                        .filter(tab => tab.data?.featured)
                        .slice(0, 6) // Limitar a 6 projetos em destaque
                        .map(tab => (
                          <div
                            key={tab.id}
                            className="pinned-project-wrapper"
                            onClick={() => {
                              // Adicionar a aba disponível às abas abertas quando não há controle externo
                              if (!onTabChange) {
                                const tabExists = internalTabs.some(t => t.id === tab.id);
                                if (!tabExists) {
                                  setInternalTabs(prev => [...prev, tab]);
                                }
                              }

                              handleTabClick(tab.id);
                              setIsHomeScreen(false);
                            }}
                          >
                            <div className="pinned-project-item">
                              {tab.icon ? (
                                typeof tab.icon === 'string' ? (
                                  <img
                                    src={tab.icon}
                                    alt={tab.title}
                                    className="pinned-project-icon-img"
                                  />
                                ) : (
                                  tab.icon
                                )
                              ) : (
                                <div className="pinned-project-fallback">
                                  {tab.title.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="pinned-project-title">{tab.title}</div>
                          </div>
                        ))}
                    </div>
                  </section>{' '}
                  {/* Seção de carousel de projetos */}
                  <section className="carousel-projects-section">
                    <h2 className="browser-section-title">Todos os Projetos</h2>
                    <div className="carousel-container">
                      {' '}
                      <div
                        className="carousel-slides"
                        style={{ transform: `translateX(-${carouselSlide * 100}%)` }}
                      >
                        {/* Dividindo os projetos em slides de 10 (5x2) */}
                        {Array.from(
                          { length: Math.ceil(availableTabs.length / 10) },
                          (_, slideIndex) => (
                            <div className="carousel-slide" key={slideIndex}>
                              <div className="carousel-projects-grid">
                                {availableTabs
                                  .slice(slideIndex * 10, slideIndex * 10 + 10)
                                  .map(tab => (
                                    <div
                                      key={tab.id}
                                      className={`browser-showcase-card ${
                                        tab.data?.featured ? 'featured' : ''
                                      }`}
                                      onClick={() => {
                                        // Adicionar a aba disponível às abas abertas quando não há controle externo
                                        if (!onTabChange) {
                                          const tabExists = internalTabs.some(t => t.id === tab.id);
                                          if (!tabExists) {
                                            setInternalTabs(prev => [...prev, tab]);
                                          }
                                        }

                                        handleTabClick(tab.id);
                                        setIsHomeScreen(false);
                                      }}
                                    >
                                      {/* Badge indicando que o projeto é destacado */}
                                      {tab.data?.featured && (
                                        <div className="browser-showcase-featured-badge">
                                          Destaque
                                        </div>
                                      )}

                                      <div className="browser-showcase-icon">
                                        {tab.icon ? (
                                          typeof tab.icon === 'string' ? (
                                            <img
                                              src={tab.icon}
                                              alt={tab.title}
                                              className="browser-showcase-icon-img"
                                            />
                                          ) : (
                                            tab.icon
                                          )
                                        ) : (
                                          tab.title.charAt(0).toUpperCase()
                                        )}
                                      </div>
                                      <div className="browser-showcase-content">
                                        <div className="browser-showcase-title">{tab.title}</div>
                                        <div className="browser-showcase-url">{tab.url}</div>

                                        {/* Exibir tags do projeto se disponíveis */}
                                        {tab.data?.tags && tab.data.tags.length > 0 && (
                                          <div className="browser-showcase-tags">
                                            {Array.isArray(tab.data.tags) &&
                                              tab.data.tags.slice(0, 3).map((tag, index) => (
                                                <span key={index} className="browser-showcase-tag">
                                                  {tag}
                                                </span>
                                              ))}
                                          </div>
                                        )}

                                        <div className="browser-showcase-action">Visitar →</div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>{' '}
                      <div className="carousel-controls">
                        <button
                          className="carousel-prev-btn"
                          onClick={() => setCarouselSlide(prev => Math.max(0, prev - 1))}
                          disabled={carouselSlide === 0}
                        >
                          ← Anterior
                        </button>
                        <div className="carousel-dots">
                          {Array.from({ length: Math.ceil(availableTabs.length / 5) }, (_, i) => (
                            <button
                              key={i}
                              className={`carousel-dot ${carouselSlide === i ? 'active' : ''}`}
                              onClick={() => setCarouselSlide(i)}
                            />
                          ))}
                        </div>
                        <button
                          className="carousel-next-btn"
                          onClick={() =>
                            setCarouselSlide(prev =>
                              Math.min(Math.ceil(availableTabs.length / 5) - 1, prev + 1)
                            )
                          }
                          disabled={carouselSlide === Math.ceil(availableTabs.length / 5) - 1}
                        >
                          Próximo →
                        </button>
                      </div>
                    </div>
                  </section>
                </>
              ) : (
                <div className="browser-empty-state">
                  <div className="browser-empty-icon">?</div>
                  <p>Nenhuma página disponível no momento.</p>
                  {!isDecorative && (
                    <button className="browser-new-tab-btn" onClick={handleNewTabClick}>
                      Criar nova aba
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : activeTab ? (
          <div className="tab-content-container">{activeTab.content}</div>
        ) : /* If children are provided, show them instead of a skeleton */
        children ? (
          children
        ) : (
          <Skeleton className="w-full h-full h-8 mb-4 min-h-[500px]" />
        )}
      </div>
    </motion.div>
  );
}
