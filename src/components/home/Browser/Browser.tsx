/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import React, { ReactNode, useCallback, useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import './Browser.css';
import {
  AddressBar,
  DefaultHomeScreen,
  DefaultRestoreButton,
  Tab,
  TabPreviewTooltip,
  WindowControls,
} from './components';
import { useBrowserTabs } from './hooks/useBrowserTabs';
import { BrowserTab } from './types/BrowserTab';

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

  // Controle externo da aba ativa
  externalActiveTabId?: string;
  onExternalTabChange?: (tabId: string) => void;
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
 * @param hideNewTabButton - Esconde o botão de nova aba (padrão: false)
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
  externalActiveTabId,
}: BrowserProps): React.ReactElement {
  // Browser state
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  // Initialize tabs state
  const initialTabs =
    initialOpenTabs.length > 0 ? tabs.filter(tab => initialOpenTabs.includes(tab.id)) : [];

  const {
    tabs: internalTabs,
    activeTabIndex,
    isHomeScreen,
    activeTab,
    addTab,
    removeTab,
    setActiveTab,
    setHomeScreen,
    createHomeTab,
    createNewTab,
    transformTab,
  } = useBrowserTabs(
    initialTabs,
    initialActiveTab || (initialOpenTabs.length > 0 ? initialOpenTabs[0] : undefined),
    !!homeContent && !initialActiveTab
  );

  // Tooltip state para Floating UI
  const [previewTabId, setPreviewTabId] = useState<string | null>(null);
  const [previewRef, setPreviewRef] = useState<HTMLElement | null>(null);

  // Responder ao controle externo da aba ativa
  useEffect(() => {
    if (externalActiveTabId && externalActiveTabId !== activeTab?.id) {
      const tabIndex = internalTabs.findIndex(tab => tab.id === externalActiveTabId);
      if (tabIndex >= 0) {
        setActiveTab(tabIndex);
        setHomeScreen(false);
      }
    }
  }, [externalActiveTabId, activeTab?.id, internalTabs, setActiveTab, setHomeScreen]);

  // Window control handlers
  const handleCloseClick = useCallback((): void => {
    if (!isInteractive) return;

    if (onClose) {
      onClose();
    } else {
      setIsClosed(true);
    }
  }, [isInteractive, onClose]);

  const handleMinimizeClick = useCallback((): void => {
    if (!isInteractive) return;

    if (onMinimize) {
      onMinimize();
    } else {
      setIsMinimized(true);
    }
  }, [isInteractive, onMinimize]);

  const handleMaximizeClick = useCallback((): void => {
    if (!isInteractive) return;

    if (onMaximize) {
      onMaximize();
    } else {
      setIsMaximized(!isMaximized);
    }
  }, [isInteractive, onMaximize, isMaximized]);

  const handleRestore = useCallback((): void => {
    setIsClosed(false);
    setIsMinimized(false);
  }, []);

  // Handle click on tab (trocar de aba)
  const handleTabClick = useCallback(
    (tabIndex: number): void => {
      if (tabIndex === activeTabIndex) return;
      setActiveTab(tabIndex);
      setHomeScreen(false);
      if (onTabChange) {
        onTabChange(internalTabs[tabIndex]?.id || '');
      }
    },
    [activeTabIndex, setActiveTab, setHomeScreen, onTabChange, internalTabs]
  );

  // Lógica simplificada: se a aba ativa é new/home, transforma ela
  const openTab = useCallback(
    (tabId: string): void => {
      const tabToOpen = tabs.find(tab => tab.id === tabId);
      if (!tabToOpen) return;
      const currentActiveIndex = activeTabIndex !== null ? activeTabIndex : -1;
      const activeTabObj = currentActiveIndex >= 0 ? internalTabs[currentActiveIndex] : null;

      // Se a aba ativa é new ou home, transforma ela
      if (activeTabObj && (activeTabObj.type === 'new' || activeTabObj.type === 'home')) {
        transformTab(currentActiveIndex, {
          ...tabToOpen,
          id: activeTabObj.id, // Mantém o ID original
        });
        if (onTabChange) onTabChange(tabToOpen.id);
        return;
      }

      // Se não é new/home tab, abre normalmente
      const isTabAlreadyOpen = internalTabs.some(tab => tab.id === tabId);
      if (!isTabAlreadyOpen) {
        addTab(tabToOpen);
      }
      const newTabIndex = internalTabs.findIndex(tab => tab.id === tabId);
      if (newTabIndex >= 0) {
        setActiveTab(newTabIndex);
      } else {
        // Se a aba não foi encontrada, adicionar e ativar
        addTab(tabToOpen);
        setActiveTab(internalTabs.length);
      }
      if (onTabChange) onTabChange(tabId);
    },
    [tabs, internalTabs, activeTabIndex, transformTab, addTab, setActiveTab, onTabChange]
  );

  // handleNewTabClick: cria new tab
  const handleNewTabClick = useCallback((): void => {
    if (!isInteractive) return;
    const newTab = createNewTab();
    addTab(newTab);
    setActiveTab(internalTabs.length); // Usar o índice da nova aba
    setHomeScreen(true);
  }, [isInteractive, createNewTab, addTab, setActiveTab, setHomeScreen, internalTabs.length]);

  // Transforma a aba atual em home
  const handleTransformToHome = useCallback(
    (tabIndex: number) => {
      const homeTab = createHomeTab();
      transformTab(tabIndex, {
        ...homeTab,
        id: internalTabs[tabIndex]?.id || '', // Mantém o ID original
      });
      setHomeScreen(true);
    },
    [createHomeTab, transformTab, setHomeScreen, internalTabs]
  );

  // Handle closing a tab
  const handleTabClose = useCallback(
    (tabIndex: number): void => {
      if (!isInteractive) return;
      if (internalTabs.length <= 1) return;
      const tabId = internalTabs[tabIndex]?.id;
      if (onTabClose && tabId) {
        onTabClose(tabId);
      }
      removeTab(tabIndex);
    },
    [isInteractive, internalTabs, onTabClose, removeTab]
  );

  // Show restore button when browser is minimized/closed
  if (isClosed || isMinimized) {
    return (
      (customRestoreComponent as React.ReactElement) || (
        <DefaultRestoreButton onRestore={handleRestore} />
      )
    );
  }

  // Flag to determine whether to show home screen
  const shouldShowHomeScreen =
    isHomeScreen || (!activeTab && homeContent) || activeTab?.type === 'new';

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
        <div className="tab-container" role="tablist">
          {internalTabs.map((tab: BrowserTab, index: number) =>
            (() => {
              const tabRef = React.createRef<HTMLDivElement>();
              return (
                <Tab
                  key={tab.id}
                  tab={tab}
                  tabIndex={index}
                  isActive={index === activeTabIndex}
                  isInteractive={isInteractive}
                  onClick={handleTabClick}
                  onClose={handleTabClose}
                  ref={tabRef}
                  onMouseEnter={() => {
                    setPreviewTabId(tab.id);
                    setPreviewRef(tabRef.current);
                  }}
                  onMouseMove={() => {
                    setPreviewTabId(tab.id);
                    setPreviewRef(tabRef.current);
                  }}
                  onMouseLeave={() => {
                    setPreviewTabId(null);
                    setPreviewRef(null);
                  }}
                />
              );
            })()
          )}
          {isInteractive && !hideNewTabButton && (
            <button
              className="new-tab-btn"
              onClick={handleNewTabClick}
              aria-label="Nova aba"
              title="Nova aba"
            >
              <PlusIcon size={16} />
            </button>
          )}
        </div>
        {showWindowControls && isInteractive && (
          <WindowControls
            isInteractive={isInteractive}
            isMaximized={isMaximized}
            onClose={handleCloseClick}
            onMinimize={handleMinimizeClick}
            onMaximize={handleMaximizeClick}
          />
        )}
      </div>
      <AddressBar
        tab={activeTab || internalTabs[0]}
        availableTabs={tabs}
        onTabSelect={openTab}
        onTransformToHome={handleTransformToHome}
        currentTabIndex={activeTabIndex || 0}
        isInteractive={isInteractive}
      />
      {/* Browser content area */}
      <div className="browser-content">
        {activeTab ? (
          <>
            <div className="tab-content-container">
              {activeTab.type === 'home' || activeTab.type === 'new' || shouldShowHomeScreen ? (
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
              ) : (
                activeTab.content
              )}
            </div>
          </>
        ) : shouldShowHomeScreen ? (
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
        ) : (
          <Skeleton className="w-full h-full mb-4 min-h-[500px]" />
        )}
      </div>

      {/* Tab Preview Tooltip */}
      {previewTabId && previewRef && (
        <TabPreviewTooltip
          tab={internalTabs.find(tab => tab.id === previewTabId) || tabs[0]}
          open={!!previewTabId}
          reference={previewRef}
        />
      )}
    </motion.div>
  );
};

export default Browser;
