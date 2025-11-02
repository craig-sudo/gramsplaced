
import React from 'react';
import { User } from '../types';
import { familyUsers } from '../data/users';
import { Icon } from './Icons';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <Icon name="care" className="w-16 h-16 text-brand-primary mx-auto" />
        <h1 className="text-4xl text-brand-text mt-4 font-display">Welcome to Gram's House Hub</h1>
        <p className="text-lg text-brand-subtle mt-2 font-sans normal-case">Please select your profile to continue</p>
      </div>
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {familyUsers.map(user => (
            <button 
              key={user.id} 
              onClick={() => onLogin(user)}
              className="group flex flex-col items-center p-4 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-brand-primary focus:ring-opacity-50"
            >
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-24 h-24 rounded-full border-4 border-gray-200 group-hover:border-brand-primary transition-colors duration-300" 
              />
              <span className="mt-4 font-semibold text-brand-text text-lg font-sans normal-case">{user.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
