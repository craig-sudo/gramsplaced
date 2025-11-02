
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { CareCircle } from './components/CareCircle';
import { Projects } from './components/Projects';
import { PetBabyLog } from './components/PetBabyLog';
import { Vault } from './components/Vault';
import { Memories } from './components/Memories';
import { Login } from './components/Login';
import { Lunai } from './components/Lunai';
import { View, User, AppData, ChatMessage, MemoryItem } from './types';
import { mockAppData } from './data/mockData';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [appData, setAppData] = useState<AppData>(() => {
    try {
      const savedData = localStorage.getItem('gramsHouseHubData');
      return savedData ? JSON.parse(savedData) : mockAppData;
    } catch (error) {
      console.error('Error parsing data from localStorage', error);
      return mockAppData;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gramsHouseHubData', JSON.stringify(appData));
    } catch (error) {
      console.error('Error saving data to localStorage', error);
    }
  }, [appData]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView(View.Dashboard); // Reset to dashboard on logout
  };

  const handleSendMessage = (message: ChatMessage) => {
    setAppData(prevData => ({
      ...prevData,
      chatMessages: [...prevData.chatMessages, message]
    }));
  };

  const handleAddMemory = (memory: MemoryItem) => {
    setAppData(prevData => ({
        ...prevData,
        memories: [memory, ...prevData.memories]
    }));
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case View.Dashboard:
        return <Dashboard 
                  currentUser={currentUser}
                  calendarEvents={appData.calendarEvents}
                  project={appData.renovationProject}
                  shoppingList={appData.shoppingList}
                  wellnessLogs={appData.wellnessLogs}
                  hockeySchedule={appData.hockeySchedule}
               />;
      case View.CareCircle:
        return <CareCircle
                  currentUser={currentUser}
                  users={appData.users}
                  calendarEvents={appData.calendarEvents}
                  wellnessLogs={appData.wellnessLogs}
                  medications={appData.medications}
                  contacts={appData.contacts}
                  chatMessages={appData.chatMessages}
                  onSendMessage={handleSendMessage}
               />;
      case View.Projects:
        return <Projects
                  project={appData.renovationProject}
                  chores={appData.chores}
                  shoppingList={appData.shoppingList}
               />;
      case View.PetBabyLog:
        return <PetBabyLog
                  petLogs={appData.petLogs}
                  babyPrepTasks={appData.babyPrepTasks}
               />;
      case View.Vault:
        return <Vault />;
      case View.Memories:
        return <Memories
                  memories={appData.memories}
                  onAddMemory={handleAddMemory}
                  currentUser={currentUser}
               />;
      default:
        return <Dashboard 
                  currentUser={currentUser}
                  calendarEvents={appData.calendarEvents}
                  project={appData.renovationProject}
                  shoppingList={appData.shoppingList}
                  wellnessLogs={appData.wellnessLogs}
                  hockeySchedule={appData.hockeySchedule}
               />;
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
      <Lunai />
    </div>
  );
};

export default App;
