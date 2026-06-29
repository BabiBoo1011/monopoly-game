import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Volume2, VolumeX, RotateCcw, Trophy, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GameStats: React.FC = () => {
  const { cups, remainingTurns, soundEnabled, toggleSound, resetGame } = useGameStore();

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Top Header Bar */}
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
            className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 transition-all active:scale-95"
            title="Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>

          <button
            onClick={resetGame}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 text-xs font-bold transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 gap-2">
        {/* Cups Card */}
        <div className="bg-gradient-to-br from-amber-500/20 to-yellow-600/10 p-2.5 rounded-2xl border border-amber-500/40 shadow-md flex items-center justify-center gap-3">
          <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">Cups</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={cups}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-xl font-black text-amber-300 drop-shadow"
              >
                {cups}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Turns Left Card */}
        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/10 p-2.5 rounded-2xl border border-cyan-500/40 shadow-md flex items-center justify-center gap-3">
          <Target className="w-6 h-6 text-cyan-400 shrink-0" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-cyan-200 font-bold uppercase tracking-wider">Turns Left</span>
            <span className="text-xl font-black text-cyan-300 drop-shadow">
              {remainingTurns}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
