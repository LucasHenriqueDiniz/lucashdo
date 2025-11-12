'use client';

import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import styles from './pokemon-bottom-hud.module.css';

export type BottomHudAction = {
  key: string;
  label: string;
  disabled?: boolean;
  tone?: 'red' | 'blue' | 'gold' | 'green';
  onClick: () => void;
};

export type BottomHudMove = {
  key: string;
  label: string;
  disabled?: boolean;
  tone?: 'red' | 'blue' | 'gold' | 'green';
  onClick: () => void;
  onHover?: () => void;
};

export type BottomHudMoveDetails = {
  type?: string | null;
  category?: string | null;
  ppText?: string | null;
  description?: ReactNode;
};

export type PokemonBottomHudProps = {
  mode: 'main' | 'moves';
  prompt: string;
  subtitle?: string;
  actions?: BottomHudAction[];
  moves?: BottomHudMove[];
  moveDetails?: BottomHudMoveDetails;
  onBack?: () => void;
  className?: string;
  isEnemyTurn?: boolean;
};

const toneClass = (tone?: BottomHudAction['tone']) => {
  switch (tone) {
    case 'red':
      return styles.swatchRed;
    case 'blue':
      return styles.swatchBlue;
    case 'gold':
      return styles.swatchGold;
    case 'green':
    default:
      return styles.swatchGreen;
  }
};

export const PokemonBottomHud: FC<PokemonBottomHudProps> = ({
  mode,
  prompt,
  subtitle,
  actions = [],
  moves = [],
  moveDetails,
  onBack,
  className,
  isEnemyTurn = false,
}) => {
  const containerClass = clsx(className, styles.root, isEnemyTurn && styles.enemyMode);
  const contentClass = clsx(
    styles.content,
    mode === 'moves' ? styles.movesLayout : styles.mainLayout
  );
  const frameClass = clsx(
    styles.frame,
    mode === 'moves' ? styles.animateMoves : styles.animateMain
  );

  return (
    <div className={containerClass}>
      {mode === 'moves' && onBack && (
        <div className={styles.backBadge}>
          <button type="button" onClick={onBack}>
            ✕ Cancelar
          </button>
        </div>
      )}
      <div className={frameClass}>
        <div className={contentClass}>
          {mode === 'main' ? (
            <>
              <div className={clsx(styles.column, styles.promptBlock)}>
                <span>{prompt}</span>
                {subtitle && <span>{subtitle}</span>}
              </div>
              <div className={clsx(styles.column)}>
                <div className={styles.actionsGrid}>
                  {actions.map(action => (
                    <button
                      key={action.key}
                      type="button"
                      className={clsx(styles.actionButton, toneClass(action.tone))}
                      onClick={action.onClick}
                      disabled={action.disabled}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={clsx(styles.column)}>
                <div className={styles.moveOptions}>
                  {moves.map(move => (
                    <button
                      key={move.key}
                      type="button"
                      className={clsx(styles.moveButton, toneClass(move.tone))}
                      onClick={move.onClick}
                      onMouseEnter={move.onHover}
                      onFocus={move.onHover}
                      disabled={move.disabled}
                    >
                      {move.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={clsx(styles.column, styles.moveDetails)}>
                <div className={styles.moveMeta}>
                  <span>Tipo: {moveDetails?.type ?? '--'}</span>
                  <span>Categoria: {moveDetails?.category ?? '--'}</span>
                  <span>PP: {moveDetails?.ppText ?? '--/--'}</span>
                </div>
                <div className={styles.moveDescription}>
                  {moveDetails?.description ?? 'Selecione um movimento para ver os detalhes.'}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonBottomHud;
