import React from 'react';
import { BoardTile } from '../../types/game';
import { motion } from 'framer-motion';

interface TileProps {
  tile: BoardTile;
  isCurrent: boolean;
}

export const Tile: React.FC<TileProps> = ({ tile, isCurrent }) => {
  const getTileStyle = () => {
    switch (tile.type) {
      case 'start':
        return 'bg-green-500 border-green-300 text-white shadow-green-500/50';
      case 'cup_reward':
        if ((tile.value || 0) < 0) {
          return 'bg-rose-400 border-rose-200 text-rose-950 font-black shadow-rose-400/30';
        }
        if ((tile.value || 0) >= 10) {
          return 'bg-amber-400 border-yellow-200 text-amber-950 font-black shadow-amber-500/50';
        }
        return 'bg-yellow-300 border-yellow-100 text-yellow-950 font-black shadow-yellow-400/30';
      case 'move_forward':
        return 'bg-cyan-400 border-cyan-200 text-cyan-950 font-black shadow-cyan-400/40';
      case 'move_backward':
        return 'bg-rose-400 border-rose-200 text-rose-950 font-black shadow-rose-400/40';
      case 'go_to_start':
        return 'bg-purple-400 border-purple-200 text-purple-950 font-black shadow-purple-400/40';
      case 'empty':
      default:
        return 'bg-yellow-300 border-yellow-100 text-yellow-950 font-black shadow-yellow-400/30';
    }
  };

  return (
    <div
      style={{ gridRow: `${tile.row}`, gridColumn: `${tile.col}` }}
      className={`relative flex flex-col items-center justify-center p-1 rounded-xl sm:rounded-2xl border-2 sm:border-3 shadow-md transition-all duration-200 select-none overflow-hidden aspect-[1.35/1] ${getTileStyle()}`}
    >
      {/* Corner index number */}
      <span className="absolute top-0.5 left-1.5 text-[9px] sm:text-xs font-extrabold opacity-40">
        {tile.pathIndex}
      </span>

      {/* Render icon if available */}
      {tile.icon && (
        <div className="text-base sm:text-2xl drop-shadow-sm my-0.5">
          {tile.icon}
        </div>
      )}

      {/* Render clear step or cup label (e.g., → +3, ← -3, 🏆 +5) */}
      {tile.label && (
        <span className="text-xs sm:text-sm font-black leading-tight text-center truncate w-full px-0.5 tracking-tight">
          {tile.label}
        </span>
      )}

      {/* Active tile glow ring */}
      {isCurrent && (
        <motion.div
          layoutId="active-tile-glow"
          className="absolute inset-0 border-3 sm:border-4 border-yellow-400 rounded-xl sm:rounded-2xl shadow-[0_0_15px_rgba(250,204,21,0.9)] z-10 pointer-events-none"
          initial={false}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
    </div>
  );
};
