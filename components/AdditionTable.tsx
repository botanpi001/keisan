import React from 'react';

const AdditionTable: React.FC = () => {
  const size = 9;
  const headers = Array.from({ length: size }, (_, i) => i + 1);

  return (
    <div className="w-full bg-white/70 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-2xl border border-white/50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-brand-primary">たし算ひょう</h2>
      </div>
      <p className="text-center text-slate-600 mb-4">1から9までの数字をたすと、答えがどうなるか見てみよう！</p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-center table-auto">
          <thead>
            <tr>
              <th className="p-2 w-12 border-b-2 border-r-2 border-brand-primary bg-brand-primary/20 sticky left-0 z-10">
                <span className="text-2xl font-bold text-brand-primary">+</span>
              </th>
              {headers.map(header => (
                <th key={`col-${header}`} className="p-2 w-16 border-b-2 border-brand-primary bg-brand-primary/10 font-bold text-brand-dark text-lg md:text-xl">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {headers.map(rowHeader => (
              <tr key={`row-${rowHeader}`} className="odd:bg-transparent even:bg-blue-50/50">
                <th className="p-2 w-12 border-r-2 border-brand-primary bg-brand-primary/20 font-bold text-brand-dark text-lg md:text-xl sticky left-0 z-10">
                  {rowHeader}
                </th>
                {headers.map(colHeader => {
                  const sum = rowHeader + colHeader;
                  return (
                    <td
                      key={`${rowHeader}-${colHeader}`}
                      className={`p-2 w-16 h-16 border border-slate-200 text-slate-800 font-bold text-2xl transition-colors bg-white/50`}
                    >
                      {sum}
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

export default AdditionTable;