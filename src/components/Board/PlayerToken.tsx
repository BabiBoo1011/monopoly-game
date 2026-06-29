import React from 'react';
import { motion } from 'framer-motion';

interface PlayerTokenProps {
  row: number;
  col: number;
}

export const PlayerToken: React.FC<PlayerTokenProps> = ({ row, col }) => {
  return (
    <motion.div
      style={{ gridRow: `${row}`, gridColumn: `${col}` }}
      className="z-20 flex items-end justify-end pointer-events-none p-1"
      initial={false}
      animate={{ scale: [1, 1.3, 1] }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    >
      {/* Positioned at bottom-right corner so it never covers center tile text */}
      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-white border-2 border-white shadow-lg shadow-black/70 flex items-center justify-center text-xs sm:text-base ring-2 ring-yellow-400/80">
        👑
      </div>
    </motion.div>
  );
};
