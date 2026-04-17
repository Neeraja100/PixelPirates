import { useState, useEffect } from "react";

export default function LandingPage({ onStart, onLogin }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Mouse tracking states
  const [constMouse, setConstMouse] = useState({ x: -1000, y: -1000 });
  const [constHovered, setConstHovered] = useState(false);

  const [ctaMouse, setCtaMouse] = useState({ x: -1000, y: -1000 });
  const [ctaHovered, setCtaHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleConstMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setConstMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleCtaMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCtaMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const faqs = [
    {
      q: "Is my bank data permanently stored?",
      a: "No. The Financial Mirror uses an ephemeral session architecture. Your data is analyzed in memory and vaporizes the moment your session concludes. We don't want your data."
    },
    {
      q: "How does the AI determine my persona?",
      a: "We pass your anonymized transaction patterns through our mathematical scoring engine, mapping frequency, discretionary ratios, and late-night impulses to define your unique financial 'constellation'."
    },
    {
      q: "Can I connect my bank account directly?",
      a: "Currently, we prioritize absolute privacy via manual entry, voice parsing, or CSV statement downloads to keep you completely off the grid."
    }
  ];

  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden selection:bg-[#8a2be2] selection:text-white" style={{ background: "#050505" }}>
      {/* Cinematic Ambient Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
         <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full mix-blend-screen opacity-20" style={{ background: "radial-gradient(circle, #8a2be2 0%, transparent 60%)", filter: "blur(120px)" }} />
         <div className="absolute top-[20%] right-[-20%] w-[60vw] h-[60vw] rounded-full mix-blend-screen opacity-10" style={{ background: "radial-gradient(circle, #080cff 0%, transparent 60%)", filter: "blur(140px)" }} />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 transition-all duration-300" style={{ 
          background: scrolled ? "rgba(5,5,5,0.85)" : "transparent", 
          backdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent"
      }}>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#8a2be2] to-[#080cff] flex items-center justify-center shadow-[0_0_15px_rgba(138,43,226,0.3)]">
             <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <span className="font-manrope text-white tracking-wide" style={{ fontSize: "1.1rem", fontWeight: 700 }}>
            The Financial Mirror
          </span>
        </div>
        <div className="flex items-center gap-8">
          <button 
             onClick={() => document.getElementById('faq-section').scrollIntoView({ behavior: 'smooth' })} 
             className="font-inter text-[#988ca0] hover:text-[#e5e2e1] transition-colors bg-transparent border-none cursor-pointer hidden md:block" 
             style={{ fontSize: "0.875rem", fontWeight: 500 }}
          >
            FAQ
          </button>
          <button 
             className="relative overflow-hidden group font-inter font-semibold rounded-full" 
             onClick={onLogin} 
             style={{ padding: "0.6rem 1.75rem", background: "#e5e2e1", color: "#050505", fontSize: "0.875rem" }}
          >
             <span className="relative z-10 transition-colors group-hover:text-white">Login / Sign Up</span>
             <div className="absolute inset-0 bg-gradient-to-r from-[#8a2be2] to-[#080cff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </nav>

      {/* Extreme Premium Hero */}
      <section className="relative z-10 flex flex-col items-center text-center pt-[20vh] pb-[10vh] px-4 min-h-[90vh] justify-center">
        <p className="font-inter text-[#ffb873] uppercase tracking-[0.2em] text-xs font-bold mb-6 fade-up">
           BEYOND TRADITIONAL TRACKING
        </p>
        <h1 className="font-manrope fade-up fade-up-1" style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
          See your money.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dcb8ff] via-[#8a2be2] to-[#080cff]">Understand your life.</span>
        </h1>
        <p className="font-inter fade-up fade-up-2 mt-8 text-[#988ca0]" style={{ fontSize: "1.125rem", maxWidth: "540px", lineHeight: 1.6, fontWeight: 400 }}>
          Elevate your financial consciousness. AI-powered introspection reveals the psychological patterns behind every transaction you make.
        </p>

        <div className="mt-16 fade-up fade-up-3 flex flex-col items-center gap-4">
            <button 
               onClick={onStart}
               className="relative group rounded-full font-manrope font-bold overflow-hidden shadow-[0_0_40px_rgba(138,43,226,0.3)] transition-all hover:scale-105"
               style={{ padding: "1.25rem 3rem", fontSize: "1.125rem", color: "#fff" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#8a2be2] to-[#080cff]" />
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Initialize Reflection</span>
            </button>
            <button 
               onClick={() => document.getElementById('features-section').scrollIntoView({ behavior: 'smooth' })}
               className="font-inter text-[#988ca0] hover:text-[#e5e2e1] transition-colors mt-4 bg-transparent border-none cursor-pointer flex items-center gap-2"
               style={{ fontSize: "0.875rem" }}
            >
               Explore Architecture <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>expand_more</span>
            </button>
        </div>
      </section>

      {/* Architecturally Beautiful Constellation Preview (MOUSE TRACKING ENABLED) */}
      <section className="relative z-10 py-[15vh] w-full flex flex-col items-center text-center border-y border-[rgba(255,255,255,0.03)] bg-[#0a0a0c]">
        <h2 className="font-manrope text-white mb-2" style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Financial <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dcb8ff] to-[#8a2be2]">Constellation</span></h2>
        <p className="font-inter text-[#988ca0] mb-20 max-w-lg text-sm mx-auto">Your spending patterns manifested into an interconnected psychological map.</p>
        
        {/* Sleek Node Graph Container */}
        <div 
          className="relative w-full max-w-4xl h-[450px] flex items-center justify-center mx-auto mt-8 group overflow-hidden rounded-3xl"
          onMouseMove={handleConstMove}
          onMouseEnter={() => setConstHovered(true)}
          onMouseLeave={() => setConstHovered(false)}
        >
           {/* Dynamic Mouse Tracker Glow Base! */}
           <div 
              className="absolute pointer-events-none transition-opacity duration-500 will-change-transform z-0" 
              style={{
                 width: "500px",
                 height: "500px",
                 left: constMouse.x - 250,
                 top: constMouse.y - 250,
                 background: "radial-gradient(circle, rgba(138,43,226,0.25) 0%, rgba(8,12,255,0.1) 40%, rgba(0,0,0,0) 70%)",
                 opacity: constHovered ? 1 : 0.2, // dim when cursor is outside
                 filter: "blur(60px)",
              }}
           />

           {/* Static center glow so it's never fully dark */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#8a2be2] opacity-5 filter blur-[100px] pointer-events-none" />

           {/* Curved elegant SVGs to nodes */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60 overflow-visible z-10">
             <defs>
                 <linearGradient id="fadeTop" x1="0" y1="1" x2="0" y2="0">
                     <stop offset="0%" stopColor="#8a2be2" stopOpacity="0" />
                     <stop offset="40%" stopColor="#8a2be2" stopOpacity="0" />
                     <stop offset="100%" stopColor="#dcb8ff" stopOpacity="0.8" />
                 </linearGradient>
                 <linearGradient id="fadeLeft" x1="1" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#8a2be2" stopOpacity="0" />
                     <stop offset="30%" stopColor="#8a2be2" stopOpacity="0" />
                     <stop offset="100%" stopColor="#080cff" stopOpacity="0.8" />
                 </linearGradient>
                 <linearGradient id="fadeRight" x1="0" y1="0" x2="1" y2="1">
                     <stop offset="0%" stopColor="#8a2be2" stopOpacity="0" />
                     <stop offset="30%" stopColor="#8a2be2" stopOpacity="0" />
                     <stop offset="100%" stopColor="#ffb873" stopOpacity="0.8" />
                 </linearGradient>
             </defs>
             {/* Center (50%, 50%) curving to nodes */}
             <path d="M 50% 50% Q 60% 30% 50% 12%" fill="none" stroke="url(#fadeTop)" strokeWidth="1.5" className="constellation-path" />
             <path d="M 50% 50% Q 35% 65% 20% 75%" fill="none" stroke="url(#fadeLeft)" strokeWidth="1.5" className="hidden sm:inline constellation-path" />
             <path d="M 50% 50% Q 65% 60% 80% 68%" fill="none" stroke="url(#fadeRight)" strokeWidth="1.5" className="hidden sm:inline constellation-path" />
           </svg>

           {/* Center Typography (Clean, no boxes) */}
           <div className="absolute z-20 flex flex-col items-center justify-center pointer-events-none" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
              <p className="font-inter text-[#ffb873] text-[0.65rem] tracking-[0.3em] font-bold mb-3 border border-[#ffb873]/30 px-3 py-1 rounded-full uppercase bg-[#ffb873]/5 drop-shadow-lg fade-up">Current Persona</p>
              <h3 className="font-manrope text-white text-center leading-[1.1] tracking-tight drop-shadow-2xl fade-up fade-up-1" style={{ fontSize: "2.75rem", fontWeight: 300 }}>
                 You are:<br/>
                 <strong className="text-transparent bg-clip-text bg-gradient-to-b from-white to-[#a69bb0] font-extrabold" style={{ fontSize: "3.5rem" }}>The Comfort Spender</strong>
              </h3>
           </div>

           {/* Animated 3D floating effect using the mouse trackers for node shifting */}
           {/* Top Node */}
           <div 
             className="absolute z-30 flex flex-col items-center gap-3 transition-transform duration-700 ease-out" 
             style={{ 
               top: "12%", left: "50%", 
               transform: `translate(calc(-50% - ${constHovered ? (constMouse.x - 450) * 0.02 : 0}px), calc(-50% - ${constHovered ? (constMouse.y - 225) * 0.02 : 0}px))` 
             }}
           >
               <div className="px-4 py-2 rounded-full border border-white/10 bg-[#060606] shadow-[0_4px_24px_rgba(0,0,0,0.8)] flex items-center gap-2 group-hover:border-white/20 transition-colors cursor-default">
                  <div className="w-2 h-2 rounded-full bg-[#dcb8ff] shadow-[0_0_10px_#dcb8ff]" />
                  <span className="font-inter text-[#dcb8ff] text-xs font-semibold tracking-wide">Dining & Environment</span>
               </div>
           </div>

           {/* Bottom Left Node */}
           <div 
             className="absolute z-30 hidden sm:flex flex-col items-center gap-3 transition-transform duration-700 ease-out" 
             style={{ 
                 top: "75%", left: "20%", 
                 transform: `translate(calc(-50% - ${constHovered ? (constMouse.x - 450) * 0.03 : 0}px), calc(-50% - ${constHovered ? (constMouse.y - 225) * 0.03 : 0}px))`
             }}
           >
               <div className="px-4 py-2 rounded-full border border-white/10 bg-[#060606] shadow-[0_4px_24px_rgba(0,0,0,0.8)] flex items-center gap-2 group-hover:border-white/20 transition-colors cursor-default">
                  <div className="w-2 h-2 rounded-full bg-[#080cff] shadow-[0_0_10px_#080cff]" />
                  <span className="font-inter text-[#8fa0ff] text-xs font-semibold tracking-wide">Midnight Impulses</span>
               </div>
           </div>

           {/* Bottom Right Node */}
           <div 
             className="absolute z-30 hidden sm:flex flex-col items-center gap-3 transition-transform duration-700 ease-out" 
             style={{ 
                 top: "68%", left: "80%", 
                 transform: `translate(calc(-50% + ${constHovered ? (constMouse.x - 450) * 0.04 : 0}px), calc(-50% - ${constHovered ? (constMouse.y - 225) * 0.02 : 0}px))` 
             }}
           >
               <div className="px-4 py-2 rounded-full border border-white/10 bg-[#060606] shadow-[0_4px_24px_rgba(0,0,0,0.8)] flex items-center gap-2 group-hover:border-white/20 transition-colors cursor-default">
                  <div className="w-2 h-2 rounded-full bg-[#ffb873] shadow-[0_0_10px_#ffb873]" />
                  <span className="font-inter text-[#ffb873] text-xs font-semibold tracking-wide">Freelance Income</span>
               </div>
           </div>
        </div>
      </section>

      {/* Deep Dive Grid (Features) */}
      <section id="features-section" className="relative z-10 px-6 sm:px-12 py-[15vh] max-w-7xl mx-auto w-full">
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
             <h2 className="font-manrope text-white leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
               The Anatomy of<br/><span className="text-[#8a2be2]">Your Ledger.</span>
             </h2>
           </div>
           <p className="font-inter text-[#988ca0] max-w-md" style={{ fontSize: "1rem", lineHeight: 1.6 }}>
              We transform unstructured transaction strings into stunning, high-fidelity visual insights. No spreadsheets. No line charts. Just pure cognitive clarity.
           </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
           
           {/* Big Heatmap Display */}
           <div className="relative rounded-3xl border border-white/5 bg-[#0a0a0c] p-8 sm:p-12 overflow-hidden group shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#8a2be2]/5 to-transparent pointer-events-none" />
               
               <div className="relative z-10">
                  <div className="flex justify-between items-center mb-10">
                      <div>
                         <p className="font-inter text-xs text-[#988ca0] font-bold tracking-widest uppercase mb-1">Density Heatmap</p>
                         <h3 className="font-manrope text-2xl text-white font-bold">$1,902,500 <span className="text-[#988ca0] text-lg font-normal">Analyzed</span></h3>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-white/10 bg-[#060606] flex flex-col items-center justify-center gap-1">
                         <div className="w-4 h-0.5 bg-[#dcb8ff] rounded-full" />
                         <div className="w-2 h-0.5 bg-[#dcb8ff] rounded-full" />
                      </div>
                  </div>

                  {/* Stunning mock heatmap grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(18px, 1fr))", gap: "6px" }}>
                       {Array.from({length: 60}).map((_, i) => {
                          const intensity = Math.random();
                          return (
                            <div key={i} className="aspect-square rounded-sm border border-white/5 transition-all duration-300 group-hover:scale-[1.02] cursor-default" 
                               style={{ 
                                  background: intensity > 0.8 ? "rgba(138,43,226,0.8)" : intensity > 0.5 ? "rgba(138,43,226,0.3)" : intensity > 0.2 ? "rgba(138,43,226,0.1)" : "rgba(255,255,255,0.02)",
                                  boxShadow: intensity > 0.8 ? "0 0 10px rgba(138,43,226,0.5)" : "none"
                               }} 
                            />
                          )
                       })}
                  </div>
               </div>
           </div>

           {/* Vertical feature stack */}
           <div className="flex flex-col gap-8">
               <div className="flex-1 rounded-3xl border border-white/5 bg-[#0a0a0c] p-8 relative overflow-hidden group shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                   <p className="font-inter text-xs text-[#988ca0] font-bold tracking-widest uppercase mb-6">Payment Methods</p>
                   <div className="flex items-center justify-center h-40">
                       {/* Sleek animated ring mock */}
                       <div className="relative w-32 h-32">
                           <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                              <circle cx="50" cy="50" r="45" fill="none" stroke="#080cff" strokeWidth="6" strokeDasharray="283" strokeDashoffset="60" className="opacity-80 drop-shadow-[0_0_8px_#080cff]" />
                           </svg>
                           <div className="absolute inset-0 flex flex-col items-center justify-center">
                               <span className="font-manrope text-2xl font-bold text-white">76%</span>
                               <span className="font-inter text-[0.6rem] text-[#988ca0]">DIGITAL</span>
                           </div>
                       </div>
                   </div>
               </div>
               
               {/* Features cards */}
               <div className="rounded-3xl border border-white/5 bg-gradient-to-b from-[#0a0a0c] to-[#050505] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                   <h4 className="font-manrope text-white font-bold mb-4">Input Flexibility</h4>
                   <div className="space-y-4">
                      <div className="flex items-center gap-4 text-[#988ca0] hover:text-white transition-colors cursor-pointer">
                         <span className="material-symbols-outlined shrink-0 text-[#8a2be2]">mic</span>
                         <div className="font-inter text-sm"><strong className="text-white">Voice Parsing.</strong> Speak your expenses.</div>
                      </div>
                      <div className="flex items-center gap-4 text-[#988ca0] hover:text-white transition-colors cursor-pointer">
                         <span className="material-symbols-outlined shrink-0 text-[#ffb873]">upload_file</span>
                         <div className="font-inter text-sm"><strong className="text-white">CSV Inject.</strong> Upload statements directly.</div>
                      </div>
                   </div>
               </div>
           </div>
        </div>
      </section>

      {/* High-end Trust Row */}
      <section className="relative z-10 py-16 border-y border-[rgba(255,255,255,0.05)] bg-[#050505]">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-[rgba(255,255,255,0.05)]">
               <div className="py-6 md:py-0 md:px-8 first:pl-0 last:pr-0">
                   <span className="material-symbols-outlined text-[#8a2be2] text-3xl mb-4">public_off</span>
                   <h4 className="font-manrope text-white font-bold mb-2">Ephemeral Sessions</h4>
                   <p className="font-inter text-[#988ca0] text-sm leading-relaxed">Financial data vaporizes immediately upon session closure. No backend storage.</p>
               </div>
               <div className="py-6 md:py-0 md:px-8 first:pl-0 last:pr-0">
                   <span className="material-symbols-outlined text-[#ffb873] text-3xl mb-4">fingerprint</span>
                   <h4 className="font-manrope text-white font-bold mb-2">Algorithmically Blind</h4>
                   <p className="font-inter text-[#988ca0] text-sm leading-relaxed">Identities are completely stripped. We only parse math and probability matrices.</p>
               </div>
               <div className="py-6 md:py-0 md:px-8 first:pl-0 last:pr-0">
                   <span className="material-symbols-outlined text-[#080cff] text-3xl mb-4">memory</span>
                   <h4 className="font-manrope text-white font-bold mb-2">On-Device Edge Processing</h4>
                   <p className="font-inter text-[#988ca0] text-sm leading-relaxed">The heavy lifting of file parsing runs safely within your local browser context.</p>
               </div>
          </div>
      </section>

      {/* Action / Final CTA Section (MOUSE TRACKING DYNAMIC LIGHTING / GRID) */}
      <section 
         className="relative z-10 py-[20vh] px-6 text-center flex flex-col items-center group/cta overflow-hidden w-full border-y border-[rgba(255,255,255,0.05)] bg-[#050505]"
         onMouseMove={handleCtaMove}
         onMouseEnter={() => setCtaHovered(true)}
         onMouseLeave={() => setCtaHovered(false)}
      >
         {/* Mouse-tracking deep background glow */}
         <div 
             className="absolute pointer-events-none transition-opacity duration-700 ease-in-out mix-blend-screen" 
             style={{
                 width: "800px",
                 height: "800px",
                 left: ctaMouse.x - 400,
                 top: ctaMouse.y - 400,
                 background: "radial-gradient(ellipse at center, rgba(138,43,226,0.2) 0%, rgba(8,12,255,0.1) 40%, transparent 70%)",
                 opacity: ctaHovered ? 1 : 0
             }}
         />
         
         {/* Grid overlay with dynamic mouse spotlight mask */}
         <div 
             className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-700"
             style={{ 
                 backgroundImage: "linear-gradient(to right, rgba(138,43,226,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(138,43,226,0.1) 1px, transparent 1px)", 
                 backgroundSize: "40px 40px",
                 WebkitMaskImage: `radial-gradient(400px circle at ${ctaMouse.x}px ${ctaMouse.y}px, black 10%, transparent 100%)`,
                 maskImage: `radial-gradient(400px circle at ${ctaMouse.x}px ${ctaMouse.y}px, black 10%, transparent 100%)`,
                 opacity: ctaHovered ? 1 : 0
             }} 
         />

         {/* Parallax moving inner icon container */}
         <div 
            className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8a2be2]/20 to-transparent border border-[#8a2be2]/30 flex items-center justify-center mb-8 rotate-12 shadow-[0_0_30px_rgba(138,43,226,0.2)] transition-transform duration-[400ms] ease-out group-hover/cta:scale-110"
            style={{ 
               transform: `rotate(12deg) scale(${ctaHovered ? 1.1 : 1}) translate(${(ctaMouse.x - 200) * 0.02}px, ${(ctaMouse.y - 100) * 0.02}px)`
            }}
          >
            <span className="material-symbols-outlined text-[#dcb8ff] text-2xl -rotate-12 transition-transform duration-500 group-hover/cta:-rotate-[24deg]">auto_awesome</span>
         </div>
         <h2 className="relative z-10 font-manrope text-white tracking-tight" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, lineHeight: 1.1 }}>
            Ready to face<br/>the Mirror?
         </h2>
         <p className="relative z-10 font-inter text-[#988ca0] mt-6 mb-12" style={{ fontSize: "1.125rem" }}>No sign-ups. No credit cards. Just raw data and pure clarity.</p>
         <button 
            onClick={onStart}
            className="group relative rounded-full font-manrope font-bold overflow-hidden shadow-[0_0_40px_rgba(138,43,226,0.3)] hover:shadow-[0_0_60px_rgba(138,43,226,0.5)] transition-all z-10"
            style={{ padding: "1.25rem 4rem", fontSize: "1.125rem", color: "#fff" }}
         >
            <div className="absolute inset-0 bg-gradient-to-r from-[#dcb8ff] to-[#8a2be2]" />
            <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-0 transition-opacity duration-500" />
            <span className="relative z-10 drop-shadow-md tracking-wide">Launch Engine</span>
         </button>
      </section>

      {/* Ultra-Clean FAQ Block */}
      <section id="faq-section" className="relative z-10 px-6 py-24 max-w-4xl mx-auto border-t border-[rgba(255,255,255,0.05)] w-full">
         <p className="font-inter text-[#8a2be2] font-bold text-sm tracking-widest uppercase mb-2">Knowledge Base</p>
         <h3 className="font-manrope text-white font-bold text-3xl mb-12">Frequently Asked Questions</h3>

         <div className="space-y-2">
            {faqs.map((faq, idx) => {
               const isOpen = openFaq === idx;
               return (
                 <div key={idx} className="rounded-2xl border border-[rgba(255,255,255,0.03)] bg-[#0a0a0c] overflow-hidden transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]" 
                      onClick={() => toggleFaq(idx)}
                 >
                    <div className="p-6 cursor-pointer flex justify-between items-center group">
                       <h4 className="font-manrope text-[#e5e2e1] group-hover:text-white transition-colors" style={{ fontSize: "1.125rem", fontWeight: 600 }}>{faq.q}</h4>
                       <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-white/10 transition-colors">
                          <span className="material-symbols-outlined text-[#988ca0]" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}>
                             expand_more
                          </span>
                       </div>
                    </div>
                    {/* Animated accordion body */}
                    <div className="grid transition-all duration-400 ease-in-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                       <div className="overflow-hidden">
                          <p className="font-inter text-[#988ca0] px-6 pb-6 pt-2 leading-relaxed" style={{ fontSize: "0.9375rem" }}>
                             {faq.a}
                          </p>
                       </div>
                    </div>
                 </div>
               )
            })}
         </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 py-10 border-t border-[rgba(255,255,255,0.05)] bg-[#020202]">
         <div className="mb-6 md:mb-0 flex items-center gap-3">
            <div className="w-5 h-5 rounded-[4px] bg-[#8a2be2]" />
            <span className="font-manrope text-white font-bold text-sm tracking-wide">THE FINANCIAL MIRROR</span>
         </div>
         <div className="flex flex-wrap justify-center gap-8 font-inter text-[#6c6175] text-xs font-semibold">
             <span className="cursor-pointer hover:text-white transition-colors tracking-wide uppercase">Privacy Protocol</span>
             <span className="cursor-pointer hover:text-white transition-colors tracking-wide uppercase">Terms of Service</span>
             <span className="cursor-pointer hover:text-white transition-colors tracking-wide uppercase">Security Architecture</span>
         </div>
      </footer>
    </main>
  );
}
