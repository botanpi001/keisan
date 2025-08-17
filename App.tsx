
import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { getFunFact } from './services/geminiService';
import { playSound } from './services/soundService';
import { getPlayers, savePlayers, PLAYERS_STORAGE_KEY } from './services/playerService';
import NumberCard from './components/NumberCard';
import FeedbackDisplay from './components/FeedbackDisplay';
import VisualHint from './components/VisualHint';
import AdditionTable from './components/AdditionTable';
import GridDrill from './components/GridDrill';
import CongratsModal from './components/CongratsModal';
import LevelUpModal from './components/LevelUpModal';
import Numpad from './components/Numpad';
import PlayerSelectScreen from './components/PlayerSelectScreen';
import PlayerStats from './components/PlayerStats';
import type { Problem, Player } from './types';

type View = 'flashcards' | 'table' | 'gridDrill';
type Difficulty = 'easy' | 'medium' | 'hard' | 'bonus';

const difficultyLabels: Record<Difficulty, string> = {
  easy: 'かんたん',
  medium: 'ふつう',
  hard: 'むずかしい',
  bonus: 'おまけ',
};

const getExpForDifficulty = (difficulty: Difficulty): number => {
    switch (difficulty) {
        case 'medium': return 15;
        case 'hard': return 20;
        case 'bonus': return 25;
        case 'easy':
        default: return 10;
    }
}

const getRequiredExpForLevel = (level: number) => 50 + (level - 1) * 25;

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  
  const [view, setView] = useState<View>('flashcards');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [problem, setProblem] = useState<Problem>({ num1: 1, num2: 1 });
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [showCongratsModal, setShowCongratsModal] = useState<boolean>(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState<boolean>(false);
  const [funFact, setFunFact] = useState<string>('');
  const [isFactLoading, setIsFactLoading] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0); 
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSaveIndicator, setShowSaveIndicator] = useState<boolean>(false);

  useEffect(() => {
    setPlayers(getPlayers());
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === PLAYERS_STORAGE_KEY && e.newValue) {
            try {
                const updatedPlayers: Player[] = JSON.parse(e.newValue);
                setPlayers(updatedPlayers);

                if (currentPlayer) {
                    const updatedCurrentPlayer = updatedPlayers.find(p => p.id === currentPlayer.id);
                    if (updatedCurrentPlayer) {
                        setCurrentPlayer(updatedCurrentPlayer);
                    } else {
                        setCurrentPlayer(null);
                    }
                }
            } catch (error) {
                console.error("Error parsing players from storage event", error);
            }
        }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentPlayer]);

  useEffect(() => {
    if (players.length > 0) {
      savePlayers(players);
    }
  }, [players]);

  const handleSelectPlayer = (playerId: number) => {
    const selected = players.find(p => p.id === playerId);
    if (selected) {
        setCurrentPlayer(selected);
        generateNewProblem(true);
        setScore(0);
        setQuestionNumber(1);
    }
  };
  
  const handleUpdatePlayerName = (playerId: number, newName: string) => {
    if (!newName.trim()) return;
    const updatedPlayers = players.map(p => 
      p.id === playerId ? { ...p, name: newName.trim() } : p
    );
    setPlayers(updatedPlayers);
  };

  const handleSwitchPlayer = () => {
    setCurrentPlayer(null);
  };
  
  const generateNewProblem = useCallback((isNewSession = false) => {
    let newProblem: Problem;

    switch (difficulty) {
      case 'medium': 
        newProblem = { num1: Math.floor(Math.random() * 15) + 1, num2: Math.floor(Math.random() * 9) + 1 };
        if (Math.random() > 0.5) [newProblem.num1, newProblem.num2] = [newProblem.num2, newProblem.num1];
        break;
      case 'hard': 
        newProblem = { num1: Math.floor(Math.random() * 15) + 1, num2: Math.floor(Math.random() * 15) + 1 };
        break;
      case 'bonus':
        newProblem = { num1: Math.floor(Math.random() * 9) + 1, num2: Math.floor(Math.random() * 9) + 1, num3: Math.floor(Math.random() * 9) + 1 };
        break;
      case 'easy':
      default:
        newProblem = { num1: Math.floor(Math.random() * 9) + 1, num2: Math.floor(Math.random() * 9) + 1 };
        break;
    }

    setProblem(newProblem);
    setUserAnswer('');
    setIsCorrect(null);
    setMessage('');
    setFunFact('');
    setShowHint(false);
    setKey(prevKey => prevKey + 1);
    if(isNewSession) {
        setQuestionNumber(1);
    } else {
        setQuestionNumber(prev => prev + 1);
    }
  }, [difficulty]);
  
  useEffect(() => {
     if (currentPlayer) generateNewProblem(true);
  }, [difficulty, currentPlayer, generateNewProblem]);


  useEffect(() => {
    if (view === 'flashcards' && currentPlayer) {
      generateNewProblem(true);
    }
  }, [view, generateNewProblem, currentPlayer]);

  const handleFetchFunFact = useCallback(async () => {
    setIsFactLoading(true);
    setFunFact('');
    const fact = await getFunFact();
    setFunFact(fact);
    setIsFactLoading(false);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentPlayer || isCorrect) return;

    const answer = parseInt(userAnswer, 10);
    if (isNaN(answer)) {
      setMessage('すうじをいれてね！');
      setIsCorrect(false);
      return;
    }

    const correctAnswer = problem.num3 ? problem.num1 + problem.num2 + problem.num3 : problem.num1 + problem.num2;

    if (answer === correctAnswer) {
      playSound('correct');
      setMessage('せいかい！');
      setIsCorrect(true);
      const newScore = score + 1;
      setScore(newScore);
      handleFetchFunFact();
      
      const gainedExp = getExpForDifficulty(difficulty);
      let newExp = currentPlayer.exp + gainedExp;
      let newLevel = currentPlayer.level;
      let requiredExp = getRequiredExpForLevel(newLevel);
      let didLevelUp = false;

      while (newExp >= requiredExp) {
        newLevel++;
        newExp -= requiredExp;
        requiredExp = getRequiredExpForLevel(newLevel);
        didLevelUp = true;
      }
      
      const updatedPlayer = { ...currentPlayer, level: newLevel, exp: newExp };
      setCurrentPlayer(updatedPlayer);
      setPlayers(players.map(p => p.id === currentPlayer.id ? updatedPlayer : p));
      
      setShowSaveIndicator(true);
      setTimeout(() => setShowSaveIndicator(false), 2000);

      if (didLevelUp) {
        setTimeout(() => setShowLevelUpModal(true), 1000);
      } else if (newScore > 0 && newScore % 10 === 0) {
        setTimeout(() => setShowCongratsModal(true), 1000);
      }
    } else {
      playSound('incorrect');
      setMessage('ちがうよ！もういちど！');
      setIsCorrect(false);
      setUserAnswer('');
    }
  };

  const handleCloseCongratsModal = () => {
    setShowCongratsModal(false);
    generateNewProblem();
  }

  const handleCloseLevelUpModal = () => {
    setShowLevelUpModal(false);
    generateNewProblem();
  }

  const handleNumpadClick = (num: string) => {
    if (userAnswer.length >= 3) return; 
    setUserAnswer(prev => prev + num);
  };

  const handleDelete = () => {
    setUserAnswer(prev => prev.slice(0, -1));
  };

  if (!currentPlayer) {
    return <PlayerSelectScreen players={players} onSelectPlayer={handleSelectPlayer} onUpdatePlayerName={handleUpdatePlayerName} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 flex flex-col items-center p-4 font-sans text-brand-dark">
      <CongratsModal isOpen={showCongratsModal} onClose={handleCloseCongratsModal} score={score} />
      <LevelUpModal isOpen={showLevelUpModal} onClose={handleCloseLevelUpModal} level={currentPlayer.level} />
      
      <header className="text-center mb-4 w-full max-w-4xl relative">
        <PlayerStats player={currentPlayer} onSwitchPlayer={handleSwitchPlayer} />
        {showSaveIndicator && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 flex items-center gap-1 bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg animate-pop-in z-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>セーブしました</span>
          </div>
        )}
         <div className="mt-4 grid grid-cols-3 gap-1 rounded-xl bg-white/50 p-1 backdrop-blur-sm shadow-md max-w-lg mx-auto">
            <button
                onClick={() => setView('flashcards')}
                className={`px-4 py-2 rounded-lg text-sm md:text-lg font-semibold transition-all duration-300 ${view === 'flashcards' ? 'bg-white text-brand-primary shadow' : 'text-slate-600'}`}
            >
                フラッシュカード
            </button>
            <button
                onClick={() => setView('table')}
                className={`px-4 py-2 rounded-lg text-sm md:text-lg font-semibold transition-all duration-300 ${view === 'table' ? 'bg-white text-brand-primary shadow' : 'text-slate-600'}`}
            >
                たし算ひょう
            </button>
            <button
                onClick={() => setView('gridDrill')}
                className={`px-4 py-2 rounded-lg text-sm md:text-lg font-semibold transition-all duration-300 ${view === 'gridDrill' ? 'bg-white text-brand-primary shadow' : 'text-slate-600'}`}
            >
                81マス計算
            </button>
        </div>
      </header>
      
      <main className="w-full flex-grow flex items-center justify-center">
        {view === 'flashcards' ? (
          <div className="w-full max-w-7xl lg:grid lg:grid-cols-5 lg:gap-8 lg:items-start animate-pop-in">
            {/* Left Column */}
            <div className="lg:col-span-3 w-full max-w-2xl mx-auto lg:max-w-none bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-white/50">
              <div className="mb-6">
                  <h2 className="text-lg font-semibold text-center text-slate-700 mb-2">なんいどをえらんでね</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-xl bg-white/40 p-2 shadow-inner">
                      {(Object.keys(difficultyLabels) as Difficulty[]).map(level => (
                          <button
                              key={level}
                              onClick={() => setDifficulty(level)}
                              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${difficulty === level ? 'bg-white text-brand-primary shadow-md' : 'text-slate-600 hover:bg-white/70'}`}
                          >
                              {difficultyLabels[level]}
                          </button>
                      ))}
                  </div>
              </div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold">もんだい {questionNumber}</h2>
                <div className="bg-brand-primary text-white px-4 py-1 rounded-full text-lg font-bold shadow-md">
                  スコア: {score}
                </div>
              </div>

              {/* Problem Display */}
              <div key={key} className="flex justify-center items-center gap-2 md:gap-4 lg:gap-2 animate-swoop-in">
                <NumberCard value={problem.num1} />
                <span className="text-5xl md:text-6xl font-bold text-slate-500">+</span>
                <NumberCard value={problem.num2} />
                {problem.num3 !== undefined && (
                  <>
                    <span className="text-5xl md:text-6xl font-bold text-slate-500">+</span>
                    <NumberCard value={problem.num3} />
                  </>
                )}
              </div>
              
              {/* Hint Section */}
              <div className="mt-6 mb-4 w-full min-h-[4.5rem] flex items-center justify-center">
                {showHint ? (
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50 text-center w-full animate-pop-in">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-yellow-600 text-lg">💡 ヒント 💡</h3>
                        <button 
                          onClick={() => setShowHint(false)} 
                          className="text-sm font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-md hover:bg-slate-200/50 transition-colors"
                          aria-label="ヒントを閉じる"
                        >
                          とじる
                        </button>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">青いグループはタップかドラッグ、他の色の四角はダブルクリックかドラッグで移動できるよ！</p>
                      <VisualHint num1={problem.num1} num2={problem.num2} num3={problem.num3} key={key} />
                    </div>
                ) : (
                  <button
                      onClick={() => setShowHint(true)}
                      className="bg-yellow-400 text-yellow-900 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-yellow-500 transition-all active:scale-95 transform hover:scale-105"
                      aria-label="ヒントを見る"
                  >
                      💡 ヒントをみる
                  </button>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 w-full max-w-sm mx-auto mt-8 lg:mt-0">
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/50">
                    <form onSubmit={handleSubmit} className="w-full">
                      <div className="flex items-center justify-center gap-4">
                        <span className="text-6xl font-bold text-slate-500">=</span>
                        <div className="flex items-center justify-center w-32 md:w-40 h-20 text-center text-5xl font-bold bg-white border-2 border-gray-300 rounded-xl shadow-inner relative">
                          <span className="text-slate-700 tracking-wider">{userAnswer}</span>
                          {userAnswer.length === 0 && <span className="text-gray-300 absolute">?</span>}
                        </div>
                      </div>

                      <Numpad 
                        onNumberClick={handleNumpadClick}
                        onDelete={handleDelete}
                        disabled={isCorrect === true}
                      />

                      <div className="mt-4 h-8 flex items-center justify-center">
                         <FeedbackDisplay isCorrect={isCorrect} message={message} />
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-4 bg-brand-primary text-white py-4 rounded-xl text-2xl font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={isCorrect === true || userAnswer === ''}
                      >
                        こたえあわせ
                      </button>
                    </form>
                     <button
                        onClick={() => generateNewProblem()}
                        className="w-full mt-4 bg-brand-secondary text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:bg-emerald-600 active:scale-95 transition-all duration-300 ease-in-out"
                      >
                        つぎのもんだい
                      </button>
                </div>
                {/* Fun Fact Section */}
                <footer className="mt-4 w-full h-28">
                  {(isFactLoading || funFact) && (
                      <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50 animate-pop-in text-center">
                        <h3 className="font-bold text-brand-primary mb-2">✨ すごいね！豆知識 ✨</h3>
                        {isFactLoading ? (
                           <div className="flex justify-center items-center gap-2 text-slate-500">
                              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                              <span>豆知識をさがしているよ...</span>
                           </div>
                        ) : (
                          <p className="text-slate-700">{funFact}</p>
                        )}
                      </div>
                  )}
                </footer>
            </div>
          </div>
        ) : view === 'table' ? (
          <div className="w-full max-w-4xl flex justify-center animate-pop-in">
            <AdditionTable />
          </div>
        ) : (
           <div className="w-full max-w-4xl flex justify-center animate-pop-in">
            <GridDrill />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;