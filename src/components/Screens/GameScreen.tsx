import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Board } from '../Board/Board';
import { SettingsMenu } from '../HUD/SettingsMenu';
import { ConfirmModal } from '../Modal/ConfirmModal';
import { Shield, Crown, Trophy, Target, Monitor } from 'lucide-react';

export const GameScreen: React.FC = () => {
  const {
    players,
    currentPlayerIndex,
    activeModal,
    closeModal,
    confirmExit,
    confirmReplay,
  } = useGameStore();

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-x-hidden font-sans select-none">
      {/* Optional Desktop Notice for Small Viewports */}
      <div className="lg:hidden w-full max-w-4xl mb-2 bg-amber-500/20 border border-amber-500/40 rounded-xl py-1.5 px-3 flex items-center justify-center gap-2 text-amber-300 text-xs sm:text-sm font-bold text-center">
        <Monitor className="w-4 h-4 shrink-0" />
        <span>Please use a computer screen.</span>
      </div>

      {/* Top / Header Player Score Cards Panel */}
      <div className="w-full max-w-4xl mb-3 px-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {players.map((p, idx) => {
            const isCurrent = idx === currentPlayerIndex;
            return (
              <div
                key={p.id}
                className={`p-2 sm:p-3 rounded-2xl border-2 transition-all shadow-md flex items-center gap-2 ${
                  isCurrent
                    ? 'bg-slate-800 border-yellow-400 ring-2 ring-yellow-400/80 scale-102 z-10'
                    : 'bg-slate-900/80 border-slate-700 opacity-80'
                }`}
              >
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow"
                  style={{ backgroundColor: p.color }}
                >
                  {p.avatar === 'superhero' ? (
                    <Shield className="w-5 h-5" />
                  ) : (
                    <Crown className="w-5 h-5" />
                  )}
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-extrabold text-xs sm:text-sm truncate text-white">
                    {p.name}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-0.5 text-amber-300">
                      <Trophy className="w-3 h-3 text-amber-400" /> {p.cups}
                    </span>
                    <span className="flex items-center gap-0.5 text-cyan-300">
                      <Target className="w-3 h-3 text-cyan-400" /> {p.remainingTurns}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Centered Workspace with 6x10 Board */}
      <div className="w-full max-w-4xl flex items-center justify-center">
        <Board />
      </div>

      {/* Right-side Settings Gear Dropdown Button */}
      <div className="fixed right-3 sm:right-6 top-4 sm:top-6 z-40">
        <SettingsMenu />
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={activeModal === 'exit'}
        title="Exit game?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={confirmExit}
        onCancel={closeModal}
      />

      <ConfirmModal
        isOpen={activeModal === 'replay'}
        title="Play again?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={confirmReplay}
        onCancel={closeModal}
      />
    </div>
  );
};
