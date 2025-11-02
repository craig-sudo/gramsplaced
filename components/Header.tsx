
import React, { useState, useEffect } from 'react';
import { View, User } from '../types';
import { Icon } from './Icons';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  currentUser: User;
  onLogout: () => void;
}

const NavButton: React.FC<{
  view: View;
  currentView: View;
  onClick: (view: View) => void;
  iconName: string;
}> = ({ view, currentView, onClick, iconName }) => {
  const isActive = view === currentView;
  return (
    <button
      onClick={() => onClick(view)}
      className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-2 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-200 ${
        isActive ? 'bg-brand-primary/10 text-brand-primary' : ''
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon name={iconName} className="w-5 h-5" />
      <span className="text-xs md:text-sm font-sans font-medium normal-case tracking-normal">{view}</span>
    </button>
  );
};

const Clock: React.FC = () => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const dateString = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const timeString = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="text-center md:text-right font-sans">
            <p className="font-semibold text-lg text-brand-text tabular-nums normal-case">{timeString}</p>
            <p className="text-xs text-brand-subtle normal-case tracking-normal">{dateString}</p>
        </div>
    );
}


export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, currentUser, onLogout }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between py-2 gap-y-2">
          <div className="flex items-center gap-2">
            <Icon name="care" className="w-8 h-8 text-brand-primary" />
            <h1 className="text-2xl text-brand-text">Gram's House Hub</h1>
          </div>
          
          <div className="w-full md:w-auto md:flex md:items-center md:gap-4">
            <div className="flex justify-between items-center mb-2 md:mb-0">
                <div className="flex items-center gap-2">
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full"/>
                    <div className="font-sans">
                        <p className="text-sm text-brand-subtle normal-case tracking-normal">Signed in as</p>
                        <p className="font-bold text-brand-text normal-case tracking-normal">{currentUser.name}</p>
                    </div>
                </div>
                <button onClick={onLogout} className="md:hidden text-sm font-semibold text-brand-primary hover:underline transition-transform hover:scale-105">
                    Switch User
                </button>
            </div>
            <Clock />
             <button onClick={onLogout} className="hidden md:block text-sm font-semibold text-brand-primary hover:underline self-end transition-transform hover:scale-105">
                Switch User
             </button>
          </div>
        </div>

        <nav className="grid grid-cols-6 gap-1 w-full border-t border-gray-200 pt-2 mt-2">
            <NavButton view={View.Dashboard} currentView={currentView} onClick={setCurrentView} iconName="dashboard" />
            <NavButton view={View.CareCircle} currentView={currentView} onClick={setCurrentView} iconName="care" />
            <NavButton view={View.Projects} currentView={currentView} onClick={setCurrentView} iconName="projects" />
            <NavButton view={View.PetBabyLog} currentView={currentView} onClick={setCurrentView} iconName="pet" />
            <NavButton view={View.Vault} currentView={currentView} onClick={setCurrentView} iconName="vault" />
            <NavButton view={View.Memories} currentView={currentView} onClick={setCurrentView} iconName="memories" />
        </nav>
      </div>
    </header>
  );
};
