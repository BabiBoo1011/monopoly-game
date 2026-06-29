import React from 'react';

interface IconButtonWithTooltipProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
  variant?: 'danger' | 'success' | 'info' | 'warning' | 'default';
}

export const IconButtonWithTooltip: React.FC<IconButtonWithTooltipProps> = ({
  icon,
  label,
  onClick,
  className = '',
  variant = 'default',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/40';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/40';
      case 'info':
        return 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/40';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/40';
      case 'default':
      default:
        return 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-500';
    }
  };

  return (
    <div className="relative group flex items-center justify-center">
      <button
        onClick={onClick}
        aria-label={label}
        className={`p-3 rounded-2xl border-2 border-white shadow-lg active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-yellow-300 ${getVariantStyles()} ${className}`}
      >
        {icon}
      </button>

      {/* Tooltip visible on Hover or Focus */}
      <div className="absolute right-full mr-3 hidden group-hover:flex group-focus-within:flex items-center z-40 pointer-events-none animate-fade-in">
        <div className="bg-slate-900 text-white font-extrabold text-xs sm:text-sm px-3 py-1.5 rounded-xl border border-slate-700 shadow-xl whitespace-nowrap">
          {label}
        </div>
      </div>
    </div>
  );
};
