/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import Image from 'next/image';
import React, { ReactNode, useEffect, useState } from 'react';
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

// Componente padrão para quando o browser está fechado/minimizado
const DefaultRestoreButton = ({ onRestore }: { onRestore: () => void }) => (
  <div className="flex flex-col items-center justify-center mt-12">
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onClick={onRestore}
    >
      Restaurar Navegador
    </button>
  </div>
);

// Componente padrão para home screen
const DefaultHomeScreen = ({
  tabs,
  onTabClick,
}: {
  tabs: BrowserTab[];
  onTabClick: (tabId: string) => void;
}) => (
  <div className="browser-showcase">
    <h2 className="browser-showcase-title">Projetos Disponíveis</h2>
    <div className="browser-showcase-grid">
      {tabs.map((tab: BrowserTab) => (
        <div key={tab.id} className="browser-showcase-item" onClick={() => onTabClick(tab.id)}>
          <div className="browser-showcase-card">
            <div className="browser-showcase-icon">
              {typeof tab.icon === 'string' ? (
                <Image
                  src={tab.icon as string}
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

interface BrowserProps {
  // Todas as abas disponíveis no browser
  tabs: BrowserTab[];

  // Aba que aparece ativa quando o browser é carregado (se não especificada, mostra homeContent)
  initialActiveTab?: string;

  // Abas que iniciam abertas no browser (padrão: vazio, apenas mostra a tela inicial)
  initialOpenTabs?: string[];

  // Conteúdo customizado da tela inicial quando nenhuma aba está ativa
  homeContent?: ReactNode;

  // Dimensões fixas do browser
  width?: string | number;
  height?: string | number;

  // Se o browser permite interação (abrir/fechar abas)
  isInteractive?: boolean;

  // Esconde o botão de nova aba
  hideNewTabButton?: boolean;

  // Controles de janela
  showWindowControls?: boolean;

  // Componente customizado para quando o browser está fechado/minimizado
  customRestoreComponent?: ReactNode;

  // Callbacks
  onTabChange?: (tabId: string | null) => void;
  onTabClose?: (tabId: string) => void;
  onExternalTabRequest?: (tabId: string) => void;

  // Callbacks para controles de janela
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

/*
 * Browser - Componente de navegador com abas, home screen e controles de janela
 * @param tabs - Lista de abas disponíveis no navegador
 * @param initialActiveTab - Aba que aparece ativa quando o navegador é carregado (se não especificada, mostra homeContent)
 * @param initialOpenTabs - Abas que iniciam abertas no navegador (padrão: vazio, apenas mostra a tela inicial)
 * @param homeContent - Conteúdo customizado da tela inicial quando nenhuma aba está ativa
 * @param width - Largura fixa do navegador (padrão: '900px')
 * @param height - Altura fixa do navegador (padrão: '600px')
 * @param isInteractive - Se o navegador permite interação (abrir/fechar abas) (padrão: true)
 *  @param hideNewTabButton - Esconde o botão de nova aba (padrão: false)
 * @param showWindowControls - Se exibe os controles de janela (fechar/minimizar/maximizar) (padrão: true)
 * @param customRestoreComponent - Componente customizado para quando o navegador está fechado/minimizado
 * @param onTabChange - Callback chamado quando a aba ativa é alterada
 * @param onTabClose - Callback chamado quando uma aba é fechada
 * @param onExternalTabRequest - Callback chamado quando uma aba externa é requisitada
 * @param onClose - Callback chamado quando o navegador é fechado
 * @param onMinimize - Callback chamado quando o navegador é minimizado
 * @param onMaximize - Callback chamado quando o navegador é maximizado
 * @returns {React.ReactElement} Elemento React do navegador
 */

const Browser = function Browser({
  tabs,
  initialActiveTab,
  initialOpenTabs = [],
  onTabChange,
  onTabClose,
  onExternalTabRequest: _onExternalTabRequest,
  homeContent,
  width = '900px',
  height = '600px',
  isInteractive = true,
  hideNewTabButton = false,
  showWindowControls = true,
  customRestoreComponent,
  onClose,
  onMinimize,
  onMaximize,
}: BrowserProps): React.ReactElement {
  // Browser state
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  // Initialize home screen state based on homeContent
  const [isHomeScreen, setIsHomeScreen] = useState(!!homeContent && !initialActiveTab);

  // Estado das abas abertas no browser
  const [internalTabs, setInternalTabs] = useState<BrowserTab[]>(() => {
    const openTabs = [];
    if (initialOpenTabs && initialOpenTabs.length > 0) {
      openTabs.push(...tabs.filter(tab => initialOpenTabs.includes(tab.id)));
    }
    return openTabs;
  });

  // Aba atualmente ativa
  const [internalActiveTabId, setInternalActiveTabId] = useState<string | undefined>(
    initialActiveTab ||
      (initialOpenTabs && initialOpenTabs.length > 0 ? initialOpenTabs[0] : undefined)
  );

  // Find active tab object
  const activeTab = internalTabs.find((tab: BrowserTab) => tab.id === internalActiveTabId);

  // Flag to determine whether to show home screen
  const shouldShowHomeScreen =
    isHomeScreen || (!activeTab && homeContent) || activeTab?.id === 'home-tab';

  // Window control handlers
  const handleCloseClick = (): void => {
    if (!isInteractive) return;

    if (onClose) {
      onClose();
    } else {
      setIsClosed(true);
    }
  };

  const handleMinimizeClick = (): void => {
    if (!isInteractive) return;

    if (onMinimize) {
      onMinimize();
    } else {
      setIsMinimized(true);
    }
  };

  const handleMaximizeClick = (): void => {
    if (!isInteractive) return;

    if (onMaximize) {
      onMaximize();
    } else {
      setIsMaximized(!isMaximized);
    }
  };

  const handleRestore = (): void => {
    setIsClosed(false);
    setIsMinimized(false);
  };

  // Initialize internal tabs when external tabs change
  useEffect(() => {
    if (tabs && tabs.length > 0) {
      // Atualizar apenas as abas abertas se alguma tab foi modificada
      setInternalTabs(prevTabs =>
        prevTabs.map(openTab => {
          const updatedTab = tabs.find(tab => tab.id === openTab.id);
          return updatedTab || openTab;
        })
      );
    }
  }, [tabs]);
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

  // Function to open a tab dynamically (for home screen clicks)
  const openTab = (tabId: string): void => {
    if (!isInteractive) return;

    // Check if tab exists in available tabs
    const tabToOpen = tabs.find(tab => tab.id === tabId);
    if (!tabToOpen) {
      console.error(`Tab ${tabId} not found in available tabs`);
      return;
    }

    // Check if tab is already open
    const isTabAlreadyOpen = internalTabs.some(tab => tab.id === tabId);

    if (!isTabAlreadyOpen) {
      // Add tab to internal tabs
      setInternalTabs(prevTabs => [...prevTabs, tabToOpen]);
    }

    // Always activate the tab and exit home screen
    setIsHomeScreen(false);
    setInternalActiveTabId(tabId);

    // Notify parent component
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  // Handle closing a tab
  const handleTabClose = (tabId: string): void => {
    // Não permitir fechar abas no modo não interativo
    if (!isInteractive) return;

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

  const handleNewTabClick = (): void => {
    if (!isInteractive) return;

    // Criar uma nova aba vazia e ativar a home screen
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
  };

  // Show restore button when browser is minimized/closed
  if (isClosed || isMinimized) {
    return (
      (customRestoreComponent as React.ReactElement) || (
        <DefaultRestoreButton onRestore={handleRestore} />
      )
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

  return (
    <motion.div
      className={`browser-container ${isMaximized ? 'maximized' : ''} ${
        !isInteractive ? 'decorative-mode' : ''
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
              {isInteractive && tab.id !== 'home-tab' && (
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
                        <Image
                          src={tab.icon as string}
                          alt={tab.title}
                          className="preview-img"
                          width={64}
                          height={64}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isInteractive && !hideNewTabButton && (
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
      </div>
      {/* Browser content area */}
      <div className="browser-content">
        {shouldShowHomeScreen ? (
          <div className="browser-home-screen">
            {homeContent ? (
              <div className="custom-home-screen">
                {React.isValidElement(homeContent)
                  ? React.cloneElement(homeContent, { onTabOpen: openTab } as any)
                  : homeContent}
              </div>
            ) : (
              <DefaultHomeScreen tabs={tabs} onTabClick={openTab} />
            )}
          </div>
        ) : activeTab ? (
          <div className="tab-content-container">{activeTab.content}</div>
        ) : (
          <Skeleton className="w-full h-full mb-4 min-h-[500px]" />
        )}
      </div>
    </motion.div>
  );
};

export default Browser;
