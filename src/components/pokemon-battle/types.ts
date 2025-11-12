'use client';

export type MoveCategory = 'Physical' | 'Special' | 'Status';

export type MoveType = 'Grass' | 'Fire' | 'Water' | 'Normal' | 'Electric' | 'Status';

export type PokemonGender = 'masc' | 'fem';

export type PokemonMove = {
  name: string;
  type: MoveType;
  category: MoveCategory;
  maxPp: number;
  power: number;
  description: string;
};

export type PokemonStats = {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
};

export type PokemonSpriteSet = {
  front: string;
  hover: string;
  battle: [string, string];
};

export type PokemonDefinition = {
  id: 'bubbasaur' | 'charmander' | 'squirtle';
  name: string;
  codename: string;
  typing: string;
  description: string;
  gender: PokemonGender;
  color: 'emerald' | 'rose' | 'sky';
  sprites: PokemonSpriteSet;
  stats: PokemonStats;
  moves: PokemonMove[];
};

export type BattlePhase = 'intro' | 'starter-select' | 'battle';

export type BattleEndingKey = 'victory' | 'defeat' | 'runaway';
