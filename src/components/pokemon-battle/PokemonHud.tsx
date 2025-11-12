'use client';

import clsx from 'clsx';
import type { CSSProperties, FC } from 'react';
import styles from './pokemon-hud.module.css';

export type PokemonHudProps = {
  name: string;
  level: number;
  currentHp: number;
  maxHp?: number;
  isEnemy?: boolean;
  status?: string | null;
  showHpNumbers?: boolean;
  currentPp?: number | null;
  maxPp?: number | null;
  className?: string;
  style?: CSSProperties;
};

const STATUS_COLORS: Record<string, string> = {
  BRN: '#e46a45',
  PSN: '#9a61d8',
  TOX: '#9a61d8',
  PAR: '#e7c63d',
  FRZ: '#63b0ff',
  SLP: '#6a7d98',
  FNT: '#565f7c',
};

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

const hpFillColor = (percent: number): string => {
  if (percent > 50) return '#46c35b';
  if (percent > 20) return '#f5c13b';
  return '#f75f8d';
};

const PokemonHud: FC<PokemonHudProps> = ({
  name,
  level,
  currentHp,
  maxHp = 100,
  isEnemy = false,
  status,
  showHpNumbers = false,
  currentPp = null,
  maxPp = null,
  className,
  style,
}) => {
  const hpPercent = clampPercent((currentHp / Math.max(1, maxHp)) * 100);
  const statusLabel = status ? status.toUpperCase() : null;
  const statusColor = statusLabel ? (STATUS_COLORS[statusLabel] ?? '#3b82f6') : undefined;
  const showPp = !isEnemy && maxPp !== null && maxPp !== undefined && maxPp > 0;
  const ppPercent = showPp ? clampPercent(((currentPp ?? 0) / Math.max(1, maxPp ?? 1)) * 100) : 0;

  return (
    <div
      className={clsx(styles.panel, isEnemy ? styles.enemyTheme : styles.playerTheme, className)}
      style={style}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={clsx(styles.nameBlock, isEnemy && styles.alignEnd)}>
            <span className={styles.name}>{name}</span>
            {statusLabel && (
              <div className={styles.status} style={{ backgroundColor: statusColor }}>
                {statusLabel}
              </div>
            )}
          </div>
          <div className={styles.level}>
            <span>Lv</span>
            <span>{level}</span>
          </div>
        </div>

        <div>
          <div className={styles.sectionLabel}>
            <span>HP</span>
            <div className={styles.sectionDivider} />
          </div>
          <div className={styles.bar}>
            <div
              className={styles.barFill}
              style={{
                width: `${hpPercent}%`,
                backgroundColor: hpFillColor(hpPercent),
              }}
            />
          </div>
          {showHpNumbers && (
            <div className={styles.hpNumbers}>
              {`${Math.max(0, Math.round(currentHp))} / ${Math.round(maxHp)}`}
            </div>
          )}
        </div>

        {showPp && (
          <div className={styles.ppWrapper}>
            <div className={styles.sectionLabel}>
              <span>PP</span>
              <div className={styles.sectionDivider} />
            </div>
            <div className={styles.bar}>
              <div
                className={styles.barFill}
                style={{
                  width: `${ppPercent}%`,
                  background: 'linear-gradient(90deg,#6d95ff 0%,#9dbdff 100%)',
                }}
              />
            </div>
            <div className={styles.ppText}>
              {`${Math.max(0, currentPp ?? 0)} / ${Math.max(0, maxPp ?? 0)}`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonHud;
