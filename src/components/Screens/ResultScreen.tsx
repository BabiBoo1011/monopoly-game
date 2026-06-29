import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { calculateRankings } from '../../logic/gameLogic';
import { Trophy, RotateCcw, Home, Shield, Crown } from 'lucide-react';

export const ResultScreen: React.FC = () => {
  const { players, replayGame, goHome } = useGameStore();
  const { winnerTitle, rankings } = calculateRankings(players);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-indigo-900 to-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 text-white font-sans select-none">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg p-6 sm:p-10 rounded-3xl border-4 border-white/20 shadow-2xl flex flex-col items-center animate-fade-in">
        <div className="bg-amber-400 p-5 rounded-full shadow-lg mb-4 text-slate-900 border-4 border-white animate-bounce">
          <Trophy className="w-16 h-16" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-wider text-yellow-300 drop-shadow mb-2">
          Game Over
        </h1>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-8 bg-white/20 px-6 py-2 rounded-full border border-white/30 shadow-inner">
          {winnerTitle}
        </h2>

        {/* Ranking List */}
        <div className="w-full flex flex-col gap-3 mb-8">
          {rankings.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/90 text-slate-800 shadow-md border-l-8 transition-transform hover:scale-101"
              style={{ borderColor: player.color }}
            >
              <div className="flex items-center gap-4">
                <span className="font-black text-xl w-12 text-center py-1 bg-slate-200 rounded-lg text-slate-700">
                  #{player.rank}
                </span>

                <div
                  className="p-2.5 rounded-xl text-white shadow-sm flex items-center justify-center"
                  style={{ backgroundColor: player.color }}
                >
                  {player.avatar === 'superhero' ? (
                    <Shield className="w-6 h-6" />
                  ) : (
                    <Crown className="w-6 h-6" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="font-extrabold text-lg sm:text-xl text-slate-900 leading-tight">
                    {player.name}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 capitalize">
                    {player.avatar}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-xl border border-amber-300">
                <Trophy className="w-6 h-6 text-amber-600 fill-amber-400" />
                <span className="font-black text-xl text-amber-900">
                  {player.cups} <span className="text-sm font-bold text-amber-700">cups</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <button
            onClick={replayGame}
            className="py-4 px-6 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black text-xl rounded-2xl shadow-xl border-b-4 border-emerald-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-6 h-6" />
            <span>Replay</span>
          </button>

          <button
            onClick={goHome}
            className="py-4 px-6 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-xl rounded-2xl shadow-xl border-b-4 border-blue-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-6 h-6" />
            <span>Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
