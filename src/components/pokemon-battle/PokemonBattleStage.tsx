'use client';

import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { PokeButton, PokeLinkButton } from '../PokeButton';
import type { PokemonDefinition, PokemonMove, BattleEndingKey } from './types';
import type { BattleMove, BattleState, BattleLog, EndingState, Pose } from './PokemonBattle';
import styles from './pokemon-globals.module.css';
import PokemonHud from './PokemonHud';
import PokemonBottomHud from './PokemonBottomHud';

const battleBackgroundImage = '/pokemon/background.jpg';
const PLAYER_LEVEL = 26;
const ENEMY_LEVEL = 42;
const CONFUSION_SELF_HIT_RANGE = [6, 14];

const mainActions = [
  { key: 'fight', label: 'FIGHT', tone: 'red' as const },
  { key: 'bag', label: 'ITEMS', tone: 'gold' as const },
  { key: 'rest', label: 'REST', tone: 'blue' as const },
  { key: 'run', label: 'ESCAPE', tone: 'green' as const },
] as const;

const moveButtonTones = ['red', 'blue', 'gold', 'green'] as const;
const BLOCK_ROWS = 6;
const BLOCK_COLS = 10;

const MAX_HP = 100;

const PLAYER_HIT_SPARKS = [
  { x: '-18px', y: '-30px' },
  { x: '28px', y: '-16px' },
  { x: '-26px', y: '18px' },
] as const;

const ENEMY_HIT_SPARKS = [
  { x: '16px', y: '-26px' },
  { x: '-22px', y: '-10px' },
  { x: '20px', y: '20px' },
] as const;

type BattleStageProps = {
  fontClass: string;
  starter: PokemonDefinition;
  state: BattleState;
  moveSet: BattleMove[];
  enemyMoves: PokemonMove[];
  logs: BattleLog[];
  endings: Record<string, EndingState>;
  onStateChange: (state: BattleState | ((prev: BattleState) => BattleState)) => void;
  onMoveSetChange: (moves: BattleMove[]) => void;
  onLogAppend: (entry: BattleLog | BattleLog[]) => void;
  onReplay: () => void;
  onChooseAnother: () => void;
  showLog: boolean;
  onCloseLog: () => void;
};

const BattleStage: React.FC<BattleStageProps> = ({
  fontClass,
  starter,
  state,
  moveSet,
  enemyMoves,
  logs,
  endings,
  onStateChange,
  onMoveSetChange,
  onLogAppend,
  onReplay,
  onChooseAnother,
  showLog,
  onCloseLog,
}) => {
  const [menuState, setMenuState] = useState<'main' | 'moves' | 'enemy'>('main');
  const [playerPose, setPlayerPose] = useState<Pose>('idle');
  const [enemyPose, setEnemyPose] = useState<Pose>('idle');
  const [highlightedMoveIndex, setHighlightedMoveIndex] = useState<number | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [showPreload, setShowPreload] = useState(false);
  const [preloadIsFading, setPreloadIsFading] = useState(false);
  const [showIntroBanner, setShowIntroBanner] = useState(false);
  const [playerEntered, setPlayerEntered] = useState(false);
  const timeouts = useRef<number[]>([]);
  const transitionBlocks = useMemo(
    () => Array.from({ length: BLOCK_ROWS * BLOCK_COLS }, (_, index) => index),
    []
  );

  useEffect(() => {
    return () => {
      timeouts.current.forEach(id => window.clearTimeout(id));
      timeouts.current = [];
    };
  }, []);

  const queueTimeout = (callback: () => void, delay: number) => {
    const id = window.setTimeout(() => {
      callback();
      timeouts.current = timeouts.current.filter(stored => stored !== id);
    }, delay);
    timeouts.current.push(id);
  };

  const clearQueuedTimeouts = () => {
    timeouts.current.forEach(id => window.clearTimeout(id));
    timeouts.current = [];
  };

  useEffect(() => {
    if (state.turn === 1 && !state.battleOver) {
      setShowPreload(true);
      setPreloadIsFading(false);
      setShowTransition(false);
      setShowIntroBanner(false);
      setPlayerEntered(false);

      queueTimeout(() => {
        setPreloadIsFading(true);
        setShowTransition(true);
      }, 600);

      queueTimeout(() => setPlayerEntered(true), 1200);
      queueTimeout(() => setShowIntroBanner(true), 1450);
      queueTimeout(() => setShowPreload(false), 1800);
      queueTimeout(() => setShowTransition(false), 2100);
      queueTimeout(() => setShowIntroBanner(false), 3000);
    } else {
      setShowPreload(false);
      setPreloadIsFading(false);
      setShowTransition(false);
      setShowIntroBanner(false);
      setPlayerEntered(true);
    }
  }, [state.turn, state.battleOver]);

  useEffect(() => {
    if (!showLog) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseLog();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLog, onCloseLog]);

  const setPlayerPoseWithReset = (pose: Pose, duration = 280) => {
    setPlayerPose(pose);
    queueTimeout(() => setPlayerPose('idle'), duration);
  };

  const setEnemyPoseWithReset = (pose: Pose, duration = 280) => {
    setEnemyPose(pose);
    queueTimeout(() => setEnemyPose('idle'), duration);
  };

  const appendLog = (entry: BattleLog | BattleLog[]) => {
    onLogAppend(entry);
  };

  const endBattle = (endingKey: BattleEndingKey) => {
    clearQueuedTimeouts();
    onStateChange(prev => ({
      ...prev,
      battleOver: true,
      ending: endings[endingKey],
      endingKey,
    }));
  };

  const isBattleActive = !state.battleOver;
  const isMoveMenu = menuState === 'moves';
  const currentMove = moveSet[highlightedMoveIndex ?? 0] ?? moveSet[0] ?? null;
  const playerIsActive = isBattleActive && menuState !== 'enemy';
  const enemyIsActive = isBattleActive && menuState === 'enemy';

  useEffect(() => {
    if (!state.battleOver) {
      setMenuState('main');
      setHighlightedMoveIndex(null);
    }
  }, [state.battleOver]);

  const chooseEnemyMove = () => {
    const statusActive = Boolean(state.playerStatus && state.playerStatus.turns > 0);
    const damaging = enemyMoves.filter(move => move.power > 0);
    let pool = enemyMoves;
    if (statusActive && damaging.length > 0) {
      pool = damaging;
    }
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  };

  const executeEnemyTurn = (turnIncrement = 1) => {
    const enemyMove = chooseEnemyMove();
    const isEnemyStatus = enemyMove.power === 0;
    const enemyDamage = isEnemyStatus
      ? 0
      : Math.max(6, Math.floor(enemyMove.power * 0.45 + Math.random() * 8));
    const nextPlayerHp = Math.max(0, Math.min(MAX_HP, state.playerHp - enemyDamage));

    queueTimeout(() => setEnemyPoseWithReset('attack'), 320);
    queueTimeout(() => setPlayerPoseWithReset('hit'), 460);

    queueTimeout(() => {
      appendLog({
        speaker: '404',
        message: isEnemyStatus
          ? `404 usou ${enemyMove.name}. ${enemyMove.description}`
          : `404 usou ${enemyMove.name}. ${enemyDamage} de dano.`,
      });

      if (isEnemyStatus) {
        let drainPP = false;
        if (enemyMove.name === 'Broken Link') {
          onStateChange(prev => ({
            ...prev,
            playerStatus: { type: 'confused', turns: 2 },
            turn: prev.turn + turnIncrement,
          }));
        } else {
          // Cache Overflow effect
          drainPP = true;
          onStateChange(prev => ({
            ...prev,
            playerStatus: { type: 'lag', turns: 1 },
            turn: prev.turn + turnIncrement,
          }));
        }

        if (drainPP) {
          onMoveSetChange(
            moveSet.map(move => ({
              ...move,
              currentPp: Math.max(0, move.currentPp - 1),
            }))
          );
          appendLog({
            speaker: 'Narrador',
            message: 'O PP dos seus golpes foi drenado pelo overflow de cache.',
          });
        }

        setMenuState('main');
        return;
      }

      onStateChange(prev => ({
        ...prev,
        playerHp: nextPlayerHp,
        turn: prev.turn + turnIncrement,
      }));

      if (nextPlayerHp <= 0) {
        appendLog({
          speaker: 'Narrador',
          message: `${starter.name} não conseguiu continuar.`,
        });
        endBattle('defeat');
      } else {
        setMenuState('main');
      }
    }, 620);
  };

  const handleStatusBeforePlayerMove = () => {
    const status = state.playerStatus;
    if (!status) return true;

    if (status.type === 'lag') {
      appendLog({
        speaker: 'Narrador',
        message: `${starter.name} ficou travado e perdeu a ação somando o atraso.`,
      });
      onStateChange(prev => ({
        ...prev,
        playerStatus: null,
        turn: prev.turn + 1,
      }));
      setMenuState('enemy');
      queueTimeout(() => executeEnemyTurn(1), 360);
      return false;
    }

    if (status.type === 'confused') {
      const remaining = Math.max(0, status.turns - 1);
      const willHurtSelf = Math.random() < 0.35;
      if (willHurtSelf) {
        const selfDamage =
          Math.floor(
            Math.random() * (CONFUSION_SELF_HIT_RANGE[1] - CONFUSION_SELF_HIT_RANGE[0] + 1)
          ) + CONFUSION_SELF_HIT_RANGE[0];
        setPlayerPoseWithReset('hit');
        appendLog({
          speaker: 'Narrador',
          message: `${starter.name} está confuso e se atingiu! (-${selfDamage} HP)`,
        });
        let defeated = false;
        onStateChange(prev => {
          const nextHp = Math.max(0, prev.playerHp - selfDamage);
          defeated = nextHp <= 0;
          return {
            ...prev,
            playerHp: nextHp,
            playerStatus: remaining > 0 ? { type: 'confused', turns: remaining } : null,
            turn: prev.turn + 1,
          };
        });
        if (defeated) {
          queueTimeout(() => endBattle('defeat'), 400);
          return false;
        }
        setMenuState('enemy');
        queueTimeout(() => executeEnemyTurn(1), 480);
        return false;
      }

      appendLog({
        speaker: 'Narrador',
        message: `${starter.name} persiste apesar da confusão!`,
      });
      onStateChange(prev => ({
        ...prev,
        playerStatus: remaining > 0 ? { type: 'confused', turns: remaining } : null,
      }));
    }

    return true;
  };

  const executeMove = (moveIndex: number) => {
    if (!isBattleActive) return;
    if (!handleStatusBeforePlayerMove()) return;
    const move = moveSet[moveIndex];
    if (!move || move.currentPp <= 0) {
      appendLog({ speaker: 'Narrador', message: 'PP insuficiente para este movimento.' });
      return;
    }

    setMenuState('enemy');
    setHighlightedMoveIndex(moveIndex);
    onMoveSetChange(
      moveSet.map((item, idx) =>
        idx === moveIndex ? { ...item, currentPp: Math.max(0, item.currentPp - 1) } : item
      )
    );

    const isStatusMove = move.power === 0;
    const playerDamage = isStatusMove
      ? 0
      : Math.max(8, Math.floor(move.power * 0.45 + Math.random() * 10));
    const nextErrorHp = Math.max(0, Math.min(MAX_HP, state.errorHp - playerDamage));

    setPlayerPoseWithReset('attack');
    queueTimeout(() => setEnemyPoseWithReset('hit'), 140);

    appendLog({
      speaker: 'Você',
      message: isStatusMove
        ? `${starter.name} usou ${move.name}. ${move.description}`
        : `${starter.name} usou ${move.name}. ${playerDamage} de dano.`,
    });

    onStateChange(prev => ({ ...prev, errorHp: nextErrorHp }));

    if (nextErrorHp <= 0) {
      queueTimeout(() => {
        appendLog({
          speaker: 'Narrador',
          message: 'Erro 404 se dissipou. Vitória concluída.',
        });
        onStateChange(prev => ({ ...prev, turn: prev.turn + 1 }));
        endBattle('victory');
      }, 260);
      return;
    }

    executeEnemyTurn(1);
  };

  const handleBag = () => {
    if (!isBattleActive) return;
    if (state.potions <= 0) {
      appendLog({ speaker: 'Narrador', message: 'Sem itens disponíveis.' });
      return;
    }

    setMenuState('enemy');
    const heal = Math.floor(Math.random() * 12) + 18;
    const healedHp = Math.max(0, Math.min(MAX_HP, state.playerHp + heal));

    appendLog({
      speaker: 'Você',
      message: `Poção aplicada: +${heal} HP. Restam ${state.potions - 1}.`,
    });

    onStateChange(prev => ({
      ...prev,
      playerHp: healedHp,
      potions: prev.potions - 1,
    }));

    executeEnemyTurn(1);
  };

  const handleRun = () => {
    if (!isBattleActive) return;
    const success = Math.random() > 0.6;

    if (success) {
      appendLog({
        speaker: 'Narrador',
        message: 'Retirada concluída. Você volta ao caminho seguro.',
      });
      endBattle('runaway');
      return;
    }

    setMenuState('enemy');
    appendLog({ speaker: 'Narrador', message: 'A rota de fuga foi bloqueada.' });
    executeEnemyTurn(1);
  };

  const handleAction = (key: string) => {
    if (!isBattleActive || enemyIsActive) return;
    switch (key) {
      case 'fight':
        setMenuState('moves');
        setHighlightedMoveIndex(prev => prev ?? 0);
        break;
      case 'bag':
        handleBag();
        break;
      case 'rest':
        appendLog({
          speaker: 'Você',
          message: `${starter.name} aproveitou para recuperar fôlego.`,
        });
        onStateChange(prev => ({
          ...prev,
          playerHp: Math.min(MAX_HP, prev.playerHp + 6),
        }));
        setMenuState('enemy');
        queueTimeout(() => executeEnemyTurn(1), 360);
        break;
      case 'run':
        handleRun();
        break;
      default:
        break;
    }
  };

  const handleBackToMainMenu = () => {
    if (isMoveMenu && isBattleActive) {
      setMenuState('main');
    }
  };

  const playerSprite = starter.sprites.battle[playerPose === 'idle' ? 0 : 1];
  const playerPoseClass =
    playerPose === 'attack'
      ? styles.playerPoseAttack
      : playerPose === 'hit'
        ? styles.playerPoseHit
        : '';
  const enemyPoseClass =
    enemyPose === 'attack'
      ? styles.enemyPoseAttack
      : enemyPose === 'hit'
        ? styles.enemyPoseHit
        : '';
  const playerIdleClass = playerEntered
    ? playerIsActive
      ? styles.playerTurnWave
      : styles.enemyHover
    : '';
  const enemyIdleClass = enemyIsActive ? styles.playerTurnWave : styles.enemyHover;
  const playerEntryClass = !playerEntered ? styles.playerEntry : '';
  const playerSpriteClass = clsx(playerEntryClass, playerPoseClass, playerIdleClass);
  const enemySpriteClass = clsx(enemyPoseClass, enemyIdleClass);
  const playerFlashClass = playerPose === 'hit' ? styles.hitFlashActive : styles.hitFlashInactive;
  const enemyFlashClass = enemyPose === 'hit' ? styles.hitFlashActive : styles.hitFlashInactive;

  const moveHudDetails = {
    type: currentMove?.type ?? '--',
    category: currentMove?.category ?? '--',
    ppText: currentMove ? `${currentMove.currentPp}/${currentMove.maxPp}` : '--/--',
    description: currentMove?.description ?? 'Selecione um movimento para ver os detalhes.',
  };

  const mainHudActions = mainActions.map(action => ({
    key: action.key,
    label: action.label,
    tone: action.tone,
    disabled: !isBattleActive || enemyIsActive,
    onClick: () => handleAction(action.key),
  }));

  const moveHudOptions = moveSet.map((move, idx) => ({
    key: move.name,
    label: move.name,
    tone: moveButtonTones[idx % moveButtonTones.length],
    disabled: move.currentPp <= 0 || enemyIsActive,
    onClick: () => executeMove(idx),
    onHover: () => setHighlightedMoveIndex(idx),
  }));

  const isVictory = state.endingKey === 'victory';

  return (
    <div
      className={clsx(
        'relative flex min-h-screen w-screen items-center justify-center overflow-hidden',
        fontClass
      )}
    >
      <Image
        src={battleBackgroundImage}
        alt="Cenário pixelado"
        fill
        priority
        className="object-cover blur-[1px] opacity-90"
      />
      <div className="absolute inset-0 bg-[#040a1f]/74" />

      {showPreload && (
        <div
          className={clsx(
            'absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-[#040814]',
            preloadIsFading && styles.preloadFade
          )}
        >
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/25 border-t-white" />
          <p className="text-[0.7rem] uppercase tracking-[0.45em] text-white/70">
            Preparando batalha...
          </p>
        </div>
      )}

      {showTransition && (
        <div
          className={clsx(
            styles.battleTransition,
            'pointer-events-none absolute inset-0 z-30 flex flex-wrap'
          )}
        >
          {transitionBlocks.map(index => (
            <span
              key={index}
              className={styles.battleTransitionBlock}
              style={{
                width: `${100 / BLOCK_COLS}%`,
                height: `${100 / BLOCK_ROWS}%`,
                animationDelay: `${((index % BLOCK_COLS) + Math.floor(index / BLOCK_COLS)) * 45}ms`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex w-full max-w-[960px] flex-col gap-6 px-0 pt-14 pb-6">
        <div className="relative overflow-hidden border-[8px] border-[#1e2a59] bg-gradient-to-b from-[#10233d] via-[#15384b] to-[#0f261c] shadow-[0_25px_120px_rgba(5,9,25,0.8)]">
          <div className="relative min-h-[540px] w-full">
            <Image
              src={battleBackgroundImage}
              alt="Cenário pixelado"
              fill
              priority
              className="pointer-events-none select-none object-cover opacity-90 blur-[0.6px]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#091428]/55 via-[#103824]/35 to-transparent" />

            <div className="absolute inset-0 z-10 flex flex-col justify-between pb-[145px]">
              <div className="flex flex-wrap items-end justify-between gap-6 px-0 pt-4 pr-[50px]">
                <PokemonHud
                  className="w-[260px]"
                  name="WILD 404"
                  level={ENEMY_LEVEL}
                  currentHp={state.errorHp}
                  maxHp={MAX_HP}
                  isEnemy
                />

                <div
                  className={clsx(enemySpriteClass, 'relative flex flex-col items-center gap-3')}
                >
                  <span
                    className={clsx(
                      styles.hitFlash,
                      'absolute -inset-6 rounded-full bg-[#ff6787]/45 blur-lg',
                      enemyFlashClass
                    )}
                  >
                    {ENEMY_HIT_SPARKS.map(({ x, y }) => (
                      <span
                        key={`${x}-${y}`}
                        className={styles.hitFlashSpark}
                        style={{ '--spark-x': x, '--spark-y': y } as CSSProperties}
                      />
                    ))}
                  </span>
                  <div
                    className={clsx(
                      styles.glitchText,
                      'border-[3px] border-[#0e1533] bg-[#181f3f]/90 px-4 py-2 text-sm uppercase tracking-[0.35em] text-[#f75f8d] shadow-[0_6px_0_#0e1533]'
                    )}
                  >
                    ERR-404
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-end justify-between gap-6 px-0 pb-6 pl-[50px]">
                <div
                  className={clsx(
                    playerSpriteClass,
                    'relative z-10 flex flex-col items-center gap-3'
                  )}
                >
                  <span
                    className={clsx(
                      styles.hitFlash,
                      'absolute -inset-8 rounded-full bg-[#7cf0a8]/45 blur-[18px]',
                      playerFlashClass
                    )}
                  >
                    {PLAYER_HIT_SPARKS.map(({ x, y }) => (
                      <span
                        key={`${x}-${y}`}
                        className={styles.hitFlashSpark}
                        style={{ '--spark-x': x, '--spark-y': y } as CSSProperties}
                      />
                    ))}
                  </span>
                  {playerSprite && (
                    <Image
                      src={playerSprite}
                      alt={starter.name}
                      width={200}
                      height={200}
                      className="object-contain drop-shadow-[0_26px_36px_rgba(0,0,0,0.45)] translate-y-3"
                      priority
                      style={{ imageRendering: 'pixelated' }}
                    />
                  )}
                </div>

                <PokemonHud
                  className="ml-auto w-[260px]"
                  name={starter.name}
                  level={PLAYER_LEVEL}
                  currentHp={state.playerHp}
                  maxHp={MAX_HP}
                  showHpNumbers
                  currentPp={currentMove?.currentPp ?? undefined}
                  maxPp={currentMove?.maxPp ?? undefined}
                />
              </div>
            </div>
          </div>

          {showIntroBanner ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-[180px] flex justify-center">
              <div className="border-[4px] border-[#0e1533] bg-[#fff7d4]/95 px-6 py-3 text-[0.75rem] uppercase tracking-[0.45em] text-[#0e1533] shadow-[0_8px_0_#0e1533]">
                Go {starter.name}!
              </div>
            </div>
          ) : (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center">
              <PokemonBottomHud
                key={menuState}
                className="pointer-events-auto"
                mode={isMoveMenu ? 'moves' : 'main'}
                prompt={`What will ${starter.name} do?`}
                subtitle="Escolha sua próxima ação para enfrentar o 404."
                actions={!isMoveMenu ? mainHudActions : undefined}
                moves={isMoveMenu ? moveHudOptions : undefined}
                moveDetails={isMoveMenu ? moveHudDetails : undefined}
                onBack={isMoveMenu ? handleBackToMainMenu : undefined}
                isEnemyTurn={!playerIsActive}
              />
            </div>
          )}
        </div>
      </div>

      {state.battleOver && state.ending && (
        <div
          className={clsx(
            styles.resultOverlay,
            'fixed inset-0 z-[70] flex items-center justify-center bg-[#040812]/90 backdrop-blur-[2px]'
          )}
        >
          <div
            className={clsx(
              styles.resultCard,
              isVictory ? styles.resultVictory : styles.resultDefeat,
              'mx-4 w-full max-w-xl border-[4px] border-[#1b234d] bg-gradient-to-b from-[#0f1a3b] via-[#182657] to-[#101730] p-10 text-center text-white'
            )}
          >
            <div
              className={clsx(
                'text-5xl',
                isVictory ? styles.resultEmojiVictory : styles.resultEmojiDefeat
              )}
            >
              {state.ending.emoji}
            </div>
            <p className="mt-4 text-[0.75rem] uppercase tracking-[0.55em] text-white/60">
              Resultado
            </p>
            <h2 className="mt-4 text-3xl uppercase tracking-[0.5em] text-white">
              {state.ending.title}
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-white/75">{state.ending.description}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <PokeButton onClick={onReplay} variant="gold" size="sm">
                Jogar novamente
              </PokeButton>
              <PokeButton onClick={onChooseAnother} variant="blue" size="sm">
                Trocar Pokémon
              </PokeButton>
              <PokeLinkButton href="/" variant="green" size="sm">
                Voltar ao início
              </PokeLinkButton>
            </div>
          </div>
        </div>
      )}

      {showLog && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] bg-[#040812]/85 backdrop-blur-sm"
          onClick={onCloseLog}
        >
          <div className="flex h-full items-center justify-center px-6">
            <div
              className="relative w-full max-w-3xl border-4 border-[#1b234d] bg-[#0a132c]/95 p-6 text-white shadow-[0_20px_80px_rgba(4,8,18,0.85)]"
              onClick={event => event.stopPropagation()}
            >
              <PokeButton
                type="button"
                onClick={onCloseLog}
                variant="blue"
                size="sm"
                className="absolute -right-3 -top-3 shadow-[0_10px_28px_rgba(12,28,68,0.55)]"
              >
                Fechar
              </PokeButton>
              <header className="flex items-center justify-between">
                <h3 className="text-lg uppercase tracking-[0.4em]">Battle Log</h3>
              </header>
              <div className="mt-4 max-h-[320px] space-y-3 overflow-y-auto text-xs leading-relaxed tracking-[0.2em] text-white/85">
                {logs.length === 0 ? (
                  <p className="uppercase tracking-[0.3em] text-white/50">
                    Nenhum evento registrado ainda.
                  </p>
                ) : (
                  logs.map((entry, index) => (
                    <div key={`${entry.message}-${index}`}>
                      <p className="text-[0.55rem] uppercase tracking-[0.4em] text-white/40">
                        {entry.speaker}
                      </p>
                      <p className="normal-case">{entry.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleStage;
