import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, Search, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import axios from 'axios';

export const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
      const res = await axios.get(`${BASE_URL}/history`);
      setHistory(res.data || []);
      setError("");
    } catch (err) {
      if (err.response?.status === 429) {
          setError("Rate Limit Exceeded: Please wait before pulling the log history again.");
      } else {
          setError("Failed to fetch history logs from the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-transparent relative flex flex-col pt-24 px-10 pb-10 custom-scrollbar">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl w-full mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
              <HistoryIcon size={36} className="text-primary" /> Audit History
            </h2>
            <p className="text-slate-400 font-light">Review past credibility scans and AI verdicts retrieved seamlessly from Supabase/PostgreSQL.</p>
          </div>
          <button onClick={fetchHistory} className="flex items-center gap-2 px-5 py-2.5 bg-surface/50 hover:bg-surface border border-white/5 rounded-xl text-sm font-bold text-slate-300 transition-all shadow-lg hover:shadow-xl hover:text-white">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh Logs
          </button>
        </div>

        {error ? (
          <div className="bg-accent/10 border border-accent/20 text-accent font-semibold p-4 rounded-xl text-sm mb-6">{error}</div>
        ) : null}

        <div className="bg-surface/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#1e1e2e]/80 text-[10px] uppercase text-slate-500 font-extrabold tracking-widest border-b border-white/5">
                <tr>
                  <th className="px-8 py-5">Article Target</th>
                  <th className="px-8 py-5">Credibility Score</th>
                  <th className="px-8 py-5">AI Verdict</th>
                  <th className="px-8 py-5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading && history.length === 0 ? (
                  <tr><td colSpan="4" className="px-8 py-16 text-center text-slate-500"><Loader2 className="animate-spin mx-auto mb-3" size={32}/> Fetching encrypted logs...</td></tr>
                ) : history.length === 0 ? (
                  <tr><td colSpan="4" className="px-8 py-16 text-center text-slate-500 font-medium">No audits found in the vault. Scan a news article first!</td></tr>
                ) : (
                  history.map((log) => (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={log.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="px-8 py-5 font-medium text-white max-w-sm" title={log.title || log.url}>
                        <div className="line-clamp-1 mb-1.5 text-[13px]">{log.title || "Raw Text Snippet Extraction"}</div>
                        <a href={log.url} target="_blank" rel="noreferrer" className="text-[11px] font-semibold tracking-wide text-primary flex items-center gap-1.5 hover:text-accent transition-colors w-fit">
                          {log.url ? log.url.substring(0, 40) + "..." : "Local Anonymous Text"} <ExternalLink size={12} />
                        </a>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                           <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor] ${log.credibility_score >= 75 ? "bg-success text-success" : log.credibility_score >= 50 ? "bg-yellow-400 text-yellow-400" : "bg-accent text-accent"}`} />
                           <span className="font-extrabold text-white text-lg">{Math.round(log.credibility_score)}</span><span className="text-[10px] text-slate-500 font-bold tracking-wider">/100</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest ${log.ai_verdict === 'Safe' ? 'bg-success/10 text-success border border-success/20' : log.ai_verdict === 'Questionable' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' : 'bg-accent/10 text-accent border border-accent/20'}`}>
                          {log.ai_verdict}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-xs text-slate-500 font-medium tracking-wide">
                        {new Date(log.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
