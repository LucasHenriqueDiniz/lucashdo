import { flip, offset, Placement, shift, useFloating } from '@floating-ui/react-dom-interactions';
import { HouseIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { BrowserTab } from '../types/BrowserTab';
import './TabPreviewTooltip.css';

export interface TabPreviewTooltipProps {
  tab: BrowserTab;
  open: boolean;
  reference: HTMLElement | null;
  placement?: Placement;
}

const TabPreviewTooltip = React.memo<TabPreviewTooltipProps>(
  ({ tab, open, reference, placement = 'top' }) => {
    const {
      x,
      y,
      reference: setReference,
      floating,
      strategy,
    } = useFloating({
      placement,
      middleware: [offset(8), flip(), shift()],
    });

    React.useEffect(() => {
      if (reference) setReference(reference);
    }, [reference, setReference]);

    if (!open || !reference) return null;

    return (
      <div
        ref={floating}
        className="tab-preview-tooltip visible"
        style={{
          position: strategy,
          top: y ?? 0,
          left: x ?? 0,
          zIndex: 9999,
        }}
        role="tooltip"
      >
        <div className="tab-preview-content">
          <div className="tab-preview-header">
            <div className="tab-preview-title">{tab.title}</div>
            <div className="tab-preview-url">{tab.url}</div>
            {tab.hasUnsavedChanges && (
              <div className="tab-preview-unsaved">Mudanças não salvas</div>
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
  }
);

TabPreviewTooltip.displayName = 'TabPreviewTooltip';

export default TabPreviewTooltip;
