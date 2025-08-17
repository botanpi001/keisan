
import React from 'react';

interface FeedbackDisplayProps {
  isCorrect: boolean | null;
  message: string;
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ isCorrect, message }) => {
  if (isCorrect === null) {
    return <div className="h-8"></div>;
  }

  const feedbackClasses = isCorrect
    ? 'text-brand-secondary bg-green-100'
    : 'text-red-600 bg-red-100';

  const Icon = isCorrect ? CheckIcon : XIcon;

  return (
    <div className={`flex items-center justify-center gap-2 p-2 rounded-lg animate-pop-in ${feedbackClasses}`}>
      <Icon className="w-6 h-6" />
      <span className="font-semibold">{message}</span>
    </div>
  );
};

export default FeedbackDisplay;
