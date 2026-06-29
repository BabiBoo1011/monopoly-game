import React from 'react';
import { boardTiles } from '../../data/boardTiles';
import { Tile } from './Tile';
import { Dice } from '../Dice/Dice';
import { TileNotification } from '../HUD/TileNotification';
import { useGameStore } from '../../store/gameStore';
import { Dices, Shield, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

export const Board: React.FC = () => {
  const { players, currentPlayerIndex, isRolling, isMoving, rollDice } = useGameStore();

  const curPlayer = players[currentPlayerIndex] || players[0];
  const isDisabled = isRolling || isMoving || (curPlayer && curPlayer.remainingTurns <= 0);

  return (
    <div className="flex flex-col items-start gap-2 w-full max-w-[900px]">
      {/* 1. TOP TURN BANNER */}
      <div className="w-full flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-4 py-1.5 rounded-2xl text-white font-black text-lg sm:text-2xl shadow-lg border-2 border-white/40"
            style={{ backgroundColor: curPlayer?.color || '#3b82f6' }}
          >
            {curPlayer?.avatar === 'superhero' ? (
              <Shield className="w-6 h-6" />
            ) : (
              <Crown className="w-6 h-6" />
            )}
            <span>{curPlayer ? `${curPlayer.name}'s Turn` : "Current Turn"}</span>
          </div>
        </div>

        {/* Floating Action Notification Popup */}
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
              isCurrent={curPlayer && tile.pathIndex === curPlayer.position}
            />
          ))}

          {/* Player Tokens grouped by tile grid cells */}
          {boardTiles.map((tile) => {
            const tilePlayers = players.filter((p) => p.position === tile.pathIndex);
            if (tilePlayers.length === 0) return null;

            return (
              <div
                key={`tokens-cell-${tile.id}`}
                style={{ gridRow: `${tile.row}`, gridColumn: `${tile.col}` }}
                className="z-20 flex flex-wrap items-start justify-end gap-0.5 p-1 pointer-events-none overflow-hidden"
              >
                {tilePlayers.map((p) => {
                  const pIdx = players.findIndex((pl) => pl.id === p.id);
                  const isCurrent = pIdx === currentPlayerIndex;
                  return (
                    <motion.div
                      key={p.id}
                      initial={false}
                      animate={{ scale: isCurrent ? [1, 1.15, 1] : 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 25,
                        repeat: isCurrent ? Infinity : 0,
                        repeatDelay: 1,
                      }}
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-white sm:border-2 shadow-md flex items-center justify-center text-white font-black transition-all ${
                        isCurrent
                          ? 'ring-2 sm:ring-3 ring-yellow-300 ring-offset-1 ring-offset-slate-900 z-30 scale-110 shadow-[0_0_10px_rgba(250,204,21,0.9)]'
                          : 'opacity-90'
                      }`}
                      style={{ backgroundColor: p.color }}
                      title={`${p.name} (P${pIdx + 1})`}
                    >
                      {p.avatar === 'superhero' ? (
                        <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      ) : (
                        <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            );
          })}

          {/* Center Panel (Grid area: cols 2..9, rows 2..5) */}
          <div
            style={{ gridColumn: '2 / 10', gridRow: '2 / 6' }}
            className="p-2 sm:p-4 flex flex-col justify-between items-center bg-slate-900/95 rounded-2xl border-2 border-slate-700/80 shadow-inner overflow-hidden z-0 text-center relative"
          >
            {/* Center Header */}
            <div className="w-full flex items-center justify-center bg-slate-800/90 py-1.5 px-3 rounded-xl border border-slate-700">
              <span className="text-xs sm:text-sm font-extrabold text-amber-300 uppercase tracking-wider">
                🏆 Cup Game Multiplayer 🏆
              </span>
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
                className={`w-full py-2 sm:py-2.5 px-4 rounded-xl border-2 sm:border-3 border-white font-black text-xs sm:text-base shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
