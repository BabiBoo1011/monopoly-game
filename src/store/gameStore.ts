import { create } from 'zustand';
import { GameState, GameScreen, Player, AvatarType, TurnHistoryEntry } from '../types/game';
import { boardTiles } from '../data/boardTiles';
import {
  applyCupChange,
  getNextPosition,
  resolveTileEffect,
  getStartPosForPlayer,
  getPlayerStartPosition,
  PLAYER_COLORS,
} from '../logic/gameLogic';

interface GameActions {
  goToSetup: () => void;
  goBackFromSetup: () => void;
  setPlayerCount: (count: number) => void;
  setTurnsPerPlayer: (turns: number) => void;
  setCustomTurnsInput: (input: string) => void;
  goToPlayerSetup: () => void;
  goBackFromPlayerSetup: () => void;
  updatePlayerName: (playerId: string, name: string) => void;
  updatePlayerAvatar: (playerId: string, avatar: AvatarType) => void;
  startMultiplayerGame: () => void;
  rollDice: () => void;
  openExitModal: () => void;
  openReplayModal: () => void;
  closeModal: () => void;
  confirmExit: () => void;
  confirmReplay: () => void;
  exitGame: () => void;
  replayGame: () => void;
  goHome: () => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  showTileMessage: (msg: string) => void;
  clearTileMessage: () => void;
}

export type GameStore = GameState & GameActions;

let audioCtx: AudioContext | null = null;
let musicTimer: number | null = null;
let tileMsgTimer: number | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSynthSound(type: 'roll' | 'step' | 'reward' | 'penalty' | 'win', soundEnabled: boolean) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'roll') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'step') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(340, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'reward') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      osc.frequency.setValueAtTime(1046.5, now + 0.24);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'penalty') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.25);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'win') {
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.frequency.setValueAtTime(freq, now + idx * 0.1);
        subGain.gain.setValueAtTime(0.2, now + idx * 0.1);
        subGain.gain.linearRampToValueAtTime(0.01, now + idx * 0.1 + 0.2);
        subOsc.start(now + idx * 0.1);
        subOsc.stop(now + idx * 0.1 + 0.2);
      });
    }
  } catch (e) {
    console.warn('Sound play error:', e);
  }
}

const MELODY_NOTES = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66, 349.23, 440.00, 349.23];

function startBgmLoop(musicEnabled: boolean) {
  stopBgmLoop();
  if (!musicEnabled) return;

  let noteIdx = 0;
  musicTimer = window.setInterval(() => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(MELODY_NOTES[noteIdx], now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.005, now + 0.35);

      osc.start(now);
      osc.stop(now + 0.35);

      noteIdx = (noteIdx + 1) % MELODY_NOTES.length;
    } catch (e) {
      console.warn('BGM error:', e);
    }
  }, 400);
}

function stopBgmLoop() {
  if (musicTimer !== null) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}

function createDefaultPlayers(count: number, turns: number): Player[] {
  const players: Player[] = [];
  for (let i = 0; i < count; i++) {
    players.push({
      id: `player-${i + 1}`,
      name: `Player ${i + 1}`,
      avatar: i % 2 === 0 ? 'superhero' : 'princess',
      color: PLAYER_COLORS[i % PLAYER_COLORS.length],
      position: getStartPosForPlayer(i),
      cups: 0,
      remainingTurns: turns,
      totalTurns: turns,
    });
  }
  return players;
}

function findNextActivePlayerIndex(players: Player[], startIndex: number): number {
  const n = players.length;
  for (let i = 0; i < n; i++) {
    const candidate = (startIndex + i) % n;
    if (players[candidate].remainingTurns > 0) {
      return candidate;
    }
  }
  return -1;
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'home',
  playerCount: 2,
  turnsPerPlayer: 10,
  customTurnsInput: '10',
  setupError: null,
  players: [],
  currentPlayerIndex: 0,
  tileMessage: null,
  diceValue: null,
  isRolling: false,
  isMoving: false,
  history: [],
  soundEnabled: true,
  musicEnabled: true,
  activeModal: null,

  goToSetup: () => {
    set({ screen: 'setup', setupError: null });
  },

  goBackFromSetup: () => {
    set({ screen: 'home', setupError: null });
  },

  setPlayerCount: (count: number) => {
    const clamped = Math.max(1, Math.min(4, count));
    set({ playerCount: clamped });
  },

  setTurnsPerPlayer: (turns: number) => {
    set({ turnsPerPlayer: turns, customTurnsInput: String(turns), setupError: null });
  },

  setCustomTurnsInput: (input: string) => {
    set({ customTurnsInput: input });
    const trimmed = input.trim();
    if (!trimmed || !/^\d+$/.test(trimmed)) {
      set({ setupError: 'Please enter 1 to 100.' });
      return;
    }
    const val = parseInt(trimmed, 10);
    if (val < 1 || val > 100) {
      set({ setupError: 'Please enter 1 to 100.' });
    } else {
      set({ turnsPerPlayer: val, setupError: null });
    }
  },

  goToPlayerSetup: () => {
    const { playerCount, turnsPerPlayer, customTurnsInput, players } = get();

    const trimmed = customTurnsInput.trim();
    if (!trimmed || !/^\d+$/.test(trimmed)) {
      set({ setupError: 'Please enter 1 to 100.' });
      return;
    }
    const val = parseInt(trimmed, 10);
    if (val < 1 || val > 100) {
      set({ setupError: 'Please enter 1 to 100.' });
      return;
    }

    const updated = createDefaultPlayers(playerCount, val);
    for (let i = 0; i < playerCount; i++) {
      if (players[i]) {
        if (players[i].name && players[i].name !== `Player ${i + 1}`) {
          updated[i].name = players[i].name;
        }
        updated[i].avatar = players[i].avatar;
      }
    }
    set({ players: updated, turnsPerPlayer: val, setupError: null, screen: 'player_setup' });
  },

  goBackFromPlayerSetup: () => {
    set({ screen: 'setup', setupError: null });
  },

  updatePlayerName: (playerId: string, name: string) => {
    set((state) => ({
      players: state.players.map((p) => (p.id === playerId ? { ...p, name: name } : p)),
    }));
  },

  updatePlayerAvatar: (playerId: string, avatar: AvatarType) => {
    set((state) => ({
      players: state.players.map((p) => (p.id === playerId ? { ...p, avatar: avatar } : p)),
    }));
  },

  startMultiplayerGame: () => {
    const { players, turnsPerPlayer, musicEnabled } = get();
    const prepared = players.map((p, idx) => ({
      ...p,
      name: p.name.trim().length > 0 ? p.name.trim() : `Player ${idx + 1}`,
      position: getStartPosForPlayer(idx),
      cups: 0,
      remainingTurns: turnsPerPlayer,
      totalTurns: turnsPerPlayer,
    }));

    set({
      players: prepared,
      currentPlayerIndex: 0,
      screen: 'playing',
      diceValue: null,
      isRolling: false,
      isMoving: false,
      history: [],
      tileMessage: null,
      activeModal: null,
    });
    startBgmLoop(musicEnabled);
  },

  showTileMessage: (msg: string) => {
    if (tileMsgTimer !== null) clearTimeout(tileMsgTimer);
    set({ tileMessage: msg });
    tileMsgTimer = window.setTimeout(() => {
      set({ tileMessage: null });
      tileMsgTimer = null;
    }, 1800);
  },

  clearTileMessage: () => {
    if (tileMsgTimer !== null) {
      clearTimeout(tileMsgTimer);
      tileMsgTimer = null;
    }
    set({ tileMessage: null });
  },

  openExitModal: () => {
    set({ activeModal: 'exit' });
  },

  openReplayModal: () => {
    set({ activeModal: 'replay' });
  },

  closeModal: () => {
    set({ activeModal: null });
  },

  confirmExit: () => {
    stopBgmLoop();
    if (tileMsgTimer !== null) clearTimeout(tileMsgTimer);
    set({
      screen: 'home',
      activeModal: null,
      tileMessage: null,
    });
  },

  confirmReplay: () => {
    const { players, turnsPerPlayer, musicEnabled } = get();
    if (tileMsgTimer !== null) clearTimeout(tileMsgTimer);

    const resetPlayers = players.map((p, idx) => ({
      ...p,
      position: getStartPosForPlayer(idx),
      cups: 0,
      remainingTurns: turnsPerPlayer,
      totalTurns: turnsPerPlayer,
    }));

    set({
      players: resetPlayers,
      currentPlayerIndex: 0,
      screen: 'playing',
      diceValue: null,
      isRolling: false,
      isMoving: false,
      history: [],
      tileMessage: null,
      activeModal: null,
    });
    startBgmLoop(musicEnabled);
  },

  goHome: () => {
    stopBgmLoop();
    if (tileMsgTimer !== null) clearTimeout(tileMsgTimer);
    set({
      screen: 'home',
      activeModal: null,
      tileMessage: null,
    });
  },

  exitGame: () => {
    get().confirmExit();
  },

  replayGame: () => {
    get().confirmReplay();
  },

  toggleSound: () => {
    set((state) => ({ soundEnabled: !state.soundEnabled }));
  },

  toggleMusic: () => {
    const nextState = !get().musicEnabled;
    set({ musicEnabled: nextState });
    if (get().screen === 'playing') {
      startBgmLoop(nextState);
    }
  },

  rollDice: () => {
    const { isRolling, isMoving, activeModal, players, currentPlayerIndex, soundEnabled } = get();
    const curPlayer = players[currentPlayerIndex];

    if (isRolling || isMoving || activeModal !== null || !curPlayer || curPlayer.remainingTurns <= 0) return;

    set({ isRolling: true });
    get().clearTileMessage();

    const interval = setInterval(() => playSynthSound('roll', soundEnabled), 120);
    const diceResult = Math.floor(Math.random() * 6) + 1;

    setTimeout(() => {
      clearInterval(interval);
      set({ diceValue: diceResult, isRolling: false, isMoving: true });

      let stepsLeft = diceResult;
      const moveInterval = setInterval(() => {
        const activeState = get();
        const activePlayer = activeState.players[activeState.currentPlayerIndex];
        const nextPos = getNextPosition(activePlayer.position, 1, 28);

        set((state) => ({
          players: state.players.map((p, idx) =>
            idx === state.currentPlayerIndex ? { ...p, position: nextPos } : p
          ),
        }));

        playSynthSound('step', get().soundEnabled);
        stepsLeft--;

        if (stepsLeft <= 0) {
          clearInterval(moveInterval);
          setTimeout(() => {
            const finalState = get();
            const pIdx = finalState.currentPlayerIndex;
            const pObj = finalState.players[pIdx];
            const firstLandedPos = pObj.position;
            const firstTile = boardTiles[firstLandedPos];

            const firstEffect = resolveTileEffect(firstTile, pObj.name, false);

            let newCups = pObj.cups;
            let finalPos = firstLandedPos;
            let combinedEffectDesc = firstEffect.effectDescription;

            if (firstEffect.cupsDelta !== 0) {
              newCups = applyCupChange(pObj.cups, firstEffect.cupsDelta);
              playSynthSound(firstEffect.cupsDelta > 0 ? 'reward' : 'penalty', soundEnabled);
            }

            get().showTileMessage(firstEffect.effectDescription);

            const completeTurn = (endPos: number, endCups: number, effectDesc: string, delta: number) => {
              const latestState = get();
              const activeP = latestState.players[pIdx];
              const newRemainingTurns = activeP.remainingTurns - 1;

              const logEntry: TurnHistoryEntry = {
                turnNumber: latestState.history.length + 1,
                playerId: activeP.id,
                playerName: activeP.name,
                diceValue: diceResult,
                fromPosition: pObj.position,
                toPosition: endPos,
                effectDescription: effectDesc,
                cupsDelta: delta,
                totalCupsAfter: endCups,
              };

              const updatedPlayers = latestState.players.map((p, idx) =>
                idx === pIdx
                  ? { ...p, position: endPos, cups: endCups, remainingTurns: newRemainingTurns }
                  : p
              );

              const nextIdx = findNextActivePlayerIndex(updatedPlayers, (pIdx + 1) % updatedPlayers.length);
              const isAllFinished = nextIdx === -1 || updatedPlayers.every((p) => p.remainingTurns <= 0);

              set({
                players: updatedPlayers,
                currentPlayerIndex: isAllFinished ? pIdx : nextIdx,
                isMoving: false,
                history: [logEntry, ...latestState.history],
                screen: isAllFinished ? 'finished' : 'playing',
              });

              if (isAllFinished) playSynthSound('win', soundEnabled);
            };

            if (firstEffect.newPosition !== undefined) {
              finalPos = firstEffect.newPosition;
              playSynthSound(finalPos === 0 ? 'penalty' : 'reward', soundEnabled);

              setTimeout(() => {
                set((state) => ({
                  players: state.players.map((p, idx) =>
                    idx === pIdx ? { ...p, position: finalPos } : p
                  ),
                }));

                const secondTile = boardTiles[finalPos];
                const secondEffect = resolveTileEffect(secondTile, pObj.name, true);

                if (secondEffect.cupsDelta !== 0) {
                  newCups = applyCupChange(newCups, secondEffect.cupsDelta);
                  playSynthSound(secondEffect.cupsDelta > 0 ? 'reward' : 'penalty', soundEnabled);
                }

                combinedEffectDesc = `${firstEffect.effectDescription} -> ${secondEffect.effectDescription}`;
                get().showTileMessage(secondEffect.effectDescription);

                completeTurn(
                  finalPos,
                  newCups,
                  combinedEffectDesc,
                  secondEffect.cupsDelta !== 0 ? secondEffect.cupsDelta : firstEffect.cupsDelta
                );
              }, 600);
            } else {
              completeTurn(finalPos, newCups, firstEffect.effectDescription, firstEffect.cupsDelta);
            }
          }, 300);
        }
      }, 260);
    }, 700);
  },
}));
