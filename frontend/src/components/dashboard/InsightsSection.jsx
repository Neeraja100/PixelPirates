import React from 'react';
import { motion } from 'framer-motion';

export default function InsightsSection({ personality, insights, onGenerate, loading }) {
  
  const defaultInsights = [
    "You spend more late at night.",
    "Food is your comfort category.",
    "You’re consistent with spending — that’s a strong foundation.",
    "Small recurring charges are silently draining your balance."
  ];

  const displayInsights = insights?.insights?.length > 0 ? insights.insights : defaultInsights;

  // Static cosmic coordinates to scatter the dots around the center
  const positions = [
    { top: "15%", left: "10%", align: "left" },
    { top: "65%", left: "15%", align: "left" },
    { top: "25%", left: "80%", align: "right" },
    { top: "75%", left: "85%", align: "right" },
    { top: "85%", left: "30%", align: "left" },
    { top: "10%", left: "65%", align: "right" },
  ];

  return (
    <div className="relative w-[100vw] min-h-screen flex flex-col items-center justify-center py-24 px-4 overflow-hidden left-1/2 -ml-[50vw]">
      
      {/* Background SVG connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="purpleLineGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8a2be2" />
            <stop offset="100%" stopColor="#080cff" />
          </linearGradient>
        </defs>
        <motion.path 
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          d="M 10% 15% L 65% 10% L 80% 25% L 85% 75% L 30% 85% L 15% 65% Z"
          fill="transparent"
          stroke="url(#purpleLineGrad)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          className="hidden md:block" // Lines only make sense on larger absolute layouts
        />
      </svg>

      {/* Central Personality Frame */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-2xl mx-auto text-center glass-card p-12 border border-purple-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-[inherit] pointer-events-none" />
        
        <p className="font-inter text-purple-400 uppercase tracking-[0.25em] text-sm mb-4 font-semibold">
          Your Financial Persona
        </p>
        
        <h1 className="text-4xl md:text-6xl font-manrope font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300 drop-shadow-md">
          {personality?.tag || "The Comfort Spender"}
        </h1>
        
        <p className="font-inter text-[#cfc2d7] text-lg leading-relaxed mb-8">
          {personality?.summary || "Your spending gravitates toward emotional anchors. You value immediate serenity and atmospheric quality over long-term rigid accumulation."}
        </p>

        <button 
          className="btn-primary relative overflow-hidden group" 
          onClick={onGenerate} 
          disabled={loading}
        >
          <span className="relative z-10">{loading ? "Realigning Stars..." : "Recalculate Persona"}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </motion.div>

      {/* Scattered Hover Nodes */}
      {displayInsights.map((text, index) => (
         <InsightHoverNode 
           key={index}
           text={text} 
           pos={positions[index % positions.length]} 
           delay={index * 0.15} 
         />
      ))}

    </div>
  );
}

function InsightHoverNode({ text, pos, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 15 }}
      className="absolute z-20 group cursor-crosshair hidden md:block" // Hidden on completely small mobile safely, or we could change positioning
      style={{ top: pos.top, left: pos.left }}
    >
      {/* Glowing Orbit Ring */}
      <motion.div 
        whileHover={{ scale: 1.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-400/40 shadow-[0_0_20px_rgba(138,43,226,0.3)] backdrop-blur-sm"
      >
        <div className="w-2.5 h-2.5 bg-purple-300 rounded-full shadow-[0_0_10px_#fff]" />
      </motion.div>

      {/* Floating Glass Tooltip - Smart Align */}
      <div 
        className={`absolute top-1/2 -translate-y-1/2 ${pos.align === 'right' ? 'right-full mr-4' : 'left-full ml-4'} w-64 p-5 glass-card border-white/15 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl z-50`}
      >
        <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#1a1a1a] border-white/15 rotate-45 transform origin-center ${pos.align === 'right' ? '-right-2 border-t border-r' : '-left-2 border-l border-b'}`} />
        <h4 className="text-purple-300 font-manrope font-semibold text-sm uppercase tracking-wider mb-2">Deep Insight</h4>
        <p className="text-sm text-[#e5e2e1] font-inter leading-relaxed shadow-sm relative z-10">{text}</p>
      </div>
    </motion.div>
  );
}
