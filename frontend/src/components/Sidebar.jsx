import { Home, ShieldAlert, History, Settings as SettingsIcon, ExternalLink } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <div onClick={onClick} className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${active ? 'bg-primary/20 text-primary font-semibold shadow-[0_0_15px_rgba(137,180,250,0.2)]' : 'text-slate-400 hover:text-white hover:bg-surface'}`}>
    <Icon size={20} className={active ? 'text-primary' : ''} />
    <span className="text-sm">{label}</span>
  </div>
);

export const Sidebar = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="w-64 z-50 h-full bg-[#11111b]/80 backdrop-blur-3xl border-r border-white/5 p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-3 mb-12 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
            <ShieldAlert size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent tracking-wide">TruthLens</h1>
        </div>
        
        <div className="space-y-2">
          <SidebarItem icon={Home} label="Dashboard" active={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')} />
          <SidebarItem icon={History} label="History Log" active={currentPage === 'history'} onClick={() => setCurrentPage('history')} />
          <SidebarItem icon={SettingsIcon} label="Configuration" active={currentPage === 'settings'} onClick={() => setCurrentPage('settings')} />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-surface to-[#1e1e2e] border border-white/5 shadow-2xl">
          <p className="text-xs text-slate-400 mb-3">Live Chrome Extension</p>
          <button className="w-full py-2 bg-primary/10 text-primary text-xs font-semibold rounded-lg flex items-center justify-center space-x-2 hover:bg-primary/20 transition-all">
            <span>Installed</span>
            <ExternalLink size={14} />
          </button>
        </div>
        <div className="flex items-center space-x-3 px-2 pt-2">
          <div className="w-8 h-8 rounded-full bg-surface border border-white/10 flex items-center justify-center overflow-hidden">
             <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Aditya&backgroundColor=transparent" alt="User Avatar" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-200">Aditya</span>
            <span className="text-xs text-slate-500">Pro Tier</span>
          </div>
        </div>
      </div>
    </div>
  );
};
