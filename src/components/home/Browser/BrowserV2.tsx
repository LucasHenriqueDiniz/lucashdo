import {
  ReactNode,
  useEffect,
  useImperativeHandle,
  useState,
  forwardRef,
  useCallback,
  useMemo,
} from 'react';
import './BrowserV2.css';
import { RotateCw, Home } from 'lucide-react';

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  content: ReactNode;
  icon?: ReactNode;
}

export interface BrowserHandle {
  openTab: (tabId: string) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string | null) => void;
  getCurrentTab: () => string | null;
  getOpenTabs: () => BrowserTab[];
  createNewTab: () => void;
}

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

  // Callbacks
  onTabChange?: (tabId: string | null) => void;
  onTabClose?: (tabId: string) => void;
  onExternalTabRequest?: (tabId: string) => void; // Callback para solicitações externas de mudança de aba
}

const BrowserV2 = forwardRef<BrowserHandle, BrowserProps>(
  (
    {
      tabs,
      initialActiveTab,
      initialOpenTabs = [],
      onTabChange,
      onTabClose,
      onExternalTabRequest,
      homeContent,
      width = 800,
      height = 600,
      isInteractive = true,
      hideNewTabButton = false,
    },
    ref
  ) => {
    // Estado das abas abertas no browser
    const [internalTabs, setInternalTabs] = useState<BrowserTab[]>(() => {
      const openTabs = [];
      if (initialOpenTabs && initialOpenTabs.length > 0) {
        openTabs.push(...tabs.filter(tab => initialOpenTabs.includes(tab.id)));
      }
      return openTabs;
    });

    // Aba atualmente ativa
    const [currentTabId, setCurrentTabId] = useState<string | null>(
      initialActiveTab ||
        (initialOpenTabs && initialOpenTabs.length > 0 ? initialOpenTabs[0] : null)
    );

    // Função utilitária para verificar se uma aba é Home
    const isHomeTab = useCallback((tab: BrowserTab) => {
      return tab.title === 'Home' || tab.url === 'about:home' || tab.id === '__home__';
    }, []);

    // Callbacks otimizados
    const handleTabClick = useCallback(
      (tabId: string) => {
        if (!isInteractive) return;

        // Se clicou na mesma aba, não faz nada
        if (currentTabId === tabId) return;

        // Verificar se a aba já está aberta nas abas internas
        if (internalTabs.some(tab => tab.id === tabId)) {
          setCurrentTabId(tabId);
          onTabChange?.(tabId);
          return;
        }

        // Buscar a aba para abrir
        const tabToOpen = tabs.find(tab => tab.id === tabId);
        if (!tabToOpen) return;

        // CASO 1: Se não há abas abertas (está na home especial), adicionar a primeira aba
        if (internalTabs.length === 0) {
          setInternalTabs([tabToOpen]);
          setCurrentTabId(tabId);
          onTabChange?.(tabId);
          return;
        }

        // CASO 2: Se a aba atual é uma aba Home dinâmica, substituir por esta nova
        const currentTab = internalTabs.find(tab => tab.id === currentTabId);
        if (currentTab && isHomeTab(currentTab)) {
          // Remove todas as abas Home e substitui pela nova aba
          setInternalTabs(prev =>
            prev
              .filter(tab => !isHomeTab(tab))
              .map(tab => (tab.id === currentTabId ? tabToOpen : tab))
          );
          setCurrentTabId(tabId);
          onTabChange?.(tabId);
          return;
        }

        // CASO 3: Padrão - adicionar nova aba (mas remover qualquer Home duplicada)
        setInternalTabs(prev => [...prev.filter(tab => !isHomeTab(tab)), tabToOpen]);
        setCurrentTabId(tabId);
        onTabChange?.(tabId);
      },
      [isInteractive, currentTabId, tabs, internalTabs, onTabChange, isHomeTab]
    );

    // Aba especial para Home (depende de handleTabClick)
    const homeTab: BrowserTab = useMemo(
      () => ({
        id: '__home__',
        title: 'Home',
        url: 'about:home',
        content: homeContent || (
          <div className="home-screen">
            <div className="home-screen-header">
              <div className="home-screen-icon">🌐</div>
              <h1>Bem-vindo</h1>
              <p>Escolha um projeto para explorar</p>
            </div>

            {tabs.length > 0 && (
              <div className="home-screen-content">
                <h2>Projetos Disponíveis</h2>
                <div className="projects-grid">
                  {tabs.map(tab => (
                    <div
                      key={tab.id}
                      className="project-card"
                      onClick={() => handleTabClick(tab.id)}
                    >
                      <div className="project-icon">
                        {tab.icon || <span>{tab.title.charAt(0).toUpperCase()}</span>}
                      </div>
                      <div className="project-info">
                        <h3>{tab.title}</h3>
                        <p>{tab.url}</p>
                      </div>
                      <div className="project-arrow">→</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="home-screen-footer">
              <p>💡 Dica: Use Ctrl+T para criar uma nova aba</p>
            </div>
          </div>
        ),
        icon: <span>🏠</span>,
      }),
      [homeContent, tabs, handleTabClick]
    );

    // Se não há abas abertas, mostrar home
    const displayTabs = useMemo(
      () => (internalTabs.length === 0 ? [homeTab] : internalTabs),
      [internalTabs, homeTab]
    );
    const displayCurrentTabId = internalTabs.length === 0 ? '__home__' : currentTabId;

    // Não sobrescrever internalTabs quando tabs mudar, apenas manter as abertas sincronizadas
    useEffect(() => {
      // Atualizar apenas as abas abertas se alguma tab foi modificada
      setInternalTabs(prevTabs =>
        prevTabs.map(openTab => {
          const updatedTab = tabs.find(tab => tab.id === openTab.id);
          return updatedTab || openTab;
        })
      );
    }, [tabs]);

    const handleTabClose = useCallback(
      (tabId: string) => {
        if (!isInteractive) return;
        const newTabs = internalTabs.filter(tab => tab.id !== tabId);
        setInternalTabs(newTabs);
        if (currentTabId === tabId) {
          const nextTab = newTabs[0]?.id || null;
          setCurrentTabId(nextTab);
          onTabChange?.(nextTab);
        }
        onTabClose?.(tabId);
      },
      [isInteractive, internalTabs, currentTabId, onTabChange, onTabClose]
    );

    const handleNewTab = useCallback(() => {
      // Se já estiver na home especial ou não há abas abertas, não fazer nada
      if (currentTabId === '__home__' || internalTabs.length === 0) {
        return;
      }

      // Verificar se já existe uma aba "Home" nas abas abertas
      const existingHomeTab = internalTabs.find(tab => isHomeTab(tab));

      // Se já existe uma aba Home, focar nela
      if (existingHomeTab) {
        setCurrentTabId(existingHomeTab.id);
        onTabChange?.(existingHomeTab.id);
        return;
      }

      // Remover qualquer aba Home existente e criar uma nova
      const newTab: BrowserTab = {
        id: '__home__',
        title: 'Home',
        url: 'about:home',
        content: homeTab.content,
        icon: homeTab.icon,
      };

      // Filtrar qualquer aba Home existente e adicionar a nova
      setInternalTabs(prev => [...prev.filter(tab => !isHomeTab(tab)), newTab]);
      setCurrentTabId('__home__');
      onTabChange?.(newTab.id);
    }, [homeTab, onTabChange, internalTabs, currentTabId, isHomeTab]);

    const [isLoading, setIsLoading] = useState(false);

    const handleRefresh = useCallback(() => {
      setIsLoading(true);
      // Simular refresh
      setTimeout(() => setIsLoading(false), 500);
    }, []);

    // Função para navegar para home
    const handleGoHome = useCallback(() => {
      // Se já está na home especial ou não há abas, não fazer nada
      if (currentTabId === '__home__' || internalTabs.length === 0) {
        return;
      }

      // Se a aba atual já é uma Home, não fazer nada
      const currentTab = internalTabs.find(tab => tab.id === currentTabId);
      if (currentTab && isHomeTab(currentTab)) {
        return;
      }

      // Remover qualquer aba Home existente e transformar a atual em Home
      const newHomeTab: BrowserTab = {
        id: '__home__',
        title: 'Home',
        url: 'about:home',
        content: homeTab.content,
        icon: homeTab.icon,
      };

      if (currentTabId) {
        // Remove todas as abas Home existentes e transforma a atual em Home
        setInternalTabs(prev => {
          return prev
            .filter(tab => !isHomeTab(tab))
            .map(tab => (tab.id === currentTabId ? newHomeTab : tab));
        });
        setCurrentTabId('__home__');
        onTabChange?.(newHomeTab.id);
      }
    }, [currentTabId, internalTabs, homeTab, onTabChange, isHomeTab]);

    // URL da aba atual
    const currentUrl = displayTabs.find(tab => tab.id === displayCurrentTabId)?.url || '';

    // Expor métodos via ref para controle programático
    useImperativeHandle(
      ref,
      () => ({
        openTab: (tabId: string) => {
          // Se a aba já está aberta, apenas focar nela
          if (internalTabs.some(tab => tab.id === tabId)) {
            setCurrentTabId(tabId);
            onTabChange?.(tabId);
            onExternalTabRequest?.(tabId);
            return;
          }

          const tabToOpen = tabs.find(tab => tab.id === tabId);
          if (!tabToOpen) return;

          // CASO 1: Se não há abas abertas, adicionar a primeira
          if (internalTabs.length === 0) {
            setInternalTabs([tabToOpen]);
            setCurrentTabId(tabId);
            onTabChange?.(tabId);
            onExternalTabRequest?.(tabId);
            return;
          }

          // CASO 2: Se a aba atual é Home dinâmica, substituir
          const currentTab = internalTabs.find(tab => tab.id === currentTabId);
          if (currentTab && isHomeTab(currentTab)) {
            // Remove todas as abas Home e substitui pela nova aba
            setInternalTabs(prev =>
              prev
                .filter(tab => !isHomeTab(tab))
                .map(tab => (tab.id === currentTabId ? tabToOpen : tab))
            );
            setCurrentTabId(tabId);
            onTabChange?.(tabId);
            onExternalTabRequest?.(tabId);
            return;
          }

          // CASO 3: Padrão - adicionar nova aba (mas remover qualquer Home duplicada)
          setInternalTabs(prev => [...prev.filter(tab => !isHomeTab(tab)), tabToOpen]);
          setCurrentTabId(tabId);
          onTabChange?.(tabId);
          onExternalTabRequest?.(tabId);
        },
        closeTab: (tabId: string) => {
          handleTabClose(tabId);
        },
        setActiveTab: (tabId: string | null) => {
          setCurrentTabId(tabId);
          onTabChange?.(tabId);
          if (tabId) {
            onExternalTabRequest?.(tabId);
          }
        },
        getCurrentTab: () => displayCurrentTabId,
        getOpenTabs: () => displayTabs,
        createNewTab: () => {
          handleNewTab();
        },
      }),
      [
        tabs,
        internalTabs,
        currentTabId,
        onTabChange,
        onExternalTabRequest,
        handleTabClose,
        displayCurrentTabId,
        displayTabs,
        handleNewTab,
        isHomeTab,
      ]
    );

    return (
      <div
        className="browser-container"
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
        }}
      >
        <div className="tab-bar">
          {displayTabs.map(tab => (
            <div
              key={tab.id}
              className={`tab ${displayCurrentTabId === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              <div className="tab-content">
                {tab.icon && <div className="tab-icon">{tab.icon}</div>}
                <span className="tab-title">{tab.title}</span>
              </div>
              {isInteractive && tab.id !== '__home__' && (
                <button
                  className="tab-close"
                  onClick={() => handleTabClose(tab.id)}
                  title="Fechar aba"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {!hideNewTabButton && (
            <button className="new-tab-button" onClick={handleNewTab} title="Nova aba">
              +
            </button>
          )}
        </div>

        {/* Browser Actions */}
        <div className="browser-actions">
          <button className="home-button" onClick={handleGoHome} title="Ir para Home">
            <Home />
          </button>

          <div className="url-bar">
            <input
              type="text"
              value={currentUrl}
              readOnly
              placeholder="about:home"
              className="url-input"
            />
          </div>

          <button
            className={`refresh-button ${isLoading ? 'loading' : ''}`}
            onClick={handleRefresh}
            title="Atualizar"
          >
            <RotateCw className={isLoading ? 'loading-icon' : ''} />
          </button>
        </div>

        <div className="content-area">
          {displayCurrentTabId
            ? displayTabs.find(tab => tab.id === displayCurrentTabId)?.content
            : homeContent || (
                <div className="home-screen">
                  <div className="home-screen-icon">🌐</div>
                  <h2>Nova aba</h2>
                  <p>Selecione uma aba acima ou crie uma nova</p>
                  {tabs.length > 0 && (
                    <div className="tab-grid">
                      {tabs.map(tab => (
                        <button
                          key={tab.id}
                          className="tab-shortcut"
                          onClick={() => handleTabClick(tab.id)}
                        >
                          {tab.icon && <div className="tab-shortcut-icon">{tab.icon}</div>}
                          <span className="tab-shortcut-title">{tab.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
        </div>
      </div>
    );
  }
);

BrowserV2.displayName = 'BrowserV2';

export default BrowserV2;
