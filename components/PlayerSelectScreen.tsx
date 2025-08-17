
import React, { useState } from 'react';
import type { Player } from '../types';

interface PlayerSelectScreenProps {
  players: Player[];
  onSelectPlayer: (id: number) => void;
  onUpdatePlayerName: (id: number, newName: string) => void;
}

const getRequiredExpForLevel = (level: number) => 50 + (level - 1) * 25;


const PlayerSelectScreen: React.FC<PlayerSelectScreenProps> = ({ players, onSelectPlayer, onUpdatePlayerName }) => {
    const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);
    const [newName, setNewName] = useState('');

    const handleStartEditing = (e: React.MouseEvent, player: Player) => {
        e.stopPropagation(); // Prevent the card's onSelectPlayer from firing
        setEditingPlayerId(player.id);
        setNewName(player.name);
    };

    const handleSaveName = (e: React.MouseEvent, playerId: number) => {
        e.stopPropagation();
        if (newName.trim()) {
            onUpdatePlayerName(playerId, newName.trim());
        }
        setEditingPlayerId(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent, playerId: number) => {
        if (e.key === 'Enter') {
          if (newName.trim()) {
              onUpdatePlayerName(playerId, newName.trim());
          }
          setEditingPlayerId(null);
        } else if (e.key === 'Escape') {
            setEditingPlayerId(null);
        }
    }

    const handleCardClick = (playerId: number) => {
        if (editingPlayerId !== playerId) {
            onSelectPlayer(playerId);
        }
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="text-center mb-8 animate-pop-in">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-primary mb-2">たし算マスター</h1>
        <p className="text-xl text-slate-700">だれがチャレンジする？</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 w-full max-w-4xl animate-swoop-in">
        {players.map(player => {
            const isEditing = editingPlayerId === player.id;
            const requiredExp = getRequiredExpForLevel(player.level);
            const expPercentage = Math.min((player.exp / requiredExp) * 100, 100);

            return (
                <div
                    key={player.id}
                    onClick={() => handleCardClick(player.id)}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 transform group border border-white/50 focus-within:ring-4 focus-within:ring-brand-primary/50"
                    role="button"
                    tabIndex={isEditing ? -1 : 0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(player.id); }}
                    aria-label={isEditing ? `${player.name} の名前を編集中` : `${player.name} をえらんでゲームをはじめる`}
                >
                    <div className="text-7xl mb-4 transition-transform duration-300 group-hover:scale-110">{player.avatar}</div>
                    
                    {isEditing ? (
                        <div className="flex flex-col items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, player.id)}
                                className="text-center text-xl font-bold p-2 rounded-md border-2 border-brand-primary w-full"
                                autoFocus
                                aria-label="新しい名前"
                            />
                            <button
                                onClick={(e) => handleSaveName(e, player.id)}
                                className="bg-brand-primary text-white font-semibold py-1 px-4 rounded-md hover:bg-indigo-700 transition-colors w-full"
                            >
                                ほぞん
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2">
                           <h3 className="text-2xl font-bold text-brand-dark">{player.name}</h3>
                           <button
                                onClick={(e) => handleStartEditing(e, player)}
                                className="p-1 rounded-full text-slate-400 hover:text-brand-primary hover:bg-slate-200/50 transition-colors"
                                aria-label={`${player.name} の名前をへんこう`}
                            >
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                               </svg>
                           </button>
                        </div>
                    )}

                    <div className="mt-2" aria-hidden="true">
                      <p className="text-slate-600 font-semibold">レベル: {player.level}</p>
                      <div className="mt-2 w-full bg-slate-200 rounded-full h-4 shadow-inner">
                          <div
                              className="bg-gradient-to-r from-yellow-400 to-amber-500 h-4 rounded-full transition-all duration-500"
                              style={{ width: `${expPercentage}%` }}
                          ></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                          あと <span className="font-bold">{Math.max(0, requiredExp - player.exp)}</span> EXPでレベルアップ
                      </p>
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  );
};

export default PlayerSelectScreen;
