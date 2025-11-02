
import React from 'react';

interface CardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, icon, children, className }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 ${className}`}>
      <div className="p-4 bg-gray-50/50 border-b border-gray-200 flex items-center gap-3">
        {icon}
        <h3 className="text-lg text-brand-text tracking-wider">{title}</h3>
      </div>
      <div className="p-4 font-sans">
        {children}
      </div>
    </div>
  );
};
