import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Trophy, Play, Sparkles } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { goToSetup } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden font-sans select-none">
      {/* Decorative floating icons */}
      <div className="absolute top-10 left-10 opacity-20 animate-bounce">
        <Trophy size={96} />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20 animate-pulse">
        <Sparkles size={120} />
      </div>

      <div className="bg-white/15 backdrop-blur-md p-8 sm:p-12 rounded-3xl border-4 border-white/30 shadow-2xl flex flex-col items-center max-w-lg w-full text-center relative z-10 animate-fade-in">
        <div className="bg-gradient-to-tr from-yellow-300 to-amber-500 p-6 rounded-full shadow-lg mb-6 border-4 border-white transform hover:scale-110 transition-transform duration-300">
          <Trophy className="w-20 h-20 text-white drop-shadow-md" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide drop-shadow-lg mb-2">
          CUP GAME
        </h1>
        <p className="text-yellow-200 text-lg sm:text-xl font-medium mb-8">
          Board Adventure for Champions! 🏆
        </p>

        <button
          onClick={goToSetup}
          className="w-full py-4 px-8 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black text-2xl rounded-2xl shadow-xl border-b-4 border-emerald-700 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <Play className="fill-current w-8 h-8" />
          Start
        </button>
      </div>
    </div>
  );
};
