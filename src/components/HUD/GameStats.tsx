import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Volume2, VolumeX, RotateCcw, Trophy, Target } from 'lucide-react';

export const GameStats: React.FC = () => {
  const { players, currentPlayerIndex, soundEnabled, toggleSound, replayGame } = useGameStore();
  const curPlayer = players[currentPlayerIndex] || players[0];

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-center bg-slate-800/90 p-2.5 rounded-2xl border border-slate-700 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <h1 className="text-base sm:text-lg font-black text-amber-400">
            Cup Game
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 transition-all active:scale-95 cursor-pointer"
            title="Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>

          <button
            onClick={replayGame}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gradient-to-br from-amber-500/20 to-yellow-600/10 p-2.5 rounded-2xl border border-amber-500/40 shadow-md flex items-center justify-center gap-3">
          <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">Cups</span>
            <span className="text-xl font-black text-amber-300 drop-shadow">
              {curPlayer?.cups || 0}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/10 p-2.5 rounded-2xl border border-cyan-500/40 shadow-md flex items-center justify-center gap-3">
          <Target className="w-6 h-6 text-cyan-400 shrink-0" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-cyan-200 font-bold uppercase tracking-wider">Turns Left</span>
            <span className="text-xl font-black text-cyan-300 drop-shadow">
              {curPlayer?.remainingTurns || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
