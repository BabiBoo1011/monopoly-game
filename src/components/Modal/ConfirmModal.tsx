import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'No',
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            className="w-full max-w-xs bg-slate-900 border-4 border-slate-700 rounded-3xl p-6 text-center shadow-2xl flex flex-col items-center gap-4 text-white"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300">
              <HelpCircle className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-white">{title}</h2>
            {message && <p className="text-slate-300 font-medium text-sm">{message}</p>}

            <div className="flex items-center gap-3 w-full mt-2">
              <button
                onClick={onConfirm}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 border-2 border-white text-white font-black text-lg shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {confirmText}
              </button>
              <button
                onClick={onCancel}
                className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 border-2 border-slate-500 text-slate-200 font-bold text-lg shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                {cancelText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
