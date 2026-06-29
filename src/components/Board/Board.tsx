import React from 'react';
import { boardTiles } from '../../data/boardTiles';
import { Tile } from './Tile';
import { PlayerToken } from './PlayerToken';
import { Dice } from '../Dice/Dice';
import { TileNotification } from '../HUD/TileNotification';
import { useGameStore } from '../../store/gameStore';
import { Trophy, Target, Dices } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BoardProps {
  currentPosition: number;
}

export const Board: React.FC<BoardProps> = ({ currentPosition }) => {
  const currentTile = boardTiles[currentPosition] || boardTiles[0];
  const { cups, remainingTurns, isRolling, isMoving, rollDice, playerName } = useGameStore();

  const isDisabled = isRolling || isMoving || remainingTurns <= 0;

  return (
    <div className="flex flex-col items-start gap-2 w-full max-w-[900px]">
      {/* 1. WELCOME MESSAGE OUTSIDE THE BOARD (Top-Left aligned, Large Font) */}
      <div className="w-full flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl font-black text-amber-300 drop-shadow-md tracking-wide">
            Welcome {playerName || 'Player'}!
          </span>
        </div>

        {/* Floating Action Notification Popup Outside Board */}
        <div className="ml-auto z-30">
          <TileNotification />
        </div>
      </div>

      {/* 2. THE BOARD CONTAINER */}
      <div className="relative w-full p-2 sm:p-3 bg-slate-800 rounded-3xl border-4 border-slate-700 shadow-2xl overflow-hidden">
        <div className="w-full h-full grid grid-cols-10 grid-rows-6 gap-1 sm:gap-2 relative">
          {/* 28 Perimeter Rectangular Tiles */}
          {boardTiles.map((tile) => (
            <Tile
              key={tile.id}
              tile={tile}
              isCurrent={tile.pathIndex === currentPosition}
            />
          ))}

          {/* Player Token */}
          <PlayerToken row={currentTile.row} col={currentTile.col} />

          {/* Center Panel (Grid area: cols 2..9, rows 2..5) */}
          <div 
            style={{ gridColumn: '2 / 10', gridRow: '2 / 6' }}
            className="p-2 sm:p-4 flex flex-col justify-between items-center bg-slate-900/95 rounded-2xl border-2 border-slate-700/80 shadow-inner overflow-hidden z-0 text-center relative"
          >
            {/* Top Stats (Cups & Turns) */}
            <div className="w-full flex items-center justify-center gap-3 sm:gap-4 bg-slate-800/90 p-1.5 sm:p-2 rounded-xl border border-slate-700">
              <div className="flex items-center gap-1.5 bg-amber-500/20 px-3 py-1 rounded-lg border border-amber-500/40">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-amber-200 uppercase">Cups:</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={cups}
                    initial={{ scale: 1.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="text-sm sm:text-lg font-black text-amber-300 drop-shadow"
                  >
                    {cups}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-1.5 bg-cyan-500/20 px-3 py-1 rounded-lg border border-cyan-500/40">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-cyan-200 uppercase">Turns:</span>
                <span className="text-sm sm:text-lg font-black text-cyan-300 drop-shadow">
                  {remainingTurns}
                </span>
              </div>
            </div>

            {/* Middle Center: 3D Dice Showcase */}
            <div className="my-auto flex flex-col items-center justify-center py-0.5">
              <Dice />
            </div>

            {/* Bottom Center: Roll Dice Action Button */}
            <div className="w-full max-w-[260px] sm:max-w-[320px]">
              <button
                onClick={rollDice}
                disabled={isDisabled}
                className={`w-full py-2 sm:py-2.5 px-4 rounded-xl border-2 sm:border-3 border-white font-black text-xs sm:text-base shadow-lg flex items-center justify-center gap-2 transition-all ${
                  isDisabled
                    ? 'bg-slate-700 text-slate-400 border-slate-500 shadow-none opacity-60 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-amber-500/40 hover:brightness-110 active:translate-y-0.5'
                }`}
              >
                <Dices className={`w-4 h-4 sm:w-5 sm:h-5 ${isRolling ? 'animate-spin' : ''}`} />
                <span>{isRolling ? 'Rolling...' : isMoving ? 'Moving...' : 'Roll Dice'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
