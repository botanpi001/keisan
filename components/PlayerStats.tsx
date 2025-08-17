
import React from 'react';
import type { Player } from '../types';

interface PlayerStatsProps {
  player: Player;
  onSwitchPlayer: () => void;
}

const getRequiredExpForLevel = (level: number) => 50 + (level - 1) * 25;

const PlayerStats: React.FC<PlayerStatsProps> = ({ player, onSwitchPlayer }) => {
  const requiredExp = getRequiredExpForLevel(player.level);
  const expPercentage = Math.min((player.exp / requiredExp) * 100, 100);

  return (
    <div className="w-full max-w-md mx-auto bg-white/60 backdrop-blur-sm p-3 rounded-2xl shadow-md flex items-center gap-4 border border-white/50">
      <div className="text-5xl">{player.avatar}</div>
      <div className="flex-grow">
        <div className="flex justify-between items-baseline">
          <h3 className="text-xl font-bold text-brand-dark">{player.name}</h3>
          <p className="text-slate-600 font-semibold">
            Lv. <span className="text-2xl text-brand-primary">{player.level}</span>
          </p>
        </div>
        <div className="mt-1 w-full bg-slate-200 rounded-full h-3.5 shadow-inner">
          <div
            className="bg-gradient-to-r from-yellow-400 to-amber-500 h-3.5 rounded-full transition-all duration-500"
            style={{ width: `${expPercentage}%` }}
            aria-valuenow={player.exp}
            aria-valuemin={0}
            aria-valuemax={requiredExp}
          ></div>
        </div>
        <p className="text-xs text-right text-slate-500 mt-0.5">
          EXP: {player.exp} / {requiredExp}
        </p>
      </div>
      <button 
        onClick={onSwitchPlayer}
        className="self-start text-xs bg-slate-200 text-slate-600 hover:bg-slate-300 font-semibold px-2 py-1 rounded-md transition-colors"
        aria-label="プレイヤー選択にもどる"
      >
        きりかえ
      </button>
    </div>
  );
};

export default PlayerStats;
