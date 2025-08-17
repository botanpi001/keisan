import React from 'react';

interface NumpadProps {
  onNumberClick: (number: string) => void;
  onDelete: () => void;
  disabled: boolean;
}

const NumpadButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled: boolean;
}> = ({ onClick, children, className = '', disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-3 md:p-4 lg:p-3 text-2xl md:text-3xl lg:text-2xl font-bold text-slate-700 hover:bg-white active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

const Numpad: React.FC<NumpadProps> = ({ onNumberClick, onDelete, disabled }) => {
  return (
    <div className="w-full max-w-xs mx-auto mt-6 lg:mt-4 grid grid-cols-3 gap-2 lg:gap-1.5">
      <NumpadButton onClick={() => onNumberClick('7')} disabled={disabled}>7</NumpadButton>
      <NumpadButton onClick={() => onNumberClick('8')} disabled={disabled}>8</NumpadButton>
      <NumpadButton onClick={() => onNumberClick('9')} disabled={disabled}>9</NumpadButton>
      <NumpadButton onClick={() => onNumberClick('4')} disabled={disabled}>4</NumpadButton>
      <NumpadButton onClick={() => onNumberClick('5')} disabled={disabled}>5</NumpadButton>
      <NumpadButton onClick={() => onNumberClick('6')} disabled={disabled}>6</NumpadButton>
      <NumpadButton onClick={() => onNumberClick('1')} disabled={disabled}>1</NumpadButton>
      <NumpadButton onClick={() => onNumberClick('2')} disabled={disabled}>2</NumpadButton>
      <NumpadButton onClick={() => onNumberClick('3')} disabled={disabled}>3</NumpadButton>
      <NumpadButton onClick={() => onNumberClick('0')} disabled={disabled} className="col-span-2">0</NumpadButton>
      <NumpadButton onClick={onDelete} disabled={disabled} className="text-xl flex items-center justify-center">
        けす
      </NumpadButton>
    </div>
  );
};

export default Numpad;
