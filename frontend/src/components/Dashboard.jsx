import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Link as LinkIcon, FileText, Activity, Zap, AlertTriangle, ChevronRight, BarChart2, GitCompare, Download } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const PREVIEW_CARDS = [
  {
    title: "Global Markets Rally as Tech Stocks Surge 15%",
    url: "https://finance-news.com/tech-surge",
    score: 82,
    verdict: "Safe",
    source: "88/100"
  },
  {
    title: "Scientists Discover Secret Cure Hidden by Elites",
    url: "https://truth-seeker-daily.net/secret-cure",
    score: 12,
    verdict: "High Risk",
    source: "5/100"
  },
  {
    title: "Local Mayor Admits to 2018 Embezzlement Scandal",
    url: "https://citytribune.org/mayor-scandal",
    score: 64,
    verdict: "Questionable",
    source: "60/100"
  }
];

export const Dashboard = () => {
  const [input, setInput] = useState("");
  const [compareInput2, setCompareInput2] = useState("");
  const [mode, setMode] = useState("url"); 
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [compareResult, setCompareResult] = useState(null);
  const [error, setError] = useState("");
  const [latency, setLatency] = useState(0);

  const handleAnalyze = async (overrideInput = null) => {
    const targetInput = overrideInput || input;
    
    if (mode === 'compare' && (!targetInput.trim() || !compareInput2.trim())) {
        setError("Please provide two URLs to compare sources.");
        return;
    }
    if (mode !== 'compare' && !targetInput.trim()) return;
    
    setLoading(true);
    setError("");
    setResult(null);
    setCompareResult(null);
    if (overrideInput) setInput(overrideInput); 
    
    const startTime = Date.now();

    try {
      if (mode === 'compare') {
          // Concurrent Source Comparison Verification
          const [res1, res2] = await Promise.all([
             axios.post(`${API_URL}/analyze`, { url: targetInput }),
             axios.post(`${API_URL}/analyze`, { url: compareInput2 })
          ]);
          setResult(res1.data);
          setCompareResult(res2.data);
      } else {
          const payload = mode === "url" || overrideInput ? { url: targetInput } : { text: targetInput };
          const res = await axios.post(`${API_URL}/analyze`, payload);
          setResult(res.data);
      }
      setLatency(Date.now() - startTime);
    } catch (err) {
      if (err.response?.status === 429) {
         setError("Rate Limit Exceeded: You have surpassed 5 requests per minute. Please pause to protect AI tokens.");
      } else {
         setError(err.response?.data?.detail || err.response?.data?.error || "Failed to analyze. Please ensure the backend server is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (score) => {
      if (score >= 75) return { text: "text-success", bg: "bg-success/20", border: "border-success/30", shadow: "shadow-[0_0_20px_rgba(166,227,161,0.25)]" };
      if (score >= 50) return { text: "text-yellow-400", bg: "bg-yellow-400/20", border: "border-yellow-400/30", shadow: "shadow-[0_0_20px_rgba(250,204,21,0.25)]" };
      return { text: "text-accent", bg: "bg-accent/20", border: "border-accent/30", shadow: "shadow-[0_0_20px_rgba(243,139,168,0.25)]" };
  };

  const renderHighlightedText = (text, sensational, biased) => {
    if (!text) return null;
    let highlighted = text;
    (sensational || []).forEach(word => {
      if (!word || word.length < 3) return;
      const regex = new RegExp(`\\b(${word})\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<span class="bg-accent/30 text-accent font-black px-1.5 py-0.5 rounded shadow-sm border border-accent/40">$1</span>`);
    });
    (biased || []).forEach(word => {
      if (!word || word.length < 3) return;
      const regex = new RegExp(`\\b(${word})\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<span class="bg-yellow-400/30 text-yellow-400 font-black px-1.5 py-0.5 rounded shadow-sm border border-yellow-400/40">$1</span>`);
    });
    return <div dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-transparent relative flex flex-col items-center pt-12 px-6 pb-16 custom-scrollbar print-area">
      
      <div className="absolute top-6 right-8 flex items-center space-x-4 no-print">
          {latency > 0 && <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">{latency}ms ping</span>}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(166,227,161,0.2)]">
             <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
             <span>AI Active</span>
          </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-4xl w-full flex flex-col items-center text-center mb-10 mt-6 no-print"
      >
         <h2 className="text-5xl font-extrabold tracking-tight text-white mb-5">
            Verify the Truth in <span className="text-primary drop-shadow-[0_0_15px_rgba(137,180,250,0.4)]">Real-Time.</span>
         </h2>
         <p className="text-slate-400 text-lg max-w-2xl mb-12 leading-relaxed font-light">
           Paste an article URL, raw text, or compare two opposing sources. Detect sensationalism and uncover implicit bias instantly with Groq Llama-3.
         </p>

         <div className="w-full bg-surface/60 p-3 rounded-[2rem] backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative transition-all duration-300 focus-within:border-primary/50 focus-within:bg-surface/80 focus-within:shadow-[0_0_50px_rgba(137,180,250,0.15)] group">
            
            <div className="flex items-center space-x-2 mb-2 px-4 pt-2">
              <button onClick={() => setMode("url")} className={`text-[11px] px-4 py-2 rounded-[14px] font-extrabold tracking-wide uppercase transition-all flex items-center space-x-2 ${mode === 'url' ? 'bg-primary/20 text-primary shadow-inner border border-primary/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'}`}>
                 <LinkIcon size={14}/> <span>URL</span>
              </button>
              <button onClick={() => setMode("text")} className={`text-[11px] px-4 py-2 rounded-[14px] font-extrabold tracking-wide uppercase transition-all flex items-center space-x-2 ${mode === 'text' ? 'bg-primary/20 text-primary shadow-inner border border-primary/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'}`}>
                 <FileText size={14}/> <span>Raw Snippet</span>
              </button>
              <button onClick={() => setMode("compare")} className={`text-[11px] px-4 py-2 rounded-[14px] font-extrabold tracking-wide uppercase transition-all flex items-center space-x-2 ${mode === 'compare' ? 'bg-accent/20 text-accent shadow-inner border border-accent/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'}`}>
                 <GitCompare size={14}/> <span>Compare Sources</span>
              </button>
            </div>
            
            <div className="relative flex flex-col bg-black/40 rounded-[1.25rem] overflow-hidden border border-white/5 group-focus-within:border-primary/30 transition-colors">
              <div className="flex items-center relative w-full border-b border-white/5">
                  <div className="absolute left-6 text-slate-500 group-focus-within:text-primary transition-colors">
                     {mode === 'url' ? <Search size={22} /> : mode === 'text' ? <FileText size={22} /> : <LinkIcon size={22} />}
                  </div>
                  <input 
                    type="text" 
                    placeholder={mode === 'url' ? "https://news-outlet.com/article..." : mode === 'compare' ? "Source 1 URL (e.g., bbc.com/news...)" : "Paste paragraph content here..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                    className="w-full bg-transparent border-none outline-none text-white pl-16 pr-52 py-6 placeholder:text-slate-600 font-medium text-[15px]"
                  />
              </div>

              {mode === 'compare' && (
                  <div className="flex items-center relative w-full bg-black/20">
                      <div className="absolute left-6 text-slate-500 group-focus-within:text-accent transition-colors">
                         <GitCompare size={22} />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Source 2 URL (e.g., opposing-view.com/article...)"
                        value={compareInput2}
                        onChange={(e) => setCompareInput2(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                        className="w-full bg-transparent border-none outline-none text-white pl-16 pr-52 py-6 placeholder:text-slate-600 font-medium text-[15px]"
                      />
                  </div>
              )}

              <button 
                onClick={() => handleAnalyze()}
                disabled={loading || !input || (mode === 'compare' && !compareInput2)}
                className={`absolute right-2 top-2 bottom-2 px-7 bg-gradient-to-r ${mode === 'compare' ? 'from-accent to-[#db7d97]' : 'from-primary to-accent'} text-[#11111b] font-black rounded-[0.85rem] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl active:scale-95 min-w-[180px] z-10 my-1`}
              >
                {loading ? <Loader2 className="animate-spin text-[#11111b]" size={20} /> : (
                   <>
                     <Zap size={18} fill="currentColor" />
                     <span>Analyze with AI</span>
                   </>
                )}
              </button>
            </div>
         </div>
         {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-accent text-sm mt-6 font-bold bg-accent/10 border border-accent/20 px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg">
               <AlertTriangle size={16} />
               {error}
            </motion.div>
         )}
      </motion.div>

      <AnimatePresence mode="wait">
        {!result && !loading && mode !== 'compare' ? (
          <motion.div 
            key="previews"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
            className="max-w-4xl w-full no-print"
          >
             <div className="flex items-center gap-2 mb-6 px-2">
                <BarChart2 size={16} className="text-primary"/>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Live Document Previews</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {PREVIEW_CARDS.map((card, idx) => (
                   <motion.div 
                     key={idx}
                     whileHover={{ y: -6, scale: 1.02 }}
                     onClick={() => { setMode('url'); handleAnalyze(card.url); }}
                     className="bg-surface/30 hover:bg-surface/50 cursor-pointer backdrop-blur-xl border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300 shadow-xl group flex flex-col justify-between h-[11rem]"
                   >
                      <h4 className="text-white text-[15px] font-bold leading-snug line-clamp-3 group-hover:text-primary transition-colors">{card.title}</h4>
                      <div className="flex justify-between items-end mt-4">
                         <div>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg mb-2 inline-block shadow-inner ${card.verdict === 'Safe' ? 'bg-success/20 text-success' : card.verdict === 'Questionable' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-accent/20 text-accent'}`}>
                               {card.verdict}
                            </span>
                            <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide">Trust: {card.source}</div>
                         </div>
                         <div className={`text-3xl font-black ${card.score >= 75 ? 'text-success' : card.score >= 50 ? 'text-yellow-400' : 'text-accent'}`}>{card.score}</div>
                      </div>
                   </motion.div>
                ))}
             </div>
          </motion.div>
        ) : null}

        {result && !loading && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="max-w-5xl w-full"
          >
            {mode === 'compare' && compareResult ? (
                <div className="w-full bg-surface/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-2xl printable-card">
                   <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                      <GitCompare className="text-accent" size={28}/>
                      <h3 className="text-white text-3xl font-black">AI Source Comparison</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {[result, compareResult].map((res, i) => (
                           <div key={i} className={`p-6 rounded-2xl border ${getVerdictColor(res.credibility_score).bg} ${getVerdictColor(res.credibility_score).border} bg-opacity-10 shadow-lg relative overflow-hidden`}>
                               <div className="absolute top-4 right-4 text-4xl font-black opacity-10">0{i+1}</div>
                               <h4 className="text-white font-bold text-lg mb-4 pr-8 line-clamp-2">{res.title || "Anonymous Source"}</h4>
                               <div className="flex justify-between items-center mb-6">
                                  <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                     Score <span className={`text-2xl ml-2 ${getVerdictColor(res.credibility_score).text}`}>{Math.round(res.credibility_score)}</span>
                                  </div>
                                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getVerdictColor(res.credibility_score).border} ${getVerdictColor(res.credibility_score).text}`}>
                                     {res.ai_verdict}
                                  </div>
                               </div>
                               <div className="flex items-center gap-2 text-[10px] uppercase font-black text-slate-500 mb-2 mt-4"><Database size={12}/> AI Conclusion</div>
                               <p className="text-slate-300 text-sm leading-relaxed">{res.explanation}</p>
                           </div>
                       ))}
                   </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 printable-card">
                   <div className={`col-span-1 bg-surface/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl transition-all duration-500 hover:border-white/10 group ${getVerdictColor(result.credibility_score).shadow}`}>
                      <div className={`absolute top-[-20%] right-[-20%] w-32 h-32 rounded-full blur-[60px] pointer-events-none ${getVerdictColor(result.credibility_score).bg}`} />
                      
                      <h3 className="text-slate-400 text-[11px] font-extrabold tracking-widest uppercase mb-6 z-10 flex items-center gap-2">
                         <Activity size={16} className={getVerdictColor(result.credibility_score).text} /> Credibility Index
                      </h3>
                      
                      <div className="relative flex justify-center items-center mb-6 z-10 group-hover:scale-105 transition-transform duration-500">
                         <svg className="w-44 h-44 transform -rotate-90">
                           <circle cx="88" cy="88" r="76" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-black/30" />
                           <motion.circle 
                              initial={{ strokeDasharray: "0 1000" }}
                              animate={{ strokeDasharray: `${(result.credibility_score / 100) * 477.5} 1000` }}
                              transition={{ duration: 2, ease: "easeOut", delay: 0.1 }}
                              cx="88" cy="88" r="76" stroke="currentColor" strokeWidth="14" fill="transparent"
                              strokeLinecap="round"
                              className={`${getVerdictColor(result.credibility_score).text} drop-shadow-2xl`}
                           />
                         </svg>
                         <div className="absolute flex flex-col items-center">
                            <span className="text-6xl font-black text-white tracking-tighter drop-shadow-xl">{Math.round(result.credibility_score)}</span>
                            <span className="text-[11px] text-slate-500 uppercase font-black tracking-widest mt-1">/ 100</span>
                         </div>
                      </div>
                      
                      <div className={`px-7 py-2.5 rounded-full text-xs font-black uppercase tracking-widest z-10 border shadow-[0_4px_15px_rgba(0,0,0,0.5)] ${getVerdictColor(result.credibility_score).bg} ${getVerdictColor(result.credibility_score).text} ${getVerdictColor(result.credibility_score).border}`}>
                         {result.ai_verdict}
                      </div>
                   </div>

                   <div className="col-span-1 md:col-span-2 bg-surface/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 relative overflow-hidden shadow-2xl flex flex-col justify-center hover:border-white/10 transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-4">
                         <h3 className="text-white text-3xl font-black leading-tight drop-shadow-lg pr-4">{result.title || "Anonymous Text Target"}</h3>
                         <a href={result.url} target="_blank" rel="noreferrer" className="shrink-0 p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all shadow-md text-slate-400 hover:text-white hover:scale-105 no-print">
                            <ChevronRight size={22} />
                         </a>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mb-8 text-xs text-slate-500 font-extrabold uppercase tracking-widest">
                         {result.author && <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-500"/><span>{result.author}</span></span>}
                         {result.source_reliability > 0 && <span className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg shadow-inner"><div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"/><span>Domain Trust: <strong className="text-primary">{result.source_reliability}/100</strong></span></span>}
                      </div>

                      <div className="p-7 bg-black/40 rounded-2xl border border-white/5 shadow-inner relative overflow-hidden group">
                           <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-accent" />
                           <h4 className="text-[11px] text-primary font-black tracking-widest uppercase mb-4 flex items-center gap-2">
                               <Zap size={16}/> <span>Explainability Engine Highlights</span>
                           </h4>
                           <div className="text-slate-300 text-[16px] leading-[1.8] font-medium mb-6">
                              {renderHighlightedText(result.explanation, result.sensational_words, result.biased_words)}
                           </div>
                           <div className="flex gap-4">
                              {(result.sensational_words?.length > 0 || result.biased_words?.length > 0) && (
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                   <div className="w-2 h-2 rounded bg-accent"></div> <span>Sensational</span>
                                </div>
                              )}
                              {result.biased_words?.length > 0 && (
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                   <div className="w-2 h-2 rounded bg-yellow-400"></div> <span>Biased</span>
                                </div>
                              )}
                           </div>
                      </div>
                   </div>
                </div>
            )}
            
            <div className="mt-8 flex justify-center no-print">
               <button onClick={() => window.print()} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold text-sm flex items-center gap-3 transition-colors shadow-lg active:scale-95">
                  <Download size={18} /> Export PDF Report
               </button>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
