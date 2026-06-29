import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

export const TileNotification: React.FC = () => {
  const { tileMessage } = useGameStore();

  return (
    <AnimatePresence>
      {tileMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="z-30 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/40 border-2 border-white text-center tracking-wide pointer-events-none drop-shadow"
        >
          {tileMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
