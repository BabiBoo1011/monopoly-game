export type TileType = 
  | 'start' 
  | 'empty' 
  | 'cup_reward' 
  | 'go_to_start' 
  | 'move_backward' 
  | 'move_forward';

export interface BoardTile {
  id: number;
  pathIndex: number;
  row: number;
  col: number;
  type: TileType;
  label: string;
  value?: number;
  description: string;
  icon?: string;
}

export interface TurnHistoryEntry {
  turnNumber: number;
  diceValue: number;
  fromPosition: number;
  toPosition: number;
  effectDescription: string;
  cupsDelta: number;
  totalCupsAfter: number;
}

export type GameStatus = 'setup' | 'playing' | 'finished';

export interface GameState {
  gameStatus: GameStatus;
  playerName: string;
  tileMessage: string | null;
  totalTurns: number;
  remainingTurns: number;
  currentTurn: number;
  currentPosition: number;
  cups: number;
  diceValue: number | null;
  isRolling: boolean;
  isMoving: boolean;
  history: TurnHistoryEntry[];
  soundEnabled: boolean;
  musicEnabled: boolean;
}
