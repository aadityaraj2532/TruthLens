import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { Settings } from './components/Settings';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="flex h-screen w-full bg-[#11111b] overflow-hidden selection:bg-primary/30 selection:text-white font-sans">
      <div className="fixed top-[-30%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] pointer-events-none opacity-50" />
      <div className="fixed bottom-[-30%] right-[-10%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[150px] pointer-events-none opacity-50" />
      
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'history' && <History />}
      {currentPage === 'settings' && <Settings />}
    </div>
  );
}

export default App;
