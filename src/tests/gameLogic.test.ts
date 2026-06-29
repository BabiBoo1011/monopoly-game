import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  clampCups,
  applyCupChange,
  getNextPosition,
  resolveTileEffect,
} from '../logic/gameLogic';
import { BoardTile } from '../types/game';
import { useGameStore } from '../store/gameStore';

describe('Comprehensive 12 Game Logic Unit Tests (Step Arrows & Cup Coverage)', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('1. Welcome message uses the player name', () => {
    useGameStore.getState().setPlayerName('Manh');
    expect(useGameStore.getState().playerName).toBe('Manh');
  });

  it('2. Empty player name becomes "Player"', () => {
    useGameStore.getState().setPlayerName('   ');
    expect(useGameStore.getState().playerName).toBe('Player');
  });

  it('3. Replay resets the game but keeps the player name', () => {
    useGameStore.getState().setPlayerName('Bubi');
    useGameStore.getState().startGame(10);
    useGameStore.getState().replayGame();
    expect(useGameStore.getState().playerName).toBe('Bubi');
    expect(useGameStore.getState().remainingTurns).toBe(10);
    expect(useGameStore.getState().cups).toBe(0);
  });

  it('4. Landing on a +5 cup tile adds 5 cups', () => {
    const tile: BoardTile = {
      id: 4,
      pathIndex: 4,
      row: 1,
      col: 5,
      type: 'cup_reward',
      label: '🏆 +5',
      value: 5,
      description: 'You earned 5 cups!',
    };
    const effect = resolveTileEffect(tile, 0);
    expect(effect.cupsDelta).toBe(5);
    expect(applyCupChange(0, effect.cupsDelta)).toBe(5);
  });

  it('5. Landing on a -3 cup tile subtracts 3 cups but never below 0', () => {
    const tile: BoardTile = {
      id: 2,
      pathIndex: 2,
      row: 1,
      col: 3,
      type: 'cup_reward',
      label: '🏆 -3',
      value: -3,
      description: 'You lost 3 cups!',
    };
    const effect = resolveTileEffect(tile, 2);
    expect(effect.cupsDelta).toBe(-3);
    expect(applyCupChange(2, effect.cupsDelta)).toBe(0);
  });

  it('6. Landing on Go forward 5 (→ +5) moves the player 5 more steps', () => {
    const tile: BoardTile = {
      id: 15,
      pathIndex: 15,
      row: 6,
      col: 10,
      type: 'move_forward',
      label: '→ +5',
      value: 5,
      description: 'Go forward 5!',
    };
    const effect = resolveTileEffect(tile, 0);
    expect(effect.newPosition).toBe(20);
  });

  it('7. If Go forward 5 lands on a +5 cup tile, the player receives 5 cups', () => {
    const moveTile: BoardTile = {
      id: 1,
      pathIndex: 1,
      row: 1,
      col: 2,
      type: 'move_forward',
      label: '→ +5',
      value: 5,
      description: 'Go forward 5!',
    };
    const targetPos = getNextPosition(moveTile.pathIndex, 5, 28); // 6
    const targetTile: BoardTile = {
      id: targetPos,
      pathIndex: targetPos,
      row: 1,
      col: 7,
      type: 'cup_reward',
      label: '🏆 +2',
      value: 2,
      description: 'You earned 2 cups!',
    };
    const chainEffect = resolveTileEffect(targetTile, 0, true);
    expect(chainEffect.cupsDelta).toBe(2);
    expect(chainEffect.effectDescription).toBe('You earned 2 cups!');
  });

  it('8. If Go forward 2 lands on a -3 cup tile, the player loses 3 cups', () => {
    const targetTile: BoardTile = {
      id: 2,
      pathIndex: 2,
      row: 1,
      col: 3,
      type: 'cup_reward',
      label: '🏆 -3',
      value: -3,
      description: 'You lost 3 cups!',
    };
    const chainEffect = resolveTileEffect(targetTile, 5, true);
    expect(chainEffect.cupsDelta).toBe(-3);
    expect(applyCupChange(5, chainEffect.cupsDelta)).toBe(2);
  });

  it('9. If Go back 3 (← -3) lands on a +3 cup tile, the player receives 3 cups', () => {
    const targetTile: BoardTile = {
      id: 3,
      pathIndex: 3,
      row: 1,
      col: 4,
      type: 'cup_reward',
      label: '🏆 +3',
      value: 3,
      description: 'You earned 3 cups!',
    };
    const chainEffect = resolveTileEffect(targetTile, 1, true);
    expect(chainEffect.cupsDelta).toBe(3);
  });

  it('10. A movement tile should not trigger another movement tile in the same dice turn', () => {
    const movementTile: BoardTile = {
      id: 5,
      pathIndex: 5,
      row: 1,
      col: 6,
      type: 'move_backward',
      label: '← -3',
      value: 3,
      description: 'Go back 3!',
    };
    const chainEffect = resolveTileEffect(movementTile, 0, true);
    expect(chainEffect.isSpecialMove).toBe(false);
    expect(chainEffect.effectDescription).toBe('Special tile!');
  });

  it('11. Every landing should create a tile message', () => {
    const rewardTile: BoardTile = {
      id: 4,
      pathIndex: 4,
      row: 1,
      col: 5,
      type: 'cup_reward',
      label: '🏆 +5',
      value: 5,
      description: 'You earned 5 cups!',
    };
    const effect = resolveTileEffect(rewardTile, 0);
    expect(effect.effectDescription).toBe('You earned 5 cups!');
  });

  it('12. Tile messages should be cleared after a short time', () => {
    vi.useFakeTimers();
    useGameStore.getState().showTileMessage('You earned 5 cups!');
    expect(useGameStore.getState().tileMessage).toBe('You earned 5 cups!');
    vi.advanceTimersByTime(2000);
    expect(useGameStore.getState().tileMessage).toBeNull();
    vi.useRealTimers();
  });
});
