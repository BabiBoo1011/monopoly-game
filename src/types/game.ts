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
  playerId: string;
  playerName: string;
  diceValue: number;
  fromPosition: number;
  toPosition: number;
  effectDescription: string;
  cupsDelta: number;
  totalCupsAfter: number;
}

export type AvatarType = 'superhero' | 'princess';

export interface Player {
  id: string;
  name: string;
  avatar: AvatarType;
  color: string;
  position: number;
  cups: number;
  remainingTurns: number;
  totalTurns: number;
}

export type GameScreen = 'home' | 'setup' | 'player_setup' | 'playing' | 'finished';

export interface GameState {
  screen: GameScreen;
  playerCount: number;
  turnsPerPlayer: number;
  customTurnsInput: string;
  setupError: string | null;
  players: Player[];
  currentPlayerIndex: number;
  tileMessage: string | null;
  diceValue: number | null;
  isRolling: boolean;
  isMoving: boolean;
  history: TurnHistoryEntry[];
  soundEnabled: boolean;
  musicEnabled: boolean;
  activeModal: 'exit' | 'replay' | null;
}
