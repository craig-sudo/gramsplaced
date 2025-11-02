
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { CareCircle } from './components/CareCircle';
import { Projects } from './components/Projects';
import { PetBabyLog } from './components/PetBabyLog';
import { Vault } from './components/Vault';
import { Memories } from './components/Memories';
import { Login } from './components/Login';
import { View, User } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView(View.Dashboard); // Reset to dashboard on logout
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case View.Dashboard:
        return <Dashboard currentUser={currentUser} />;
      case View.CareCircle:
        return <CareCircle />;
      case View.Projects:
        return <Projects />;
      case View.PetBabyLog:
        return <PetBabyLog />;
      case View.Vault:
        return <Vault />;
      case View.Memories:
        return <Memories />;
      default:
        return <Dashboard currentUser={currentUser} />;
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen font-display text-brand-text">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
