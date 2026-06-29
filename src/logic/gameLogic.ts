import { BoardTile, Player } from '../types/game';

export const TOTAL_BOARD_TILES = 28;

/**
 * All players start from pathIndex 0 (Start tile).
 */
export function getPlayerStartPosition(_playerIndex?: number): number {
  return 0;
}

export function getStartPosForPlayer(playerIndex: number): number {
  return getPlayerStartPosition(playerIndex);
}

export const PLAYER_COLORS = ['#3b82f6', '#ef4444', '#ec4899', '#8b5cf6']; // Blue, Red, Pink, Purple

/**
 * Ensures cups count is non-negative (min 0)
 */
export function clampCups(cups: number): number {
  return Math.max(0, cups);
}

/**
 * Calculates new cups count given a delta
 */
export function applyCupChange(currentCups: number, delta: number): number {
  return clampCups(currentCups + delta);
}

/**
 * Calculates next forward position wrapping around board length (28)
 */
export function getNextPosition(current: number, steps: number, boardLength: number = TOTAL_BOARD_TILES): number {
  return (current + steps) % boardLength;
}

/**
 * Calculates previous backward position wrapping around board length (28)
 */
export function getPreviousPosition(current: number, steps: number, boardLength: number = TOTAL_BOARD_TILES): number {
  return (current - steps % boardLength + boardLength) % boardLength;
}

export interface TileEffectResult {
  newPosition?: number;
  cupsDelta: number;
  effectDescription: string;
  isSpecialMove: boolean;
}

/**
 * Resolves tile effect for current player
 */
export function resolveTileEffect(tile: BoardTile, playerName: string, isChainHop = false): TileEffectResult {
  if (isChainHop && (tile.type === 'move_forward' || tile.type === 'move_backward' || tile.type === 'go_to_start')) {
    return {
      cupsDelta: 0,
      effectDescription: 'Safe tile!',
      isSpecialMove: false,
    };
  }

  switch (tile.type) {
    case 'cup_reward': {
      const delta = tile.value || 0;
      return {
        cupsDelta: delta,
        effectDescription: delta > 0 ? `${playerName} earned ${delta} cups!` : `${playerName} lost ${Math.abs(delta)} cups!`,
        isSpecialMove: false,
      };
    }
    case 'go_to_start': {
      return {
        newPosition: 0,
        cupsDelta: 0,
        effectDescription: `${playerName} goes to Start!`,
        isSpecialMove: true,
      };
    }
    case 'move_forward': {
      const steps = tile.value || 3;
      const targetPos = getNextPosition(tile.pathIndex, steps);
      return {
        newPosition: targetPos,
        cupsDelta: 0,
        effectDescription: `${playerName} goes forward ${steps}!`,
        isSpecialMove: true,
      };
    }
    case 'move_backward': {
      const steps = tile.value || 3;
      const targetPos = getPreviousPosition(tile.pathIndex, steps);
      return {
        newPosition: targetPos,
        cupsDelta: 0,
        effectDescription: `${playerName} goes back ${steps}!`,
        isSpecialMove: true,
      };
    }
    case 'start':
    case 'empty':
    default:
      return {
        cupsDelta: 0,
        effectDescription: 'Safe tile!',
        isSpecialMove: false,
      };
  }
}

export interface RankedPlayer extends Player {
  rank: number;
  isTie: boolean;
}

export interface GameResult {
  winnerTitle: string;
  isTie: boolean;
  rankings: RankedPlayer[];
}

/**
 * Calculates final rankings and winner(s)
 */
export function calculateRankings(players: Player[]): GameResult {
  if (!players || players.length === 0) {
    return { winnerTitle: 'No Players', isTie: false, rankings: [] };
  }

  // Sort by cups descending
  const sorted = [...players].sort((a, b) => b.cups - a.cups);

  const rankings: RankedPlayer[] = [];
  let currentRank = 1;

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i].cups < sorted[i - 1].cups) {
      currentRank = i + 1;
    }
    rankings.push({
      ...sorted[i],
      rank: currentRank,
      isTie: false, // will update tie flags
    });
  }

  // Determine ties
  const topCups = rankings[0].cups;
  const topPlayers = rankings.filter((p) => p.cups === topCups);
  const isTie = topPlayers.length > 1;

  rankings.forEach((p) => {
    const sameRankCount = rankings.filter((r) => r.cups === p.cups).length;
    if (sameRankCount > 1) p.isTie = true;
  });

  let winnerTitle = '';
  if (isTie) {
    winnerTitle = 'Tie!';
  } else {
    winnerTitle = `Winner: ${topPlayers[0].name}!`;
  }

  return {
    winnerTitle,
    isTie,
    rankings,
  };
}
