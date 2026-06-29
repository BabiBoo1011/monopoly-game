import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { History, Dices, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TurnHistory: React.FC = () => {
  const { history } = useGameStore();

  return (
    <div className="w-full flex-1 bg-slate-800/90 p-3 rounded-2xl border border-slate-700 flex flex-col gap-2 max-h-[220px] sm:max-h-[280px] overflow-hidden shadow-md">
      <div className="flex items-center gap-2 pb-1.5 border-b border-slate-700">
        <History className="w-4 h-4 text-amber-400" />
        <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">
          Game Log
        </h3>
        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
          {history.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-slate-600">
        {history.length === 0 ? (
          <div className="my-auto text-center py-4 text-slate-400 text-xs font-semibold">
            No turns yet. Press Roll Dice!
          </div>
        ) : (
          <AnimatePresence>
            {history.map((entry) => (
              <motion.div
                key={entry.turnNumber}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/90 p-2 rounded-xl border border-slate-700/80 flex flex-col gap-1 text-xs"
              >
                <div className="flex items-center justify-between font-bold text-slate-300">
                  <span className="text-amber-400">Turn #{entry.turnNumber}</span>
                  <div className="flex items-center gap-1 bg-slate-800 px-1.5 py-0.5 rounded text-[11px] text-slate-200">
                    <Dices className="w-3 h-3 text-cyan-400" />
                    <span>+{entry.diceValue}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <span>Tile {entry.fromPosition}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span className="text-slate-200 font-semibold">Tile {entry.toPosition}</span>
                  </div>

                  {entry.cupsDelta !== 0 && (
                    <span
                      className={`font-black px-1.5 py-0.5 rounded text-[10px] ${
                        entry.cupsDelta > 0
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {entry.cupsDelta > 0 ? `+${entry.cupsDelta}` : entry.cupsDelta} cups
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] pt-0.5 border-t border-slate-800">
                  <span className="text-cyan-300 font-semibold">{entry.effectDescription}</span>
                  <span className="text-slate-400 font-medium">
                    Total: <strong className="text-amber-300">{entry.totalCupsAfter}</strong> 🏆
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
