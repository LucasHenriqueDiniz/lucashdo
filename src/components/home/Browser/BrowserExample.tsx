import React, { useRef } from 'react';
import BrowserV2, { BrowserHandle, BrowserTab } from './BrowserV2';

// Exemplo de uso do BrowserV2 refatorado
const BrowserExample: React.FC = () => {
  const browserRef = useRef<BrowserHandle>(null);

  // Exemplo de tabs disponíveis
  const exampleTabs: BrowserTab[] = [
    {
      id: 'project1',
      title: 'Projeto Alpha',
      url: 'https://alpha.example.com',
      content: (
        <div style={{ padding: '20px' }}>
          <h1>Projeto Alpha</h1>
          <p>Este é o conteúdo do Projeto Alpha.</p>
          <p>Uma aplicação web moderna construída com React e TypeScript.</p>
        </div>
      ),
      icon: <span>🚀</span>,
    },
    {
      id: 'project2',
      title: 'Projeto Beta',
      url: 'https://beta.example.com',
      content: (
        <div style={{ padding: '20px' }}>
          <h1>Projeto Beta</h1>
          <p>Este é o conteúdo do Projeto Beta.</p>
          <p>Uma API REST construída com Node.js e Express.</p>
        </div>
      ),
      icon: <span>⚡</span>,
    },
    {
      id: 'project3',
      title: 'Projeto Gamma',
      url: 'https://gamma.example.com',
      content: (
        <div style={{ padding: '20px' }}>
          <h1>Projeto Gamma</h1>
          <p>Este é o conteúdo do Projeto Gamma.</p>
          <p>Uma aplicação mobile desenvolvida com React Native.</p>
        </div>
      ),
      icon: <span>📱</span>,
    },
  ];

  // Funções para controle programático do browser
  const handleOpenProject1 = () => {
    browserRef.current?.openTab('project1');
  };

  const handleOpenProject2 = () => {
    browserRef.current?.openTab('project2');
  };

  const handleCreateNewTab = () => {
    browserRef.current?.createNewTab();
  };

  const handleGetCurrentTab = () => {
    const currentTab = browserRef.current?.getCurrentTab();
    alert(`Aba atual: ${currentTab || 'Nenhuma'}`);
  };

  const handleGetOpenTabs = () => {
    const openTabs = browserRef.current?.getOpenTabs() || [];
    alert(`Abas abertas: ${openTabs.map(tab => tab.title).join(', ')}`);
  };

  // Callbacks do browser
  const handleTabChange = (tabId: string | null) => {
    console.log('Tab changed to:', tabId);
  };

  const handleTabClose = (tabId: string) => {
    console.log('Tab closed:', tabId);
  };

  const handleExternalTabRequest = (tabId: string) => {
    console.log('External tab request:', tabId);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Exemplo do BrowserV2 Refatorado</h1>

      {/* Controles externos */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={handleOpenProject1}>Abrir Projeto Alpha</button>
        <button onClick={handleOpenProject2}>Abrir Projeto Beta</button>
        <button onClick={handleCreateNewTab}>Nova Aba (Home)</button>
        <button onClick={handleGetCurrentTab}>Ver Aba Atual</button>
        <button onClick={handleGetOpenTabs}>Ver Abas Abertas</button>
      </div>

      {/* Browser Component */}
      <BrowserV2
        ref={browserRef}
        tabs={exampleTabs}
        width={800}
        height={600}
        onTabChange={handleTabChange}
        onTabClose={handleTabClose}
        onExternalTabRequest={handleExternalTabRequest}
        homeContent={
          <div
            className="custom-home"
            style={{
              padding: '40px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '8px',
              margin: '20px',
            }}
          >
            <h2>🌟 Portfólio de Projetos</h2>
            <p>Bem-vindo ao meu portfólio! Explore os projetos abaixo.</p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginTop: '30px',
              }}
            >
              {exampleTabs.map(tab => (
                <div
                  key={tab.id}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    padding: '20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onClick={() => browserRef.current?.openTab(tab.id)}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div style={{ fontSize: '2em', marginBottom: '10px' }}>{tab.icon}</div>
                  <h3>{tab.title}</h3>
                  <p style={{ fontSize: '0.9em', opacity: 0.8 }}>{tab.url}</p>
                </div>
              ))}
            </div>
          </div>
        }
      />

      {/* Informações sobre as melhorias */}
      <div
        style={{ marginTop: '20px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}
      >
        <h3>✨ Melhorias Implementadas:</h3>
        <ul>
          <li>
            <strong>Controle Programático:</strong> Use os botões acima para controlar o browser
            externamente
          </li>
          <li>
            <strong>Nova Lógica de Abas:</strong> Evita duplicatas e permite substituição
            inteligente
          </li>
          <li>
            <strong>Home Tab Inteligente:</strong> Mostra automaticamente quando não há abas abertas
          </li>
          <li>
            <strong>Tema Escuro:</strong> Interface moderna com tema escuro
          </li>
          <li>
            <strong>Callbacks Externos:</strong> Receba notificações de mudanças de aba
          </li>
          <li>
            <strong>API Expandida:</strong> Métodos para abrir, fechar, criar abas e obter estado
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BrowserExample;
