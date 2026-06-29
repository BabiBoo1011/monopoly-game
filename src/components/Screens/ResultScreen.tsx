import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { getRankByCups } from '../../logic/gameLogic';
import { RotateCcw, Home, Trophy, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export const ResultScreen: React.FC = () => {
  const { cups, totalTurns, startGame, resetGame } = useGameStore();
  const { rank, color, description } = getRankByCups(cups);

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm bg-slate-900 border-4 border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 text-center relative overflow-hidden"
      >
        {/* Header Badge */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-white shadow-xl flex items-center justify-center text-4xl animate-bounce">
            🏆
          </div>
          <h1 className="text-3xl font-black text-amber-400 uppercase tracking-wide">
            Game Over
          </h1>
        </div>

        {/* Score & Rank Card */}
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Your Cups
          </span>

          <div className="flex items-center gap-2 text-4xl font-black text-amber-300">
            <Trophy className="w-8 h-8 text-amber-400" />
            <span>{cups}</span>
          </div>

          <div className="w-full border-t border-slate-700 my-1" />

          <div className="flex flex-col items-center gap-1 w-full">
            <div className={`px-4 py-1.5 rounded-xl bg-gradient-to-r ${color} text-slate-950 font-black text-lg shadow flex items-center gap-1.5 uppercase tracking-wide`}>
              <Award className="w-5 h-5" />
              <span>{rank}</span>
            </div>
            <p className="text-xs text-slate-300 font-medium leading-relaxed px-1 mt-1">
              {description}
            </p>
          </div>
        </div>

        {/* Replay / Home Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => startGame(totalTurns)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 border-3 border-white text-slate-950 font-black text-lg shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Play Again</span>
          </button>

          <button
            onClick={resetGame}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 text-slate-200 font-bold text-base shadow flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Home</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
