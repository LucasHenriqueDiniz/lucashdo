'use client';

import { useEffect } from 'react';
import PokemonBattle from '@/components/pokemon-battle/PokemonBattle';
import { STARTER_POKEMON } from '@/components/pokemon-battle/pokemon-data';
import { useAppShell } from '@/components/layout/AppShell';

export default function NotFound() {
  const { hide, show } = useAppShell();

  useEffect(() => {
    hide();
    return () => {
      show();
    };
  }, [hide, show]);

  return (
    <>
      <PokemonBattle starters={STARTER_POKEMON} />
      <style jsx global>{`
        body {
          overflow: hidden;
          background-color: #040a1f;
        }
      `}</style>
    </>
  );
}
