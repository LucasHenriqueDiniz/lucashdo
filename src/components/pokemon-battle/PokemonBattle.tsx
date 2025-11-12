'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { Press_Start_2P } from 'next/font/google';
import { PokeLinkButton } from '../PokeButton';
import RouteHeader from './RouteHeader';
import BattleStage from './PokemonBattleStage';
import PokemonSelectionScreen from './PokemonSelectionScreen';
import type { BattleEndingKey, BattlePhase, PokemonDefinition, PokemonMove } from './types';

const pixelFont = Press_Start_2P({ subsets: ['latin'], weight: '400' });

export type BattleLog = { speaker: 'Narrador' | 'Você' | '404'; message: string };
export type PlayerStatusEffect = { type: 'confused' | 'lag'; turns: number };
export type EndingState = { title: string; description: string; emoji: string };
export type BattleState = {
  playerHp: number;
  errorHp: number;
  potions: number;
  turn: number;
  battleOver: boolean;
  ending?: EndingState;
  endingKey?: BattleEndingKey;
  playerStatus?: PlayerStatusEffect | null;
};

export type Pose = 'idle' | 'attack' | 'hit';
export type BattleMove = PokemonMove & { currentPp: number };

const MAX_HP = 100;
const ENEMY_MOVES: PokemonMove[] = [
  {
    name: 'Broken Link',
    type: 'Status',
    category: 'Status',
    maxPp: 20,
    power: 0,
    description: 'O alvo fica confuso e perde precisão por alguns turnos.',
  },
  {
    name: 'Null Shock',
    type: 'Electric',
    category: 'Special',
    maxPp: 15,
    power: 60,
    description: 'Pulso elétrico que revela erros não tratados.',
  },
  {
    name: 'Timeout Wave',
    type: 'Water',
    category: 'Special',
    maxPp: 10,
    power: 75,
    description: 'Ondas de espera atrasam a resposta do alvo.',
  },
  {
    name: 'Cache Overflow',
    type: 'Status',
    category: 'Status',
    maxPp: 12,
    power: 0,
    description: 'Fluxo de dados que drena PP e trava a próxima ação do alvo.',
  },
];

const endings: Record<BattleEndingKey, EndingState> = {
  victory: {
    title: '404 foi derrotado!',
    description: 'Seu DevMon resolveu o impasse. A rota segura para a homepage retorna ao mapa.',
    emoji: '🎉',
  },
  defeat: {
    title: 'Você desmaiou!',
    description: 'O 404 permaneceu firme. Reforce o time e tente novamente.',
    emoji: '💤',
  },
  runaway: {
    title: 'Retirada bem-sucedida!',
    description: 'Você recuou a tempo e evitou o erro. Volte pela homepage e trace outro caminho.',
    emoji: '🏃',
  },
};

const createInitialBattleState = (): BattleState => ({
  playerHp: MAX_HP,
  errorHp: MAX_HP,
  potions: 2,
  turn: 1,
  battleOver: false,
  ending: undefined,
  endingKey: undefined,
  playerStatus: null,
});

const gatewayTips = [
  'Um selvagem 404 apareceu no caminho.',
  'Seu DevMon grita “Vamos depurar isso!”.',
  'O campo escurece enquanto o erro carrega logs infinitos.',
];

const PokemonBattle: React.FC<{ starters: PokemonDefinition[] }> = ({ starters }) => {
  const [phase, setPhase] = useState<BattlePhase>('intro');
  const [selectedStarter, setSelectedStarter] = useState<PokemonDefinition | null>(null);
  const [logs, setLogs] = useState<BattleLog[]>([]);
  const [state, setState] = useState<BattleState>(createInitialBattleState);
  const [moves, setMoves] = useState<BattleMove[]>([]);
  const [showLog, setShowLog] = useState(false);

  const handleSelectAndConfirm = (starter: PokemonDefinition) => {
    setSelectedStarter(starter);
    setState(createInitialBattleState());
    setMoves(starter.moves.map(move => ({ ...move, currentPp: move.maxPp })));
    setLogs([
      { speaker: 'Narrador', message: gatewayTips[0] },
      { speaker: 'Narrador', message: `${starter.name} entrou na batalha.` },
    ]);
    setShowLog(false);
    setPhase('battle');
  };

  const handleIntroContinue = () => {
    setPhase('starter-select');
    setLogs([]);
    setMoves([]);
    setShowLog(false);
  };

  const handleReplay = () => {
    if (!selectedStarter) return;
    setState(createInitialBattleState());
    setMoves(selectedStarter.moves.map(move => ({ ...move, currentPp: move.maxPp })));
    setLogs([
      { speaker: 'Narrador', message: gatewayTips[1] },
      { speaker: 'Narrador', message: `${selectedStarter.name} retoma a posição.` },
    ]);
    setShowLog(false);
  };

  const handleChooseAnother = () => {
    setPhase('starter-select');
    setSelectedStarter(null);
    setState(createInitialBattleState());
    setLogs([]);
    setMoves([]);
    setShowLog(false);
  };

  const headerRightSlot = (() => {
    switch (phase) {
      case 'starter-select':
        return (
          <PokeLinkButton href="/" variant="blue" size="sm">
            Voltar
          </PokeLinkButton>
        );
      case 'battle':
        return (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowLog(true)}
              className="border-[3px] border-[#1e2a59] bg-[#0d1a3b]/85 px-3 py-2 text-[0.55rem] uppercase tracking-[0.35em] text-white/70 shadow-[0_6px_0_#050b1f] transition hover:-translate-y-[2px] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63b3ff]/60"
            >
              Ver log
            </button>
            <PokeLinkButton href="/" variant="dark" size="sm">
              Sair
            </PokeLinkButton>
          </div>
        );
      case 'intro':
      default:
        return undefined;
    }
  })();

  const screen = (() => {
    switch (phase) {
      case 'intro':
        return (
          <PokemonSelectionScreen
            mode="intro"
            starters={starters}
            onContinue={handleIntroContinue}
          />
        );
      case 'starter-select':
        return (
          <PokemonSelectionScreen
            mode="select"
            starters={starters}
            selected={selectedStarter?.id ?? null}
            onSelect={starter => setSelectedStarter(starter)}
            onConfirm={() => selectedStarter && handleSelectAndConfirm(selectedStarter)}
          />
        );
      case 'battle':
      default:
        return (
          <BattleStage
            fontClass={pixelFont.className}
            starter={selectedStarter!}
            state={state}
            moveSet={moves}
            enemyMoves={ENEMY_MOVES}
            logs={logs}
            endings={endings}
            onStateChange={setState}
            onMoveSetChange={setMoves}
            onLogAppend={(entry: BattleLog | BattleLog[]) =>
              setLogs(prev => [...prev, ...(Array.isArray(entry) ? entry : [entry])])
            }
            onReplay={handleReplay}
            onChooseAnother={handleChooseAnother}
            showLog={showLog}
            onCloseLog={() => setShowLog(false)}
          />
        );
    }
  })();

  return (
    <div className={clsx(pixelFont.className, 'relative min-h-screen w-screen overflow-hidden')}>
      <RouteHeader rightSlot={headerRightSlot} />
      {screen}
    </div>
  );
};

export default PokemonBattle;
