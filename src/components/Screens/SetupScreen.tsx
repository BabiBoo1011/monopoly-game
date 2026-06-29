import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Play, Dices, AlertCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const SetupScreen: React.FC = () => {
  const { startGame, setPlayerName } = useGameStore();
  const [nameInput, setNameInput] = useState<string>('');
  const [selectedTurns, setSelectedTurns] = useState<number>(15);
  const [customTurns, setCustomTurns] = useState<string>('15');
  const [error, setError] = useState<string>('');

  const PRESETS = [5, 10, 15, 20];

  const handleSelectPreset = (turns: number) => {
    setSelectedTurns(turns);
    setCustomTurns(turns.toString());
    setError('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomTurns(val);
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 1 || num > 100) {
      setError('Please enter a number between 1 and 100.');
    } else {
      setError('');
      setSelectedTurns(num);
    }
  };

  const handleStart = () => {
    const num = parseInt(customTurns, 10);
    if (isNaN(num) || num < 1 || num > 100) {
      setError('Please enter a valid number of turns.');
      return;
    }
    setPlayerName(nameInput);
    startGame(num);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm bg-slate-900 border-4 border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 text-center relative overflow-hidden"
      >
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-white shadow-xl flex items-center justify-center text-3xl">
            🏆
          </div>
          <h1 className="text-2xl font-black text-amber-400 uppercase tracking-wide">
            Cup Game
          </h1>
          <p className="text-xs text-slate-300 font-bold max-w-xs">
            Roll the dice. Move and get cups.
          </p>
        </div>

        {/* Player Name Input Field */}
        <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700 flex flex-col gap-2 text-left">
          <label className="flex items-center gap-1.5 text-amber-300 font-black text-xs uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>Your Name:</span>
          </label>
          <input
            type="text"
            maxLength={20}
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-slate-950 border-2 border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold text-sm outline-none focus:border-amber-400 transition-all"
          />
        </div>

        {/* Turn Options */}
        <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700 flex flex-col gap-2.5 text-left">
          <div className="flex items-center gap-2 text-amber-300 font-black text-xs uppercase tracking-wider">
            <Dices className="w-4 h-4" />
            <span>Choose turns:</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {PRESETS.map((turns) => (
              <button
                key={turns}
                onClick={() => handleSelectPreset(turns)}
                className={`py-2.5 rounded-xl font-black text-sm transition-all border ${
                  selectedTurns === turns && customTurns === turns.toString()
                    ? 'bg-amber-400 border-white text-slate-950 shadow-lg scale-105'
                    : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200'
                }`}
              >
                {turns}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1 mt-0.5">
            <label className="text-[11px] font-semibold text-slate-400">
              Or type custom turns (1 - 100):
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={customTurns}
              onChange={handleCustomChange}
              className="w-full bg-slate-950 border-2 border-slate-700 rounded-xl px-3 py-2 text-center font-black text-amber-300 text-base outline-none focus:border-amber-400"
            />
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold bg-rose-500/10 p-2 rounded-xl border border-rose-500/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Big Start Button */}
        <button
          onClick={handleStart}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 border-3 border-white text-slate-950 font-black text-xl shadow-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>START</span>
        </button>
      </motion.div>
    </div>
  );
};
