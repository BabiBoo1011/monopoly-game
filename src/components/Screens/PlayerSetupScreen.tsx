import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Play, Shield, Crown, ArrowLeft } from 'lucide-react';

export const PlayerSetupScreen: React.FC = () => {
  const { players, updatePlayerName, updatePlayerAvatar, startMultiplayerGame, goBackFromPlayerSetup } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center p-4 sm:p-6 text-white font-sans select-none relative">
      <div className="max-w-4xl w-full bg-white/15 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-4 border-white/30 shadow-2xl flex flex-col items-center relative">
        {/* Back Button */}
        <button
          onClick={goBackFromPlayerSetup}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 active:scale-95 text-white font-bold text-sm border border-white/40 transition-all cursor-pointer"
          title="Back to Game Setup"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 mt-4 sm:mt-0 text-yellow-300 drop-shadow">
          Player Setup
        </h2>
        <p className="text-white/80 text-base sm:text-lg mb-6">
          Choose your name and favorite hero!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full mb-8">
          {players.map((player, idx) => (
            <div
              key={player.id}
              className="bg-white/90 text-slate-800 p-5 rounded-2xl shadow-lg border-4 flex flex-col gap-4 transition-all"
              style={{ borderColor: player.color }}
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span
                  className="font-black text-lg px-3 py-1 rounded-full text-white shadow-sm"
                  style={{ backgroundColor: player.color }}
                >
                  Player {idx + 1}
                </span>
                <div
                  className="w-4 h-4 rounded-full shadow-inner"
                  style={{ backgroundColor: player.color }}
                />
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => updatePlayerName(player.id, e.target.value)}
                  placeholder={`Player ${idx + 1}`}
                  maxLength={12}
                  className="w-full bg-slate-100 border-2 border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Avatar Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Choose Avatar
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updatePlayerAvatar(player.id, 'superhero')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold transition-all border-2 cursor-pointer ${
                      player.avatar === 'superhero'
                        ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-102'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                    <span>Superhero</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updatePlayerAvatar(player.id, 'princess')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold transition-all border-2 cursor-pointer ${
                      player.avatar === 'princess'
                        ? 'bg-pink-500 text-white border-pink-600 shadow-md scale-102'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <Crown className="w-5 h-5" />
                    <span>Princess</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={startMultiplayerGame}
          className="w-full sm:w-80 py-4 px-8 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black text-2xl rounded-2xl shadow-xl border-b-4 border-emerald-700 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <Play className="fill-current w-8 h-8" />
          Play
        </button>
      </div>
    </div>
  );
};
