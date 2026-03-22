import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Shield, Database, LayoutTemplate } from 'lucide-react';

export const Settings = () => {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-transparent relative flex flex-col pt-24 px-10 pb-10 custom-scrollbar">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl w-full mx-auto">
        <h2 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
          <SettingsIcon size={36} className="text-primary" /> Configuration
        </h2>
        <p className="text-slate-400 font-light mb-12">Manage your core system preferences and Groq AI weighting strictness parameters.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-surface/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                 <Shield className="text-primary" size={24} />
                 <h3 className="text-white font-bold text-xl">AI Heuristics Strictness</h3>
              </div>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed font-light">Adjust how aggressively the Groq Llama-3 model flags sensationalism, loaded language, and unverified claims in analysis.</p>
              
              <div className="w-full bg-black/40 rounded-full h-3 mb-4 overflow-hidden border border-white/5 flex items-center">
                 <div className="bg-gradient-to-r from-primary to-accent h-full w-2/3 shadow-[0_0_15px_rgba(137,180,250,0.5)]"></div>
                 <div className="w-4 h-4 rounded-full bg-white shadow-lg -ml-2 cursor-pointer border border-slate-300"></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">
                 <span>Lenient</span>
                 <span className="text-primary drop-shadow-[0_0_5px_rgba(137,180,250,0.5)]">Balanced (Active)</span>
                 <span>Strict</span>
              </div>
           </div>

           <div className="bg-surface/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl hover:border-accent/20 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                 <Database className="text-accent" size={24} />
                 <h3 className="text-white font-bold text-xl">FastAPI Cache</h3>
              </div>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed font-light">Purge the backend Supabase cache. Evicting the cache forces the application to re-ping the Groq API endpoint dynamically for consecutive identical URL analyses.</p>
              
              <button className="w-full py-3.5 bg-black/20 hover:bg-accent/10 border border-white/5 hover:border-accent/40 hover:text-accent transition-all duration-300 rounded-xl text-sm text-white font-bold flex justify-center items-center gap-2 shadow-lg">
                 Evict Redis/Postgres Cache
              </button>
           </div>
           
           <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-primary/10 to-accent/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex items-center justify-between">
              <div>
                 <div className="flex items-center gap-3 mb-2">
                    <LayoutTemplate className="text-primary" size={20} />
                    <h3 className="text-white font-bold text-lg">Chrome Extension Integration</h3>
                 </div>
                 <p className="text-sm text-slate-300 font-light hidden md:block">Your live TruthLens Chrome Extension is autonomously mapped to this local architecture.</p>
              </div>
              <div>
                  <div className="px-5 py-2 bg-success/20 text-success border border-success/30 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(166,227,161,0.2)]">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div> Active Bridge
                  </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
