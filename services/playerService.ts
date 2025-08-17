
import type { Player } from '../types';

export const PLAYERS_STORAGE_KEY = 'additionMasterPlayers';

const initialPlayers: Player[] = [
  { id: 1, name: 'わんこ', level: 1, exp: 0, avatar: '🐶' },
  { id: 2, name: 'にゃんこ', level: 1, exp: 0, avatar: '🐱' },
  { id: 3, name: 'ぱんだ', level: 1, exp: 0, avatar: '🐼' },
];

export const getPlayers = (): Player[] => {
  try {
    const storedPlayers = localStorage.getItem(PLAYERS_STORAGE_KEY);
    if (storedPlayers) {
      const parsed = JSON.parse(storedPlayers);
      // Ensure all initial players exist, add if missing
      if (parsed.length < initialPlayers.length) {
         const missing = initialPlayers.filter(p => !parsed.some((sp: Player) => sp.id === p.id));
         const updatedPlayers = [...parsed, ...missing];
         savePlayers(updatedPlayers);
         return updatedPlayers;
      }
      return parsed;
    } else {
      savePlayers(initialPlayers);
      return initialPlayers;
    }
  } catch (error) {
    console.error('Error getting players from localStorage', error);
    return initialPlayers;
  }
};

export const savePlayers = (players: Player[]) => {
  try {
    localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(players));
  } catch (error) {
    console.error('Error saving players to localStorage', error);
  }
};