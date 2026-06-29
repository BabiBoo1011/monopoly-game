import React from 'react';
import { motion } from 'framer-motion';
import { Player } from '../../types/game';
import { Shield, Crown } from 'lucide-react';

interface PlayerTokenProps {
  player: Player;
  row: number;
  col: number;
  isCurrentPlayer: boolean;
}

export const PlayerToken: React.FC<PlayerTokenProps> = ({ player, row, col, isCurrentPlayer }) => {
  return (
    <motion.div
      style={{ gridRow: `${row}`, gridColumn: `${col}` }}
      className="z-20 flex items-end justify-end pointer-events-none p-0.5 sm:p-1"
      initial={false}
      animate={{ scale: isCurrentPlayer ? [1, 1.15, 1] : 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25, repeat: isCurrentPlayer ? Infinity : 0, repeatDelay: 1 }}
    >
      <div
        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-xs sm:text-sm font-black transition-all ${
          isCurrentPlayer ? 'ring-4 ring-yellow-300 ring-offset-2 ring-offset-slate-900 z-30 scale-110' : 'opacity-90'
        }`}
        style={{ backgroundColor: player.color }}
        title={`${player.name} (${player.avatar})`}
      >
        {player.avatar === 'superhero' ? (
          <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        ) : (
          <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        )}
      </div>
    </motion.div>
  );
};
