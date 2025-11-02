
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { CareCircle } from './components/CareCircle';
import { Projects } from './components/Projects';
import { PetBabyLog } from './components/PetBabyLog';
import { Vault } from './components/Vault';
import { Memories } from './components/Memories';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);

  const renderView = () => {
    switch (currentView) {
      case View.Dashboard:
        return <Dashboard />;
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
        return <Dashboard />;
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen font-sans text-brand-text">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;