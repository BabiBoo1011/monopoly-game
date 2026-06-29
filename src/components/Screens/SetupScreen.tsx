import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Users, RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react';

export const SetupScreen: React.FC = () => {
  const {
    playerCount,
    turnsPerPlayer,
    customTurnsInput,
    setupError,
    setPlayerCount,
    setTurnsPerPlayer,
    setCustomTurnsInput,
    goToPlayerSetup,
    goBackFromSetup,
  } = useGameStore();

  const playerOptions = [1, 2, 3, 4];
  const turnOptions = [5, 10, 15, 20];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex flex-col items-center justify-center p-4 sm:p-6 text-white font-sans select-none relative">
      <div className="max-w-xl w-full bg-white/15 backdrop-blur-md p-6 sm:p-10 rounded-3xl border-4 border-white/30 shadow-2xl flex flex-col items-center relative">
        {/* Back Button */}
        <button
          onClick={goBackFromSetup}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 active:scale-95 text-white font-bold text-sm border border-white/40 transition-all cursor-pointer"
          title="Back to Home"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 mt-4 sm:mt-0 text-yellow-300 drop-shadow">
          Game Setup
        </h2>

        {/* Player Count Selection */}
        <div className="w-full mb-6">
          <div className="flex items-center gap-2 text-xl font-bold mb-3">
            <Users className="w-6 h-6 text-yellow-300" />
            <span>Number of Players</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {playerOptions.map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setPlayerCount(num)}
                className={`py-3 px-4 rounded-xl font-black text-lg transition-all border-2 cursor-pointer ${
                  playerCount === num
                    ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-lg scale-105'
                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                }`}
              >
                {num} {num === 1 ? 'Player' : 'Players'}
              </button>
            ))}
          </div>
        </div>

        {/* Turns Selection */}
        <div className="w-full mb-8">
          <div className="flex items-center gap-2 text-xl font-bold mb-3">
            <RotateCcw className="w-6 h-6 text-yellow-300" />
            <span>Turns per Player</span>
          </div>

          {/* Quick Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {turnOptions.map((turns) => (
              <button
                key={turns}
                type="button"
                onClick={() => setTurnsPerPlayer(turns)}
                className={`py-3 px-4 rounded-xl font-black text-lg transition-all border-2 cursor-pointer ${
                  turnsPerPlayer === turns && !setupError
                    ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-lg scale-105'
                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                }`}
              >
                {turns} Turns
              </button>
            ))}
          </div>

          {/* Custom Turns Input */}
          <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
            <label className="block text-sm font-bold text-yellow-200 mb-1">
              Turns
            </label>
            <input
              type="text"
              value={customTurnsInput}
              onChange={(e) => setCustomTurnsInput(e.target.value)}
              placeholder="Enter turns"
              className="w-full bg-white text-slate-900 font-bold text-lg px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:outline-none focus:border-amber-400"
            />
            {setupError && (
              <p className="text-rose-300 font-extrabold text-sm mt-2 animate-bounce">
                {setupError}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={goToPlayerSetup}
          className="w-full py-4 px-8 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black text-2xl rounded-2xl shadow-xl border-b-4 border-emerald-700 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>Next</span>
          <ArrowRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};
