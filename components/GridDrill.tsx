import React, { useState, useCallback, useMemo } from 'react';

const shuffle = (array: number[]): number[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const initialNumbers = Array.from({ length: 9 }, (_, i) => i + 1);

const GridDrill: React.FC = () => {
  const [topNumbers, setTopNumbers] = useState(() => shuffle(initialNumbers));
  const [leftNumbers, setLeftNumbers] = useState(() => shuffle(initialNumbers));
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});

  const handleShuffle = useCallback(() => {
    setTopNumbers(shuffle(initialNumbers));
    setLeftNumbers(shuffle(initialNumbers));
    setInputs({});
    setResults({});
  }, []);
  
  const handleReset = useCallback(() => {
    setInputs({});
    setResults({});
  }, []);

  const handleInputChange = (row: number, col: number, value: string) => {
    const key = `${row}-${col}`;
    setInputs(prev => ({ ...prev, [key]: value }));

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      const isCorrect = leftNumbers[row] + topNumbers[col] === numValue;
      setResults(prev => ({ ...prev, [key]: isCorrect }));
    } else {
        // Clear result if input is cleared
        const newResults = {...results};
        delete newResults[key];
        setResults(newResults);
    }
  };
  
  const completedCount = useMemo(() => Object.values(results).filter(Boolean).length, [results]);
  const isAllCorrect = completedCount === 81;

  return (
    <div className="w-full bg-white/70 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-2xl border border-white/50">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold text-brand-primary">81マス計算ドリル</h2>
        <div className="flex gap-2">
          <button
            onClick={handleShuffle}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg font-semibold shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
          >
            シャッフル
          </button>
           <button
            onClick={handleReset}
            className="px-4 py-2 bg-brand-secondary text-white rounded-lg font-semibold shadow-md hover:bg-emerald-600 active:scale-95 transition-all"
          >
            リセット
          </button>
        </div>
      </div>
      <p className="text-center text-slate-600 mb-4">空いているマスに、左と上の数字をたした答えを入れよう！</p>
      
       {isAllCorrect && (
         <div className="p-4 mb-4 text-center bg-green-100 text-green-800 font-bold rounded-lg animate-pop-in">
           🎉 全部せいかい！おめでとう！ 🎉
         </div>
       )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-center table-fixed">
          <thead>
            <tr>
              <th className="p-1 w-12 h-12 md:w-16 md:h-16 border-b-2 border-r-2 border-brand-primary bg-brand-primary/20 sticky left-0 z-10">
                <span className="text-2xl font-bold text-brand-primary">+</span>
              </th>
              {topNumbers.map((header, index) => (
                <th key={`col-${index}`} className="p-1 w-12 h-12 md:w-16 md:h-16 border-b-2 border-brand-primary bg-brand-primary/10 font-bold text-brand-dark text-lg md:text-2xl">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leftNumbers.map((rowHeader, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="odd:bg-transparent even:bg-blue-50/50">
                <th className="p-1 w-12 h-12 md:w-16 md:h-16 border-r-2 border-brand-primary bg-brand-primary/20 font-bold text-brand-dark text-lg md:text-2xl sticky left-0 z-10">
                  {rowHeader}
                </th>
                {topNumbers.map((colHeader, colIndex) => {
                  const key = `${rowIndex}-${colIndex}`;
                  const result = results[key];
                  const value = inputs[key] || '';
                  
                  let inputBgClass = 'bg-white/80';
                  if (result === true) {
                      inputBgClass = 'bg-green-200/80 border-green-500';
                  } else if (result === false && value !== '') {
                      inputBgClass = 'bg-red-200/80 border-red-500';
                  }

                  return (
                    <td
                      key={key}
                      className={`p-0.5 md:p-1 border border-slate-200`}
                    >
                      <input 
                        type="number"
                        value={value}
                        onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                        className={`w-full h-full text-center text-lg md:text-2xl font-bold rounded-md transition-colors duration-300 shadow-inner focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary border-2 border-transparent ${inputBgClass}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GridDrill;
