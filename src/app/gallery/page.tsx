import { Metadata } from 'next';
import Image from 'next/image';

import MainLayout from '@/components/layout/MainLayout';
import Browser from '@/components/home/Browser/Browser';
import MacBrowser from '@/components/home/Browser/MacBrowser';
import '@/components/home/Browser/Browser.css';

// export const metadata: Metadata = {
//   title: 'Gallery',
//   description: 'A showcase of visual works and photography.',
// };

// Dados simulados - Depois será substituído por dados reais de um CMS ou API
const images = [
  {
    id: 1,
    title: 'Urban Architecture',
    description: 'Modern cityscape and architectural details.',
    src: 'https://images.unsplash.com/photo-1470723710355-95304d8aece4?q=80&w=800',
    aspectRatio: 'aspect-[4/3]',
  },
  {
    id: 2,
    title: 'Nature Exploration',
    description: 'Beautiful landscapes and natural wonders.',
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800',
    aspectRatio: 'aspect-square',
  },
  {
    id: 3,
    title: 'Abstract Patterns',
    description: 'Finding patterns in everyday objects and scenes.',
    src: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?q=80&w=800',
    aspectRatio: 'aspect-[3/4]',
  },
  {
    id: 4,
    title: 'Minimalism',
    description: 'Simple compositions with strong visual impact.',
    src: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=800',
    aspectRatio: 'aspect-[4/3]',
  },
  {
    id: 5,
    title: 'Portraits',
    description: 'Capturing emotions and personality through portraiture.',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800',
    aspectRatio: 'aspect-square',
  },
  {
    id: 6,
    title: 'Street Photography',
    description: 'Candid moments from urban environments.',
    src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800',
    aspectRatio: 'aspect-[3/4]',
  },
  {
    id: 7,
    title: 'Experimental',
    description: 'Creative experiments with light and composition.',
    src: 'https://images.unsplash.com/photo-1488554378835-f7acf46e6c98?q=80&w=800',
    aspectRatio: 'aspect-[4/3]',
  },
  {
    id: 8,
    title: 'Product Design',
    description: 'Showcasing product design and photography work.',
    src: 'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?q=80&w=800',
    aspectRatio: 'aspect-square',
  },
];

export default function Gallery() {
  return (
    <MainLayout>
      <section className="flex flex-col items-center justify-center min-h-[100vh] text-center gap-12">
        <div className="w-full max-w-5xl">
          <h1 className="text-4xl font-bold mb-8">Exemplos de Browsers</h1>

          <div className="mb-16">
            <h2 className="text-2xl font-medium mb-4">Browser Padrão com Home Screen</h2>
            <Browser
              title="Meus Projetos"
              subtitle="Confira alguns dos meus trabalhos mais recentes"
              availableTabs={[
                {
                  id: 'tab1',
                  title: 'Portfolio',
                  url: 'https://lucashdo.com/portfolio',
                  content: (
                    <div className="p-8">
                      <h2 className="text-2xl font-bold">Meu Portfolio</h2>
                      <p className="mt-4">Projetos e trabalhos recentes</p>
                    </div>
                  ),
                },
                {
                  id: 'tab2',
                  title: 'Blog',
                  url: 'https://lucashdo.com/blog',
                  content: (
                    <div className="p-8">
                      <h2 className="text-2xl font-bold">Meu Blog</h2>
                      <p className="mt-4">Artigos e tutoriais</p>
                    </div>
                  ),
                },
                {
                  id: 'tab3',
                  title: 'Contato',
                  url: 'https://lucashdo.com/contato',
                  content: (
                    <div className="p-8">
                      <h2 className="text-2xl font-bold">Entre em Contato</h2>
                      <p className="mt-4">Informações para contato</p>
                    </div>
                  ),
                },
                {
                  id: 'tab4',
                  title: 'Sobre',
                  url: 'https://lucashdo.com/about',
                  content: (
                    <div className="p-8">
                      <h2 className="text-2xl font-bold">Sobre Mim</h2>
                      <p className="mt-4">Minha história e experiências</p>
                    </div>
                  ),
                },
              ]}
            />
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-medium mb-4">Browser Modo Decorativo</h2>
            <Browser
              isDecorative={true}
              tabs={[
                {
                  id: 'decorative',
                  title: 'Decorativo',
                  url: 'https://exemplo.com/decorativo',
                  content: (
                    <div className="p-8 text-center">
                      <h1 className="text-3xl font-bold mb-4">Modo Decorativo</h1>
                      <p className="text-lg text-muted-foreground">
                        Este browser está em modo decorativo, mas você ainda pode navegar entre as
                        abas!
                      </p>
                    </div>
                  ),
                },
                {
                  id: 'decorative2',
                  title: 'Aba 2',
                  url: 'https://exemplo.com/decorativo/2',
                  content: (
                    <div className="p-8 text-center">
                      <h1 className="text-3xl font-bold mb-4">Segunda Aba</h1>
                      <p className="text-lg text-muted-foreground">
                        Mesmo em modo decorativo, é possível navegar entre as abas.
                      </p>
                    </div>
                  ),
                },
                {
                  id: 'decorative3',
                  title: 'Aba 3',
                  url: 'https://exemplo.com/decorativo/3',
                  content: (
                    <div className="p-8 text-center">
                      <h1 className="text-3xl font-bold mb-4">Terceira Aba</h1>
                      <p className="text-lg text-muted-foreground">
                        A navegação entre abas funciona, mas os controles de janela estão
                        desativados.
                      </p>
                    </div>
                  ),
                },
              ]}
              activeTabId="decorative"
            />
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-medium mb-4">Browser com conteúdo personalizado</h2>
            <Browser
              tabs={[
                {
                  id: 'custom',
                  title: 'Conteúdo Custom',
                  url: 'https://exemplo.com/custom',
                  content: (
                    <div className="p-8 text-center">
                      <h1 className="text-3xl font-bold mb-4">Conteúdo Personalizado</h1>
                      <p className="mb-6">
                        Este é um exemplo de conteúdo personalizado dentro do Browser.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {images.slice(0, 3).map(image => (
                          <div key={image.id} className="bg-muted rounded-lg overflow-hidden">
                            <Image
                              src={image.src}
                              alt={image.title}
                              width={300}
                              height={200}
                              className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                              <h3 className="font-medium">{image.title}</h3>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                },
              ]}
              activeTabId="custom"
            />
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-medium mb-4">Browser com múltiplas abas</h2>
            <Browser
              tabs={[
                {
                  id: 'tab1',
                  title: 'Homepage',
                  url: 'https://exemplo.com',
                  content: (
                    <div className="p-8 text-center">
                      <h1 className="text-3xl font-bold mb-4">Exemplo de Múltiplas Abas</h1>
                      <p className="mb-6">Você pode navegar entre as abas neste browser!</p>
                      <div className="flex justify-center">
                        <div className="bg-muted rounded-lg p-6 max-w-lg">
                          <p>
                            Esta é a primeira aba. Clique nas outras abas para navegar entre elas.
                          </p>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'tab2',
                  title: 'Produtos',
                  url: 'https://exemplo.com/produtos',
                  content: (
                    <div className="p-8">
                      <h1 className="text-3xl font-bold mb-4 text-center">Produtos</h1>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {images.slice(0, 4).map(image => (
                          <div key={image.id} className="bg-muted rounded-lg overflow-hidden">
                            <Image
                              src={image.src}
                              alt={image.title}
                              width={300}
                              height={200}
                              className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                              <h3 className="font-medium">{image.title}</h3>
                              <p className="text-sm text-muted-foreground">{image.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'tab3',
                  title: 'Contato',
                  url: 'https://exemplo.com/contato',
                  content: (
                    <div className="p-8 text-center">
                      <h1 className="text-3xl font-bold mb-4">Entre em Contato</h1>
                      <p className="mb-6">Formulário de contato simulado</p>
                      <form className="max-w-md mx-auto">
                        <div className="mb-4">
                          <input type="text" placeholder="Nome" className="search-input" />
                        </div>
                        <div className="mb-4">
                          <input type="email" placeholder="Email" className="search-input" />
                        </div>
                        <div className="mb-4">
                          <textarea
                            placeholder="Mensagem"
                            className="search-input min-h-[120px]"
                          ></textarea>
                        </div>
                        <button className="px-5 py-2 bg-accent-orange text-white rounded-md">
                          Enviar Mensagem
                        </button>
                      </form>
                    </div>
                  ),
                },
              ]}
              activeTabId="tab1"
              onTabChange={tabId => console.log(`Tab changed to ${tabId}`)}
              onTabClose={tabId => console.log(`Tab closed: ${tabId}`)}
            />
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-medium mb-4">
              Browser com Home Screen e Abas Disponíveis
            </h2>
            <Browser
              title="Navegador do Portfolio"
              subtitle="Demonstração de home page com abas disponíveis"
              availableTabs={[
                {
                  id: 'tab4',
                  title: 'Projetos',
                  url: 'https://exemplo.com/projetos',
                  content: (
                    <div className="p-8">
                      <h1 className="text-3xl font-bold mb-4 text-center">Meus Projetos</h1>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {images.slice(0, 4).map(image => (
                          <div
                            key={image.id}
                            className="bg-muted rounded-lg overflow-hidden border border-border"
                          >
                            <Image
                              src={image.src}
                              alt={image.title}
                              width={300}
                              height={200}
                              className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                              <h3 className="font-medium">{image.title}</h3>
                              <p className="text-sm text-muted-foreground">{image.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'tab5',
                  title: 'Blog',
                  url: 'https://exemplo.com/blog',
                  content: (
                    <div className="p-8">
                      <h1 className="text-3xl font-bold mb-4 text-center">Meu Blog</h1>
                      <div className="max-w-3xl mx-auto">
                        <div className="mb-8 p-6 bg-bg-secondary rounded-lg border border-border">
                          <h2 className="text-xl font-semibold mb-3">
                            Como criar um portfolio efetivo
                          </h2>
                          <p className="text-text-secondary mb-4">
                            Neste artigo, vamos explorar as melhores práticas para criar um
                            portfolio que destaque suas habilidades e projetos de forma
                            profissional.
                          </p>
                          <div className="text-sm text-text-muted">Publicado em 16/06/2025</div>
                        </div>

                        <div className="mb-8 p-6 bg-bg-secondary rounded-lg border border-border">
                          <h2 className="text-xl font-semibold mb-3">
                            Tendências de design em 2025
                          </h2>
                          <p className="text-text-secondary mb-4">
                            Uma análise das tendências de UI/UX que estão dominando o mercado em
                            2025 e como aplicá-las em seus projetos.
                          </p>
                          <div className="text-sm text-text-muted">Publicado em 02/06/2025</div>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'tab6',
                  title: 'Contato',
                  url: 'https://exemplo.com/contato',
                  content: (
                    <div className="p-8">
                      <h1 className="text-3xl font-bold mb-4 text-center">Entre em Contato</h1>
                      <div className="max-w-md mx-auto p-6 bg-bg-secondary rounded-lg border border-border">
                        <form>
                          <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Nome</label>
                            <input
                              type="text"
                              className="search-input"
                              placeholder="Seu nome completo"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                              type="email"
                              className="search-input"
                              placeholder="seu@email.com"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Mensagem</label>
                            <textarea
                              className="search-input min-h-[120px]"
                              placeholder="Escreva sua mensagem aqui..."
                            ></textarea>
                          </div>
                          <button
                            type="button"
                            className="w-full py-3 bg-accent-orange text-white rounded-md hover:bg-accent-orange/90 transition"
                          >
                            Enviar Mensagem
                          </button>
                        </form>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-medium mb-4">MacBrowser (Legado - compatibilidade)</h2>
            <MacBrowser useProjectBrowser={true} />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
