import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Board } from '../Board/Board';
import { LogOut, Music, Volume2, VolumeX, RotateCcw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GameScreen: React.FC = () => {
  const { currentPosition, musicEnabled, toggleMusic, soundEnabled, toggleSound, exitGame, replayGame } = useGameStore();
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Centered Workspace with 6x10 Board & Outside Welcome Banner */}
      <div className="w-full max-w-4xl flex items-center justify-center">
        <Board currentPosition={currentPosition} />
      </div>

      {/* Right-side Vertical Control Buttons Panel (Exit, Music, Sound, Replay) */}
      <div className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
        <button
          onClick={() => setShowExitConfirm(true)}
          className="flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 border-2 border-white text-white font-black text-xs sm:text-sm shadow-lg shadow-rose-600/40 active:scale-95 transition-all"
          title="Exit Game"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit</span>
        </button>

        <button
          onClick={toggleMusic}
          className={`flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl border-2 border-white font-black text-xs sm:text-sm shadow-lg active:scale-95 transition-all ${
            musicEnabled
              ? 'bg-emerald-600/90 hover:bg-emerald-600 text-white shadow-emerald-600/40'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-400'
          }`}
          title="Toggle Music"
        >
          <Music className="w-4 h-4" />
          <span>{musicEnabled ? 'Music On' : 'Music Off'}</span>
        </button>

        <button
          onClick={toggleSound}
          className={`flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl border-2 border-white font-black text-xs sm:text-sm shadow-lg active:scale-95 transition-all ${
            soundEnabled
              ? 'bg-cyan-600/90 hover:bg-cyan-600 text-white shadow-cyan-600/40'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-400'
          }`}
          title="Toggle Sound Effects"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4 text-rose-300" />}
          <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
        </button>

        <button
          onClick={replayGame}
          className="flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 border-2 border-white text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/40 active:scale-95 transition-all"
          title="Restart Game"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Replay</span>
        </button>
      </div>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              className="w-full max-w-xs bg-slate-900 border-4 border-slate-700 rounded-3xl p-5 text-center shadow-2xl flex flex-col items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h2 className="text-xl font-black text-white">Exit game?</h2>

              <div className="flex items-center gap-3 w-full mt-1">
                <button
                  onClick={() => {
                    setShowExitConfirm(false);
                    exitGame();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 border-2 border-white text-white font-black text-base shadow-md active:scale-95 transition-all"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 border-2 border-slate-500 text-slate-200 font-bold text-base shadow-md active:scale-95 transition-all"
                >
                  No
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
