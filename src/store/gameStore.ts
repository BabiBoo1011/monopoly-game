import { create } from 'zustand';
import { GameState, TurnHistoryEntry } from '../types/game';
import { boardTiles } from '../data/boardTiles';
import {
  applyCupChange,
  getNextPosition,
  resolveTileEffect,
} from '../logic/gameLogic';

interface GameActions {
  setPlayerName: (name: string) => void;
  startGame: (turns: number) => void;
  rollDice: () => void;
  resetGame: () => void;
  replayGame: () => void;
  exitGame: () => void;
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

export const useGameStore = create<GameStore>((set, get) => ({
  gameStatus: 'setup',
  playerName: 'Player',
  tileMessage: null,
  totalTurns: 15,
  remainingTurns: 15,
  currentTurn: 0,
  currentPosition: 0,
  cups: 0,
  diceValue: null,
  isRolling: false,
  isMoving: false,
  history: [],
  soundEnabled: true,
  musicEnabled: true,

  setPlayerName: (name: string) => {
    const trimmed = name.trim();
    set({ playerName: trimmed.length > 0 ? trimmed : 'Player' });
  },

  showTileMessage: (msg: string) => {
    if (tileMsgTimer !== null) {
      clearTimeout(tileMsgTimer);
    }
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

  startGame: (turns: number) => {
    set({
      gameStatus: 'playing',
      totalTurns: turns,
      remainingTurns: turns,
      currentTurn: 0,
      currentPosition: 0,
      cups: 0,
      diceValue: null,
      isRolling: false,
      isMoving: false,
      history: [],
      tileMessage: null,
    });
    startBgmLoop(get().musicEnabled);
  },

  replayGame: () => {
    const { totalTurns, musicEnabled } = get();
    if (tileMsgTimer !== null) clearTimeout(tileMsgTimer);
    set({
      gameStatus: 'playing',
      remainingTurns: totalTurns,
      currentTurn: 0,
      currentPosition: 0,
      cups: 0,
      diceValue: null,
      isRolling: false,
      isMoving: false,
      history: [],
      tileMessage: null,
    });
    startBgmLoop(musicEnabled);
  },

  resetGame: () => {
    stopBgmLoop();
    if (tileMsgTimer !== null) clearTimeout(tileMsgTimer);
    set({
      gameStatus: 'setup',
      currentPosition: 0,
      cups: 0,
      diceValue: null,
      isRolling: false,
      isMoving: false,
      history: [],
      tileMessage: null,
    });
  },

  exitGame: () => {
    stopBgmLoop();
    if (tileMsgTimer !== null) clearTimeout(tileMsgTimer);
    set({
      gameStatus: 'setup',
      currentPosition: 0,
      cups: 0,
      diceValue: null,
      isRolling: false,
      isMoving: false,
      history: [],
      tileMessage: null,
    });
  },

  toggleSound: () => {
    set((state) => ({ soundEnabled: !state.soundEnabled }));
  },

  toggleMusic: () => {
    const nextState = !get().musicEnabled;
    set({ musicEnabled: nextState });
    if (get().gameStatus !== 'setup') {
      startBgmLoop(nextState);
    }
  },

  rollDice: () => {
    const { isRolling, isMoving, remainingTurns, soundEnabled } = get();
    if (isRolling || isMoving || remainingTurns <= 0) return;

    set({ isRolling: true });
    get().clearTileMessage();

    const interval = setInterval(() => playSynthSound('roll', soundEnabled), 120);
    const diceResult = Math.floor(Math.random() * 6) + 1;

    setTimeout(() => {
      clearInterval(interval);
      set({ diceValue: diceResult, isRolling: false, isMoving: true });
      
      let stepsLeft = diceResult;
      const moveInterval = setInterval(() => {
        const currentPos = get().currentPosition;
        const nextPos = getNextPosition(currentPos, 1, 28);
        set({ currentPosition: nextPos });
        playSynthSound('step', get().soundEnabled);
        stepsLeft--;

        if (stepsLeft <= 0) {
          clearInterval(moveInterval);
          setTimeout(() => {
            const firstLandedPos = get().currentPosition;
            const firstTile = boardTiles[firstLandedPos];
            const currentCups = get().cups;
            const firstEffect = resolveTileEffect(firstTile, currentCups, false);

            let newCups = currentCups;
            let finalPos = firstLandedPos;
            let combinedEffectDesc = firstEffect.effectDescription;

            if (firstEffect.cupsDelta !== 0) {
              newCups = applyCupChange(currentCups, firstEffect.cupsDelta);
              playSynthSound(firstEffect.cupsDelta > 0 ? 'reward' : 'penalty', soundEnabled);
            }

            get().showTileMessage(firstEffect.effectDescription);

            // Handle Chain Effect if first tile was a movement tile!
            if (firstEffect.newPosition !== undefined) {
              finalPos = firstEffect.newPosition;
              playSynthSound(finalPos === 0 ? 'penalty' : 'reward', soundEnabled);

              setTimeout(() => {
                set({ currentPosition: finalPos });
                const secondTile = boardTiles[finalPos];
                const secondEffect = resolveTileEffect(secondTile, newCups, true);

                if (secondEffect.cupsDelta !== 0) {
                  newCups = applyCupChange(newCups, secondEffect.cupsDelta);
                  playSynthSound(secondEffect.cupsDelta > 0 ? 'reward' : 'penalty', soundEnabled);
                }

                combinedEffectDesc = `${firstEffect.effectDescription} -> ${secondEffect.effectDescription}`;
                get().showTileMessage(secondEffect.effectDescription);

                const turnNum = get().currentTurn + 1;
                const newRemaining = get().remainingTurns - 1;

                const logEntry: TurnHistoryEntry = {
                  turnNumber: turnNum,
                  diceValue: diceResult,
                  fromPosition: firstLandedPos,
                  toPosition: finalPos,
                  effectDescription: combinedEffectDesc,
                  cupsDelta: secondEffect.cupsDelta !== 0 ? secondEffect.cupsDelta : firstEffect.cupsDelta,
                  totalCupsAfter: newCups,
                };

                set({
                  currentPosition: finalPos,
                  cups: newCups,
                  currentTurn: turnNum,
                  remainingTurns: newRemaining,
                  isMoving: false,
                  history: [logEntry, ...get().history],
                  gameStatus: newRemaining <= 0 ? 'finished' : 'playing',
                });

                if (newRemaining <= 0) playSynthSound('win', soundEnabled);
              }, 600);
            } else {
              // Standard single hop resolution
              const turnNum = get().currentTurn + 1;
              const newRemaining = get().remainingTurns - 1;

              const logEntry: TurnHistoryEntry = {
                turnNumber: turnNum,
                diceValue: diceResult,
                fromPosition: currentPos,
                toPosition: finalPos,
                effectDescription: firstEffect.effectDescription,
                cupsDelta: firstEffect.cupsDelta,
                totalCupsAfter: newCups,
              };

              set({
                currentPosition: finalPos,
                cups: newCups,
                currentTurn: turnNum,
                remainingTurns: newRemaining,
                isMoving: false,
                history: [logEntry, ...get().history],
                gameStatus: newRemaining <= 0 ? 'finished' : 'playing',
              });

              if (newRemaining <= 0) playSynthSound('win', soundEnabled);
            }
          }, 300);
        }
      }, 260);
    }, 700);
  },
}));
