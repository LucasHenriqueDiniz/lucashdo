import { useState, useCallback, useMemo } from 'react';
import { BrowserTab } from '../types/BrowserTab';

export interface TabState {
  tabs: BrowserTab[];
  activeTabIndex: number | null; // Usar índice em vez de ID
  isHomeScreen: boolean;
}

export interface UseBrowserTabsReturn {
  tabs: BrowserTab[];
  activeTabIndex: number | null;
  isHomeScreen: boolean;
  activeTab: BrowserTab | null;
  setTabs: (tabs: BrowserTab[]) => void;
  addTab: (tab: BrowserTab) => void;
  removeTab: (index: number) => void;
  setActiveTab: (index: number) => void;
  setHomeScreen: (show: boolean) => void;
  createHomeTab: () => BrowserTab;
  createNewTab: () => BrowserTab;
  transformTab: (index: number, newTab: BrowserTab) => void;
}

export function useBrowserTabs(
  initialTabs: BrowserTab[] = [],
  initialActiveTabId?: string,
  startWithHomeScreen: boolean = false
): UseBrowserTabsReturn {
  const [state, setState] = useState<TabState>(() => {
    // Determinar o índice inicial da aba ativa
    let initialActiveIndex: number | null = null;

    if (initialActiveTabId) {
      const activeTabIndex = initialTabs.findIndex(tab => tab.id === initialActiveTabId);
      initialActiveIndex = activeTabIndex >= 0 ? activeTabIndex : null;
    } else if (initialTabs.length > 0) {
      // Se não especificado, selecionar a primeira aba
      initialActiveIndex = 0;
    }

    return {
      tabs: initialTabs,
      activeTabIndex: initialActiveIndex,
      isHomeScreen: startWithHomeScreen && initialTabs.length === 0,
    };
  });

  const activeTab = useMemo(() => {
    if (
      state.activeTabIndex !== null &&
      state.activeTabIndex >= 0 &&
      state.activeTabIndex < state.tabs.length
    ) {
      return state.tabs[state.activeTabIndex];
    }
    return null;
  }, [state.tabs, state.activeTabIndex]);

  const setTabs = useCallback((tabs: BrowserTab[]) => {
    setState(prev => {
      // Ajustar o índice ativo se necessário
      let newActiveIndex = prev.activeTabIndex;
      if (newActiveIndex !== null && newActiveIndex >= tabs.length) {
        newActiveIndex = tabs.length > 0 ? 0 : null;
      }

      return {
        ...prev,
        tabs,
        activeTabIndex: newActiveIndex,
        isHomeScreen: tabs.length === 0,
      };
    });
  }, []);

  const addTab = useCallback((tab: BrowserTab) => {
    setState(prev => ({
      ...prev,
      tabs: [...prev.tabs, tab],
      activeTabIndex: prev.tabs.length, // Ativar a nova aba
      isHomeScreen: false,
    }));
  }, []);

  const removeTab = useCallback((index: number) => {
    setState(prev => {
      const newTabs = prev.tabs.filter((_, i) => i !== index);
      let newActiveIndex = prev.activeTabIndex;

      // Ajustar o índice ativo após remoção
      if (prev.activeTabIndex !== null && index === prev.activeTabIndex) {
        // Se a aba ativa foi removida, ativar a próxima ou anterior
        if (newTabs.length === 0) {
          newActiveIndex = null;
        } else if (index >= newTabs.length) {
          newActiveIndex = newTabs.length - 1;
        } else {
          newActiveIndex = index; // Manter o mesmo índice
        }
      } else if (prev.activeTabIndex !== null && index < prev.activeTabIndex) {
        // Se uma aba anterior foi removida, ajustar o índice
        newActiveIndex = prev.activeTabIndex - 1;
      }

      return {
        ...prev,
        tabs: newTabs,
        activeTabIndex: newActiveIndex,
        isHomeScreen: newTabs.length === 0,
      };
    });
  }, []);

  const setActiveTab = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      activeTabIndex: index >= 0 && index < prev.tabs.length ? index : null,
      isHomeScreen: false,
    }));
  }, []);

  const setHomeScreen = useCallback((show: boolean) => {
    setState(prev => ({
      ...prev,
      isHomeScreen: show,
    }));
  }, []);

  const createHomeTab = useCallback((): BrowserTab => {
    return {
      id: `home-${Date.now()}`,
      title: 'Home',
      url: 'about:home',
      content: null,
      type: 'home',
      createdAt: Date.now(),
    };
  }, []);

  const createNewTab = useCallback((): BrowserTab => {
    return {
      id: `new-${Date.now()}`,
      title: 'Nova Aba',
      url: 'new://',
      content: null,
      type: 'new',
      createdAt: Date.now(),
    };
  }, []);

  const transformTab = useCallback((index: number, newTab: BrowserTab) => {
    setState(prev => {
      if (index < 0 || index >= prev.tabs.length) return prev;

      const newTabs = [...prev.tabs];
      newTabs[index] = {
        ...newTab,
        id: prev.tabs[index].id, // Manter o ID original
      };

      return {
        ...prev,
        tabs: newTabs,
        isHomeScreen: false,
      };
    });
  }, []);

  return {
    tabs: state.tabs,
    activeTabIndex: state.activeTabIndex,
    isHomeScreen: state.isHomeScreen,
    activeTab,
    setTabs,
    addTab,
    removeTab,
    setActiveTab,
    setHomeScreen,
    createHomeTab,
    createNewTab,
    transformTab,
  };
}
