import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, MessageSquare, Menu, FileText, UploadCloud, Mic, X, CheckCircle, Lock } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import HeroSection from './dashboard/HeroSection';
import InputSection from './dashboard/InputSection';
import AnalyticsSection from './dashboard/AnalyticsSection';
import InsightsSection from './dashboard/InsightsSection';
import ActionsSection from './dashboard/ActionsSection';
import TransactionsSection from './dashboard/TransactionsSection';

export default function Dashboard({
  metrics,
  transactions,
  personality,
  insights,
  actions,
  loading,
  onGenerate,
  onRefine,
  onSaveTransactions,
  onDelete,
  onAddTransactions,
  onParseText,
  onUploadStatement
}) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showManageMenu, setShowManageMenu] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["dashboard", "analytics", "insights", "actions", "transactions"];
      let current = "dashboard";
      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          const rect = section.getBoundingClientRect();
          // If section top crosses viewport middle
          if (rect.top <= window.innerHeight / 2) {
            current = id;
          }
        }
      });
      setActiveTab(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80; // Offset for navbar height
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  
  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0e0e0e] text-[#e5e2e1] overflow-hidden" style={{ minHeight: "100vh" }}>
      
      {/* Dynamic Ambient Background glow - parallaxing with scroll */}
      <motion.div 
        className="pointer-events-none fixed z-0 rounded-full"
        style={{
          top: "-10%", left: "-5%", width: "800px", height: "800px",
          background: "radial-gradient(circle, rgba(138,43,226,0.12) 0%, transparent 60%)",
          filter: "blur(180px)",
          y: useTransform(scrollYProgress, [0, 1], [0, 400])
        }}
      />
      <motion.div 
        className="pointer-events-none fixed z-0 rounded-full"
        style={{
          bottom: "-20%", right: "-10%", width: "900px", height: "900px",
          background: "radial-gradient(circle, rgba(8,12,255,0.08) 0%, transparent 60%)",
          filter: "blur(160px)",
          y: useTransform(scrollYProgress, [0, 1], [0, -300])
        }}
      />

      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="font-manrope font-bold text-xl tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
          The Financial Mirror
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {["dashboard", "analytics", "insights", "actions", "transactions"].map((tab) => (
            <button
              key={tab}
              onClick={() => scrollTo(tab)}
              className={`font-inter text-sm capitalize transition-all duration-300 ${
                activeTab === tab 
                  ? "text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" 
                  : "text-[#988ca0] hover:text-[#dcb8ff]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowManageMenu(!showManageMenu)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-inter hover:bg-white/10 transition-colors"
          >
            Manage Data <Menu size={16} />
          </button>
          
          <AnimatePresence>
            {showManageMenu && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-12 right-0 w-56 glass-card p-2 border border-white/10 shadow-2xl flex flex-col items-start z-50"
              >
                <button 
                  onClick={() => {
                    setShowManageMenu(false);
                    onDelete();
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 font-inter text-sm transition-colors flex items-center gap-2"
                >
                   <X size={14} /> Delete Data Permanently
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Global Story Container */}
      <main className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Section 1: Hero */}
        <section id="dashboard" className="w-full min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-32">
          <HeroSection scrollYProgress={scrollYProgress} />
        </section>

        {/* Section 2: Input Cards && Section 3: Trust Bar */}
        <section className="w-full flex flex-col items-center justify-center pb-40">
          <InputSection 
            onAddTransactions={onAddTransactions}
            onParseText={onParseText}
            onUploadStatement={onUploadStatement}
            loading={loading}
          />
        </section>

        {/* Section 5: Analytics */}
        <section id="analytics" className="w-full py-32">
          <AnalyticsSection metrics={metrics} transactions={transactions} />
        </section>

        {/* Section 6: Insights (Constellation) */}
        <section id="insights" className="w-full py-40">
          <InsightsSection 
            personality={personality} 
            insights={insights} 
            onGenerate={onGenerate} 
            onRefine={onRefine} 
            loading={loading}
            transactions={transactions}
          />
        </section>

        {/* Section 7: Actions */}
        <section id="actions" className="w-full py-32">
          <ActionsSection actions={actions} onSaveTransactions={onSaveTransactions} loading={loading} />
        </section>

        {/* Section 8: Ledger / Transactions list */}
        <section id="transactions" className="w-full py-32">
          <TransactionsSection transactions={transactions} />
        </section>
      </main>

      {/* Global Elements: Security & Chatbot */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-black/60 border border-white/10 rounded-full backdrop-blur-md shadow-lg group"
          onClick={() => setShowSecurityModal(true)}
        >
          <Shield size={16} className="text-green-400 group-hover:drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
          <span className="text-xs font-inter font-medium text-white/80">Secure</span>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-[0_0_30px_rgba(138,43,226,0.3)] hover:shadow-[0_0_45px_rgba(138,43,226,0.5)] border border-white/20"
        >
          <MessageSquare size={24} className="text-white" />
        </motion.button>
      </div>

      {/* Security Modal */}
      <AnimatePresence>
        {showSecurityModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-xl bg-black/40"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg glass-card p-8 border border-green-500/20"
            >
               <button 
                 onClick={() => setShowSecurityModal(false)}
                 className="absolute top-4 right-4 text-[#cfc2d7] hover:text-white"
               >
                 <X size={20} />
               </button>

               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/30">
                    <Lock size={24} className="text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-manrope font-bold text-white">Trust & Security</h2>
                    <p className="text-green-400 font-inter text-sm">Protected by Financial Mirror</p>
                  </div>
               </div>

               <div className="flex flex-col gap-6">
                 <div className="flex items-start gap-4">
                    <CheckCircle size={20} className="text-green-400 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-manrope font-semibold text-white mb-1">Zero-Knowledge Architecture</h4>
                      <p className="text-sm font-inter text-[#988ca0]">We cannot see your raw transaction logs. Financial data is mathematically pooled to derive insights exclusively.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <CheckCircle size={20} className="text-green-400 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-manrope font-semibold text-white mb-1">Session-Bound Processing</h4>
                      <p className="text-sm font-inter text-[#988ca0]">The moment you hit "Delete Data", your entire profile is cryptographically wiped from local memory and our endpoints.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <CheckCircle size={20} className="text-green-400 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-manrope font-semibold text-white mb-1">Bank-Grade Encryption</h4>
                      <p className="text-sm font-inter text-[#988ca0]">Data payloads transition over strict TLS 1.3 tunnels with AES-GCM encryption layers protecting your anonymity.</p>
                    </div>
                 </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
