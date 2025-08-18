
import React from 'react';
import type { Stage } from '../types';
import { CheckCircleIcon, LockIcon, BookOpenIcon } from './IconComponents';

interface StageCardProps {
  stage: Stage;
  isActive: boolean;
  onSelect: (id: number) => void;
}

const StageCard: React.FC<StageCardProps> = ({ stage, isActive, onSelect }) => {
  const getStatusIcon = () => {
    if (stage.isCompleted) {
      return <CheckCircleIcon className="w-6 h-6 text-brand-secondary" />;
    }
    if (stage.isLocked) {
      return <LockIcon className="w-6 h-6 text-base-content-secondary" />;
    }
    return <div className={`w-6 h-6 rounded-full border-2 ${isActive ? 'border-brand-primary' : 'border-base-content-secondary'}`} />;
  };

  const cardClasses = `
    flex items-center p-4 rounded-xl border-2 transition-all duration-200
    ${stage.isLocked ? 'bg-base-200/50 cursor-not-allowed text-base-content-secondary' : 'cursor-pointer hover:bg-base-200'}
    ${isActive ? 'bg-base-200 border-brand-primary shadow-lg' : 'bg-base-200 border-transparent'}
  `;

  return (
    <div className={cardClasses} onClick={() => !stage.isLocked && onSelect(stage.id)}>
      <div className="flex-shrink-0 mr-4">
        {getStatusIcon()}
      </div>
      <div className="flex-grow">
        <h3 className={`font-bold ${isActive ? 'text-brand-primary' : ''}`}>{stage.id}. {stage.title}</h3>
        <p className="text-sm text-base-content-secondary">{stage.description}</p>
      </div>
    </div>
  );
};

export default StageCard;
