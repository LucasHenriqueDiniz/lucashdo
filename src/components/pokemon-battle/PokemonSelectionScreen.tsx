'use client';

import Image from 'next/image';
import clsx from 'clsx';
import { PokeButton, PokeLinkButton } from '../PokeButton';
import type { PokemonDefinition } from './types';

type SelectionMode = 'intro' | 'select';

type PokemonSelectionScreenProps = {
  mode: SelectionMode;
  starters: PokemonDefinition[];
  selected?: string | null;
  onContinue?: () => void;
  onSelect?: (starter: PokemonDefinition) => void;
  onConfirm?: (starter: PokemonDefinition | null) => void;
};

const selectionBackgroundImage = '/pokemon/background.jpg';

const PokemonSelectionScreen: React.FC<PokemonSelectionScreenProps> = ({
  mode,
  starters,
  selected = null,
  onContinue,
  onSelect,
  onConfirm,
}) => {
  const isIntro = mode === 'intro';
  const title = isIntro ? 'A Wild 404 Appeared!' : 'Selecione seu DevMon inicial';

  return (
    <div className="relative flex min-h-screen w-screen flex-col items-center">
      <Image
        src={selectionBackgroundImage}
        alt="Cenário pixelado"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[#0b1430]/78" />

      <div className="relative z-10 mt-[140px] flex w-full flex-1 justify-center px-6 pb-32">
        <div className="w-full max-w-5xl text-white">
          {isIntro ? (
            <div className="flex h-full items-center justify-center">
              <div className="w-full max-w-xl border-[4px] border-[#0b1330] bg-[#0f1c3d]/92 px-8 py-10 text-center shadow-[0_20px_0_#050b1f]">
                <p className="text-sm uppercase tracking-[0.45em] text-blue-200">Route Missing</p>
                <h1 className="mt-5 text-4xl uppercase tracking-[0.35em] text-white">{title}</h1>
                <p className="mt-4 text-[0.75rem] uppercase tracking-[0.3em] text-white/75">
                  O erro selvagem encara você. Vai enfrentar ou voltar para a segurança da homepage?
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <PokeButton onClick={onContinue} variant="red" className="flex-1">
                    Fight it
                  </PokeButton>
                  <PokeLinkButton href="/" variant="blue" className="flex-1">
                    Go back home
                  </PokeLinkButton>
                </div>
              </div>
            </div>
          ) : (
            <>
              <header className="text-center space-y-6">
                <p className="text-xs uppercase tracking-[0.35em] text-blue-200">Route Missing</p>
                <h2 className="text-3xl md:text-4xl uppercase tracking-[0.35em]">{title}</h2>
                <p className="text-[0.7rem] uppercase tracking-[0.28em] text-white/70">
                  O 404 aguarda. Selecione um companheiro para a batalha.
                </p>
              </header>

              <section className="mt-10 grid gap-6 md:grid-cols-3">
                {starters.map(starter => {
                  const isActive = selected === starter.id;
                  return (
                    <button
                      key={starter.id}
                      type="button"
                      onClick={() => onSelect?.(starter)}
                      className={clsx(
                        'group relative flex h-full min-h-[420px] flex-col border-[4px] border-[#0b1330] bg-[#0f1835]/92 px-5 pt-6 pb-7 text-left shadow-[0_14px_0_#050b1f] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4ea8ff]/40',
                        isActive
                          ? 'border-[#4ea8ff] shadow-[0_18px_0_#07122f]'
                          : 'hover:-translate-y-[6px] hover:border-[#4ea8ff]/70 hover:bg-[#152553]/90 hover:shadow-[0_18px_0_#07122f]'
                      )}
                    >
                      <div className="absolute inset-x-5 top-5 h-[6px] bg-white/10" />
                      <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
                        <Image
                          src={isActive ? starter.sprites.hover : starter.sprites.front}
                          alt={starter.name}
                          fill
                          className="object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.45)]"
                          priority
                          style={{ imageRendering: 'pixelated' }}
                        />
                      </div>
                      <div className="mt-6 space-y-3">
                        <div className="space-y-1">
                          <p className="text-sm uppercase tracking-[0.35em] text-white/60">
                            {starter.typing}
                          </p>
                          <p className="text-xl uppercase tracking-[0.28em]">{starter.name}</p>
                        </div>
                        <div
                          className={clsx(
                            'inline-flex items-center gap-2 border-[3px] px-3 py-1 text-[10px] uppercase tracking-[0.35em] transition',
                            starter.color === 'emerald'
                              ? 'border-emerald-300 text-emerald-200'
                              : starter.color === 'rose'
                                ? 'border-rose-300 text-rose-200'
                                : 'border-sky-300 text-sky-200',
                            !isActive && 'group-hover:border-white/80 group-hover:text-white'
                          )}
                        >
                          <span>{starter.codename}</span>
                        </div>
                        <p className="text-[11px] uppercase leading-relaxed tracking-[0.2em] text-white/70">
                          {starter.description}
                        </p>
                        <div className="mt-4 border-[3px] border-white/10 bg-white/5 p-3 text-[10px] uppercase tracking-[0.28em] text-white/70">
                          <div className="grid grid-cols-2 gap-y-1">
                            <span>
                              HP <strong className="text-white">{starter.stats.hp}</strong>
                            </span>
                            <span>
                              ATK <strong className="text-white">{starter.stats.attack}</strong>
                            </span>
                            <span>
                              DEF <strong className="text-white">{starter.stats.defense}</strong>
                            </span>
                            <span>
                              SPD <strong className="text-white">{starter.stats.speed}</strong>
                            </span>
                            <span>
                              SP.A{' '}
                              <strong className="text-white">{starter.stats.specialAttack}</strong>
                            </span>
                            <span>
                              SP.D{' '}
                              <strong className="text-white">{starter.stats.specialDefense}</strong>
                            </span>
                          </div>
                        </div>
                      </div>
                      {isActive && (
                        <span className="absolute -top-5 right-5 border-[3px] border-[#4ea8ff] bg-[#11224d] px-4 py-2 text-[10px] uppercase tracking-[0.45em] text-[#bfe3ff] shadow-[0_6px_0_#050b1f]">
                          Escolhido
                        </span>
                      )}
                    </button>
                  );
                })}
              </section>
            </>
          )}
        </div>
      </div>

      {!isIntro && (
        <div className="pointer-events-none fixed inset-x-0 bottom-8 z-30 flex justify-center px-6">
          <div className="pointer-events-auto flex items-center gap-4 border-[4px] border-[#0b1330] bg-[#0f1835]/92 px-6 py-4 shadow-[0_12px_0_#050b1f]">
            <PokeButton
              onClick={() =>
                onConfirm?.(
                  selected ? (starters.find(starter => starter.id === selected) ?? null) : null
                )
              }
              disabled={!selected}
              variant="red"
            >
              Iniciar batalha
            </PokeButton>
            <PokeLinkButton href="/" variant="blue">
              Cancelar
            </PokeLinkButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonSelectionScreen;
