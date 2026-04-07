import React from 'react';
import { HouseIcon } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { BrowserTab } from '../types/BrowserTab';
import './TabPreviewTooltip.css';

export interface TabPreviewTooltipProps {
  tab: BrowserTab;
  open: boolean;
  reference: HTMLElement | null;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const TabPreviewTooltip = React.memo<TabPreviewTooltipProps>(
  ({ tab, open, reference, placement = 'top' }) => {
    const t = useTranslations('Browser');
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    // Calcular posição baseada no elemento de referência
    React.useEffect(() => {
      // Limpar timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (open && reference) {
        // Delay para evitar tooltips piscando
        timeoutRef.current = setTimeout(() => {
          const rect = reference.getBoundingClientRect();
          const tooltipWidth = 280;
          const tooltipHeight = 200;
          const offset = 8;

          let x = 0;
          let y = 0;

          switch (placement) {
            case 'top':
              x = rect.left + rect.width / 2 - tooltipWidth / 2;
              y = rect.top - tooltipHeight - offset;
              break;
            case 'bottom':
              x = rect.left + rect.width / 2 - tooltipWidth / 2;
              y = rect.bottom + offset;
              break;
            case 'left':
              x = rect.left - tooltipWidth - offset;
              y = rect.top + rect.height / 2 - tooltipHeight / 2;
              break;
            case 'right':
              x = rect.right + offset;
              y = rect.top + rect.height / 2 - tooltipHeight / 2;
              break;
            default:
              x = rect.left + rect.width / 2 - tooltipWidth / 2;
              y = rect.top - tooltipHeight - offset;
          }

          // Garantir que a tooltip não saia da tela
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          if (x < 0) x = 8;
          if (x + tooltipWidth > viewportWidth) x = viewportWidth - tooltipWidth - 8;
          if (y < 0) y = 8;
          if (y + tooltipHeight > viewportHeight) y = viewportHeight - tooltipHeight - 8;

          setPosition({ x, y });
          setIsVisible(true);
        }, 300); // 300ms delay
      } else {
        setIsVisible(false);
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [open, reference, placement]);

    if (!open || !reference || !isVisible) return null;

    return (
      <div
        className="tab-preview-tooltip visible"
        style={{
          position: 'fixed',
          top: position.y,
          left: position.x,
          zIndex: 9999,
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
        }}
        role="tooltip"
      >
        <div className="tab-preview-content">
          <div className="tab-preview-header">
            <div className="tab-preview-title">{tab.title}</div>
            <div className="tab-preview-url">{tab.url}</div>
            {tab.hasUnsavedChanges && (
              <div className="tab-preview-unsaved">{t('unsavedChanges')}</div>
            )}
          </div>
          <div className="tab-preview-image">
            {tab.type === 'home' || tab.type === 'new' ? (
              <HouseIcon className="preview-img" size={48} color="var(--text-secondary)" />
            ) : (
              <>
                {typeof tab.icon === 'string' ? (
                  <Image
                    src={tab.icon}
                    alt={tab.title}
                    className="preview-img"
                    fill
                    sizes="(max-width: 100px) 100px, (max-width: 200px) 200px, 300px"
                  />
                ) : (
                  <div className="preview-icon">{tab.icon}</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison para evitar re-renders desnecessários
    return (
      prevProps.open === nextProps.open &&
      prevProps.tab.id === nextProps.tab.id &&
      prevProps.reference === nextProps.reference &&
      prevProps.placement === nextProps.placement
    );
  }
);

TabPreviewTooltip.displayName = 'TabPreviewTooltip';

export default TabPreviewTooltip;
