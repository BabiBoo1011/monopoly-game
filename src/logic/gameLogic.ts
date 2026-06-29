import { BoardTile } from '../types/game';

export const TOTAL_BOARD_TILES = 28;

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
 * Resolves effect when player lands on a tile
 */
export function resolveTileEffect(tile: BoardTile, _currentCups: number, isChainHop = false): TileEffectResult {
  if (isChainHop && (tile.type === 'move_forward' || tile.type === 'move_backward' || tile.type === 'go_to_start')) {
    return {
      cupsDelta: 0,
      effectDescription: 'Special tile!',
      isSpecialMove: false,
    };
  }

  switch (tile.type) {
    case 'cup_reward': {
      const delta = tile.value || 0;
      return {
        cupsDelta: delta,
        effectDescription: delta > 0 ? `You earned ${delta} cups!` : `You lost ${Math.abs(delta)} cups!`,
        isSpecialMove: false,
      };
    }
    case 'go_to_start': {
      return {
        newPosition: 0,
        cupsDelta: 0,
        effectDescription: 'Go to Start!',
        isSpecialMove: true,
      };
    }
    case 'move_forward': {
      const steps = tile.value || 3;
      const targetPos = getNextPosition(tile.pathIndex, steps);
      return {
        newPosition: targetPos,
        cupsDelta: 0,
        effectDescription: `Go forward ${steps}!`,
        isSpecialMove: true,
      };
    }
    case 'move_backward': {
      const steps = tile.value || 3;
      const targetPos = getPreviousPosition(tile.pathIndex, steps);
      return {
        newPosition: targetPos,
        cupsDelta: 0,
        effectDescription: `Go back ${steps}!`,
        isSpecialMove: true,
      };
    }
    case 'start':
      return {
        cupsDelta: 0,
        effectDescription: 'Start!',
        isSpecialMove: false,
      };
    case 'empty':
    default:
      return {
        cupsDelta: 0,
        effectDescription: 'Safe tile!',
        isSpecialMove: false,
      };
  }
}

/**
 * Returns player achievement rank based on total cups
 */
export function getRankByCups(cups: number): { rank: string; color: string; description: string } {
  if (cups >= 51) {
    return {
      rank: 'Awesome',
      color: 'from-amber-400 to-yellow-600',
      description: 'You are a Cup Master! Fantastic game!',
    };
  } else if (cups >= 21) {
    return {
      rank: 'Great',
      color: 'from-cyan-400 to-blue-600',
      description: 'Great job collecting so many cups!',
    };
  } else {
    return {
      rank: 'Good',
      color: 'from-emerald-400 to-teal-600',
      description: 'Good effort! Play again to get more cups!',
    };
  }
}
