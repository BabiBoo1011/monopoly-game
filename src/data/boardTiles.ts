import { BoardTile } from '../types/game';

function generatePerimeterCoords6x10(): { row: number; col: number }[] {
  const coords: { row: number; col: number }[] = [];
  // Top row: r=1, c=1..10 (10 tiles)
  for (let c = 1; c <= 10; c++) coords.push({ row: 1, col: c });
  // Right col: c=10, r=2..6 (5 tiles)
  for (let r = 2; r <= 6; r++) coords.push({ row: r, col: 10 });
  // Bottom row: r=6, c=9..1 (9 tiles)
  for (let c = 9; c >= 1; c--) coords.push({ row: 6, col: c });
  // Left col: c=1, r=5..2 (4 tiles)
  for (let r = 6; r >= 2; r--) coords.push({ row: r, col: 1 });
  return coords;
}

const rawSpecialMap: Record<number, Partial<BoardTile>> = {
  0: { type: 'start', label: '🚩 Start', icon: '', description: 'Start!' },
  1: { type: 'cup_reward', label: '🏆 +2', value: 2, icon: '', description: 'You earned 2 cups!' },
  2: { type: 'cup_reward', label: '🏆 -3', value: -3, icon: '', description: 'You lost 3 cups!' },
  3: { type: 'cup_reward', label: '🏆 +3', value: 3, icon: '', description: 'You earned 3 cups!' },
  4: { type: 'cup_reward', label: '🏆 +5', value: 5, icon: '', description: 'You earned 5 cups!' },
  5: { type: 'move_backward', label: '← -3', value: 3, icon: '', description: 'Go back 3!' },
  6: { type: 'cup_reward', label: '🏆 +2', value: 2, icon: '', description: 'You earned 2 cups!' },
  7: { type: 'cup_reward', label: '🏆 +3', value: 3, icon: '', description: 'You earned 3 cups!' },
  8: { type: 'move_forward', label: '→ +3', value: 3, icon: '', description: 'Go forward 3!' },
  9: { type: 'go_to_start', label: '🔄 Home', icon: '', description: 'Go to Start!' },
  10: { type: 'cup_reward', label: '🏆 +10', value: 10, icon: '', description: 'You earned 10 cups!' },
  11: { type: 'cup_reward', label: '🏆 +2', value: 2, icon: '', description: 'You earned 2 cups!' },
  12: { type: 'move_backward', label: '← -5', value: 5, icon: '', description: 'Go back 5!' },
  13: { type: 'cup_reward', label: '🏆 +5', value: 5, icon: '', description: 'You earned 5 cups!' },
  14: { type: 'cup_reward', label: '🏆 +3', value: 3, icon: '', description: 'You earned 3 cups!' },
  15: { type: 'move_forward', label: '→ +5', value: 5, icon: '', description: 'Go forward 5!' },
  16: { type: 'cup_reward', label: '🏆 +2', value: 2, icon: '', description: 'You earned 2 cups!' },
  17: { type: 'cup_reward', label: '🏆 +3', value: 3, icon: '', description: 'You earned 3 cups!' },
  18: { type: 'move_backward', label: '← -3', value: 3, icon: '', description: 'Go back 3!' },
  19: { type: 'cup_reward', label: '🏆 +10', value: 10, icon: '', description: 'You earned 10 cups!' },
  20: { type: 'cup_reward', label: '🏆 +5', value: 5, icon: '', description: 'You earned 5 cups!' },
  21: { type: 'cup_reward', label: '🏆 -2', value: -2, icon: '', description: 'You lost 2 cups!' },
  22: { type: 'cup_reward', label: '🏆 +15', value: 15, icon: '', description: 'You earned 15 cups!' },
  23: { type: 'move_forward', label: '→ +3', value: 3, icon: '', description: 'Go forward 3!' },
  24: { type: 'cup_reward', label: '🏆 +3', value: 3, icon: '', description: 'You earned 3 cups!' },
  25: { type: 'go_to_start', label: '🔄 Home', icon: '', description: 'Go to Start!' },
  26: { type: 'cup_reward', label: '🏆 +5', value: 5, icon: '', description: 'You earned 5 cups!' },
  27: { type: 'cup_reward', label: '🏆 +10', value: 10, icon: '', description: 'You earned 10 cups!' },
};

export const boardTiles: BoardTile[] = generatePerimeterCoords6x10().map((coords, index) => {
  const special = rawSpecialMap[index];
  return {
    id: index,
    pathIndex: index,
    row: coords.row,
    col: coords.col,
    type: special?.type || 'cup_reward',
    label: special?.label || '🏆 +2',
    value: special?.value || 2,
    description: special?.description || 'You earned 2 cups!',
    icon: special?.icon || '',
  };
});
