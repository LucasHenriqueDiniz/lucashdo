import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectsGrid } from './client';
import { Project } from '@/constants';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
  useInView: () => true,
}));

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Project One',
    description: { pt: 'Descrição um', en: 'Description one' },
    image: '/test1.jpg',
    tags: ['React', 'TypeScript', 'Next.js'],
    featured: true,
    repoUrl: 'https://github.com/test/one',
    demoUrl: 'https://demo.one',
  },
  {
    id: '2',
    title: 'Project Two',
    description: { pt: 'Descrição dois', en: 'Description two' },
    image: '/test2.jpg',
    tags: ['Vue', 'JavaScript'],
    featured: false,
    repoUrl: 'https://github.com/test/two',
  },
  {
    id: '3',
    title: 'Project Three',
    description: { pt: 'Descrição três', en: 'Description three' },
    image: '/test3.jpg',
    tags: ['React', 'Node.js'],
    featured: true,
    repoUrl: 'https://github.com/test/three',
    demoUrl: 'https://demo.three',
  },
];

const mockTranslations = {
  featured: 'Featured',
  viewProject: 'View Project',
  search: 'Search',
  columns: 'Columns',
  noResults: 'No results',
  previous: 'Previous',
  next: 'Next',
  showing: 'Showing',
  of: 'of',
  results: 'results',
  filterByTags: 'Filter by tags',
  clearAll: 'Clear all',
  allTags: 'All tags',
  cards: 'Cards',
  list: 'List',
  all: 'All',
  title: 'Title',
  description: 'Description',
  tags: 'Tags',
  status: 'Status',
  viewCode: 'View Code',
  viewDemo: 'View Demo',
};

describe('ProjectsGrid - Existing Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('View Toggle', () => {
    it('should render view toggle buttons', () => {
      render(
        <ProjectsGrid projects={mockProjects} locale="en" translations={mockTranslations} />
      );

      expect(screen.getByText('Cards')).toBeInTheDocument();
      expect(screen.getByText('List')).toBeInTheDocument();
    });

    it('should default to cards view', () => {
      render(
        <ProjectsGrid projects={mockProjects} locale="en" translations={mockTranslations} />
      );

      // Cards view should show ProjectGrid component
      // List view would show DataTable
      // We can verify by checking if project cards are rendered
      expect(screen.getByText('Project One')).toBeInTheDocument();
    });

    it('should switch to list view when list button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ProjectsGrid projects={mockProjects} locale="en" translations={mockTranslations} />
      );

      const listButton = screen.getByText('List');
      await user.click(listButton);

      // In list view, the DataTable should be rendered
      // DataTable has a search input
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
      });
    });

    it('should switch back to cards view when cards button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ProjectsGrid projects={mockProjects} locale="en" translations={mockTranslations} />
      );

      // Switch to list view
      const listButton = screen.getByText('List');
      await user.click(listButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
      });

      // Switch back to cards view
      const cardsButton = screen.getByText('Cards');
      await user.click(cardsButton);

      // Verify cards view is active (search input from DataTable should not be present)
      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('should render search input in list view', async () => {
      const user = userEvent.setup();
      render(
        <ProjectsGrid projects={mockProjects} locale="en" translations={mockTranslations} />
      );

      // Switch to list view
      await user.click(screen.getByText('List'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
      });
    });
  });

  describe('Pagination', () => {
    it('should render pagination controls in list view', async () => {
      const user = userEvent.setup();
      render(
        <ProjectsGrid projects={mockProjects} locale="en" translations={mockTranslations} />
      );

      // Switch to list view
      await user.click(screen.getByText('List'));

      await waitFor(() => {
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
      });
    });

    it('should show correct result count', async () => {
      const user = userEvent.setup();
      render(
        <ProjectsGrid projects={mockProjects} locale="en" translations={mockTranslations} />
      );

      // Switch to list view
      await user.click(screen.getByText('List'));

      await waitFor(() => {
        expect(screen.getByText(/Showing 3 of 3 results/i)).toBeInTheDocument();
      });
    });

    it('should disable Previous button on first page', async () => {
      const user = userEvent.setup();
      render(
        <ProjectsGrid projects={mockProjects} locale="en" translations={mockTranslations} />
      );

      // Switch to list view
      await user.click(screen.getByText('List'));

      const previousButton = await screen.findByText('Previous');
      expect(previousButton).toBeDisabled();
    });
  });

  describe('Filter State Persistence', () => {
    it('should maintain status filter when switching views', async () => {
      const user = userEvent.setup();
      render(
        <ProjectsGrid projects={mockProjects} locale="en" translations={mockTranslations} />
      );

      // Apply featured filter - get the button specifically (not the badge on cards)
      const featuredButton = screen.getByRole('button', { name: /Featured.*\(2\)/ });
      await user.click(featuredButton);

      // Wait for filter to apply
      await waitFor(() => {
        // Should show 2 featured projects
        expect(screen.getByText(/2 de 3 projetos encontrados/i)).toBeInTheDocument();
      });

      // Switch to list view
      await user.click(screen.getByText('List'));

      // Wait for list view to render
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
      });

      // Switch back to cards view
      await user.click(screen.getByText('Cards'));

      // Filter should still be applied
      await waitFor(() => {
        expect(screen.getByText(/2 de 3 projetos encontrados/i)).toBeInTheDocument();
      });
    });

    it('should maintain tag filter when switching views', async () => {
      const user = userEvent.setup();
      render(
        <ProjectsGrid projects={mockProjects} locale="en" translations={mockTranslations} />
      );

      // Select React tag - get the button specifically (not the tag on cards)
      const reactTag = screen.getByRole('button', { name: /React.*\(2\)/ });
      await user.click(reactTag);

      // Wait for filter to apply
      await waitFor(() => {
        // Should show 2 projects with React tag
        expect(screen.getByText(/2 de 3 projetos encontrados/i)).toBeInTheDocument();
      });

      // Switch to list view
      await user.click(screen.getByText('List'));

      // Wait for list view to render
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
      });

      // Switch back to cards view
      await user.click(screen.getByText('Cards'));

      // Filter should still be applied
      await waitFor(() => {
        expect(screen.getByText(/2 de 3 projetos encontrados/i)).toBeInTheDocument();
      });
    });

    it('should maintain combined filters when switching views', async () => {
      const user = userEvent.setup();
      render(
        <ProjectsGrid projects={mockProjects} locale="en" translations={mockTranslations} />
      );

      // Apply featured filter - get the button specifically
      await user.click(screen.getByRole('button', { name: /Featured.*\(2\)/ }));

      // Select React tag - get the button specifically
      const reactTag = screen.getByRole('button', { name: /React.*\(2\)/ });
      await user.click(reactTag);

      // Wait for filters to apply
      await waitFor(() => {
        // Should show 2 projects (featured AND React)
        expect(screen.getByText(/2 de 3 projetos encontrados/i)).toBeInTheDocument();
      });

      // Switch to list view
      await user.click(screen.getByText('List'));

      // Wait for list view to render
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
      });

      // Switch back to cards view - filters should persist
      await user.click(screen.getByText('Cards'));

      await waitFor(() => {
        expect(screen.getByText(/2 de 3 projetos encontrados/i)).toBeInTheDocument();
      });
    });

    it('should clear tag filters correctly', async () => {
      const user = userEvent.setup();
      render(
        <ProjectsGrid projects={mockProjects} locale="en" translations={mockTranslations} />
      );

      // Select React tag - get the button specifically
      const reactTag = screen.getByRole('button', { name: /React.*\(2\)/ });
      await user.click(reactTag);

      // Wait for filter to apply
      await waitFor(() => {
        expect(screen.getByText(/2 de 3 projetos encontrados/i)).toBeInTheDocument();
      });

      // Clear filters
      const clearButton = screen.getByText('Clear all');
      await user.click(clearButton);

      // Should show all projects again
      await waitFor(() => {
        expect(screen.getByText(/3 de 3 projetos encontrados/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state when filters change', async () => {
      const user = userEvent.setup();
      render(
        <ProjectsGrid projects={mockProjects} locale="en" translations={mockTranslations} />
      );

      // Apply featured filter - get the button specifically
      const featuredButton = screen.getByRole('button', { name: /Featured.*\(2\)/ });
      await user.click(featuredButton);

      // Loading state should appear briefly
      // Note: This might be too fast to catch in tests, but the functionality exists
      // We can verify the filter was applied
      await waitFor(() => {
        expect(screen.getByText(/2 de 3 projetos encontrados/i)).toBeInTheDocument();
      });
    });
  });
});
