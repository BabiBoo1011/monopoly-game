import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Settings, LogOut, Music, Volume2, VolumeX, RotateCcw } from 'lucide-react';

export const SettingsMenu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    musicEnabled,
    toggleMusic,
    soundEnabled,
    toggleSound,
    openExitModal,
    openReplayModal,
  } = useGameStore();

  return (
    <div
      className="relative inline-block text-left z-40"
      onMouseEnter={() => setIsMenuOpen(true)}
      onMouseLeave={() => setIsMenuOpen(false)}
    >
      {/* Gear Icon Button */}
      <button
        aria-label="Settings"
        className="p-3.5 sm:p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 border-2 border-slate-600 shadow-xl active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-yellow-300/60 flex items-center justify-center"
      >
        <Settings className={`w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-500 ${isMenuOpen ? 'rotate-90' : ''}`} />
      </button>

      {/* Hover Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-auto min-w-[160px] bg-slate-900/95 border-2 border-slate-700 rounded-2xl p-2 shadow-2xl backdrop-blur-md flex flex-col gap-1.5 animate-fade-in z-50">
          {/* Exit Button */}
          <button
            onClick={() => {
              openExitModal();
              setIsMenuOpen(false);
            }}
            aria-label="Exit"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-600/90 text-slate-200 hover:text-white transition-all cursor-pointer w-full text-left"
          >
            <span className="text-lg shrink-0 flex items-center justify-center w-6 h-6">
              <LogOut className="w-5 h-5 text-rose-400 group-hover:text-white transition-colors" />
            </span>
            <span className="font-bold text-sm whitespace-nowrap opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
              Exit
            </span>
          </button>

          {/* Music Button */}
          <button
            onClick={toggleMusic}
            aria-label={musicEnabled ? 'Music On' : 'Music Off'}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-emerald-600/90 text-slate-200 hover:text-white transition-all cursor-pointer w-full text-left"
          >
            <span className="text-lg shrink-0 flex items-center justify-center w-6 h-6">
              <Music className={`w-5 h-5 transition-colors ${musicEnabled ? 'text-emerald-400 group-hover:text-white' : 'text-slate-500'}`} />
            </span>
            <span className="font-bold text-sm whitespace-nowrap opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
              {musicEnabled ? 'Music On' : 'Music Off'}
            </span>
          </button>

          {/* Sound Button */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Sound On' : 'Sound Off'}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-cyan-600/90 text-slate-200 hover:text-white transition-all cursor-pointer w-full text-left"
          >
            <span className="text-lg shrink-0 flex items-center justify-center w-6 h-6">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500 transition-colors" />
              )}
            </span>
            <span className="font-bold text-sm whitespace-nowrap opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
              {soundEnabled ? 'Sound On' : 'Sound Off'}
            </span>
          </button>

          {/* Replay Button */}
          <button
            onClick={() => {
              openReplayModal();
              setIsMenuOpen(false);
            }}
            aria-label="Replay"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-amber-500/90 text-slate-200 hover:text-slate-950 transition-all cursor-pointer w-full text-left"
          >
            <span className="text-lg shrink-0 flex items-center justify-center w-6 h-6">
              <RotateCcw className="w-5 h-5 text-amber-400 group-hover:text-slate-950 transition-colors" />
            </span>
            <span className="font-bold text-sm whitespace-nowrap opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
              Replay
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
