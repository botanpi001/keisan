import React from 'react';

interface CongratsModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
}

const Firework: React.FC<{delay: string}> = ({delay}) => (
    <div className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-fireworks" style={{animationDelay: delay}}>
        {Array.from({length: 8}).map((_, i) => (
             <div 
                key={i} 
                className="absolute w-12 h-1 bg-gradient-to-r from-amber-400 to-red-500"
                style={{
                    transform: `rotate(${i * 45}deg)`,
                    animation: `spark 0.8s ease-in-out forwards`,
                    animationDelay: `calc(${delay} + 0.8s)`
                }}
            />
        ))}
    </div>
)

const CongratsModal: React.FC<CongratsModalProps> = ({ isOpen, onClose, score }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-pop-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="congrats-modal-title"
    >
      <div className="relative w-full h-full overflow-hidden">
        <Firework delay="0s" />
        <Firework delay="0.3s" />
        <Firework delay="0.6s" />
        <Firework delay="0.9s" />
      </div>
      <div 
        className="absolute bg-white rounded-2xl shadow-2xl p-8 md:p-10 w-11/12 max-w-lg text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="congrats-modal-title" className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-4">
          おめでとう！
        </h2>
        <p className="text-lg md:text-xl text-slate-700 mb-2">
          すごい！ <span className="font-bold text-brand-primary text-2xl">{score}問</span> 正解しました！
        </p>
        <p className="text-slate-600 mb-6">そのちょうしで、どんどんチャレンジしよう！</p>
        <button
          onClick={onClose}
          className="w-full bg-brand-primary text-white py-3 rounded-xl text-xl font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all duration-300 ease-in-out"
        >
          つぎへ
        </button>
      </div>
    </div>
  );
};

export default CongratsModal;
