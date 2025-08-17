import React from 'react';

interface NumberCardProps {
  value: number | string;
}

const NumberCard: React.FC<NumberCardProps> = ({ value }) => {
  return (
    <div className="flex items-center justify-center bg-white shadow-lg rounded-2xl w-24 h-32 md:w-32 md:h-40 lg:w-28 lg:h-36">
      <span className="text-brand-dark font-black text-6xl md:text-7xl lg:text-6xl">{value}</span>
    </div>
  );
};

export default NumberCard;
