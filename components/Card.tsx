
import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center transition-transform transform hover:-translate-y-1">
      <div className={`p-4 rounded-full ${color}`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-lg font-semibold text-neutral-800">{value}</p>
        <p className="text-neutral-500">{title}</p>
      </div>
    </div>
  );
};

export default Card;
