
import React from 'react';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
}

const Firework: React.FC<{delay: string}> = ({delay}) => (
    <div className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-fireworks" style={{animationDelay: delay}}>
        {Array.from({length: 8}).map((_, i) => (
             <div 
                key={i} 
                className="absolute w-12 h-1 bg-gradient-to-r from-cyan-400 to-blue-500"
                style={{
                    transform: `rotate(${i * 45}deg)`,
                    animation: `spark 0.8s ease-in-out forwards`,
                    animationDelay: `calc(${delay} + 0.8s)`
                }}
            />
        ))}
    </div>
)

const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, onClose, level }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-pop-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="levelup-modal-title"
    >
      <div className="relative w-full h-full overflow-hidden">
        <Firework delay="0s" />
        <Firework delay="0.3s" />
        <Firework delay="0.6s" />
      </div>
      <div 
        className="absolute bg-white rounded-2xl shadow-2xl p-8 md:p-10 w-11/12 max-w-lg text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="levelup-modal-title" className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 mb-4">
          レベルアップ！
        </h2>
        <p className="text-lg md:text-xl text-slate-700 mb-6">
          おめでとう！ <span className="font-bold text-brand-primary text-3xl">レベル {level}</span> になった！
        </p>
        <button
          onClick={onClose}
          className="w-full bg-brand-primary text-white py-3 rounded-xl text-xl font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all duration-300 ease-in-out"
        >
          やったー！
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal;
