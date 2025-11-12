'use client';

import clsx from 'clsx';
import Link, { type LinkProps } from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import styles from './poke-button.module.css';

type Variant = 'neutral' | 'red' | 'blue' | 'gold' | 'green' | 'dark';
type Size = 'md' | 'sm';

type PokeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

type PokeLinkButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  LinkProps & {
    variant?: Variant;
    size?: Size;
  };

const resolveVariantClass = (variant: Variant) => {
  switch (variant) {
    case 'red':
      return styles.variantRed;
    case 'blue':
      return styles.variantBlue;
    case 'gold':
      return styles.variantGold;
    case 'green':
      return styles.variantGreen;
    case 'dark':
      return styles.variantDark;
    case 'neutral':
    default:
      return styles.variantNeutral;
  }
};

const resolveSizeClass = (size: Size) => (size === 'sm' ? styles.small : undefined);

export function PokeButton({
  children,
  className,
  variant = 'neutral',
  size = 'md',
  ...props
}: PokeButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        styles.pokeBtn,
        resolveVariantClass(variant),
        resolveSizeClass(size),
        className
      )}
    >
      <span className={styles.pokeLabel}>{children}</span>
    </button>
  );
}

export function PokeLinkButton({
  children,
  className,
  variant = 'neutral',
  size = 'md',
  ...props
}: PokeLinkButtonProps) {
  return (
    <Link
      {...props}
      className={clsx(
        styles.pokeBtn,
        resolveVariantClass(variant),
        resolveSizeClass(size),
        className
      )}
    >
      <span className={styles.pokeLabel}>{children}</span>
    </Link>
  );
}
