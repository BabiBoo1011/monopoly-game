import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { motion } from 'framer-motion';

export const Dice: React.FC = () => {
  const { diceValue, isRolling } = useGameStore();

  const renderDots = (val: number | null) => {
    const value = val || 1;
    const dotElements: React.JSX.Element[] = [];

    const positions: Record<number, number[]> = {
      1: [5],
      2: [1, 9],
      3: [1, 5, 9],
      4: [1, 3, 7, 9],
      5: [1, 3, 5, 7, 9],
      6: [1, 3, 4, 6, 7, 9],
    };

    const activePositions = positions[value] || [5];

    for (let i = 1; i <= 9; i++) {
      const isActive = activePositions.includes(i);
      dotElements.push(
        <div key={i} className="flex items-center justify-center">
          {isActive && (
            <span
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                value === 1 ? 'bg-rose-600 w-3 h-3 sm:w-3.5 sm:h-3.5' : 'bg-slate-900'
              } shadow-inner`}
            />
          )}
        </div>
      );
    }

    return dotElements;
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <motion.div
        className="w-14 h-14 sm:w-18 sm:h-18 bg-gradient-to-br from-white to-slate-200 rounded-2xl border-3 border-slate-300 shadow-lg p-1.5 grid grid-cols-3 grid-rows-3 select-none"
        animate={isRolling ? { rotate: [0, 90, 180, 270, 360], scale: [1, 1.1, 1] } : { rotate: 0, scale: 1 }}
        transition={isRolling ? { repeat: Infinity, duration: 0.35, ease: 'linear' } : { duration: 0.2 }}
      >
        {renderDots(diceValue)}
      </motion.div>

      <span className="text-xs font-black text-amber-300 tracking-wide uppercase">
        {isRolling ? 'Rolling...' : diceValue ? `You got ${diceValue}` : 'Roll Dice!'}
      </span>
    </div>
  );
};
