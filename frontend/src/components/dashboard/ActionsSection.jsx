import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ActionsSection({ actions }) {
  // If no backend actions provided, use dramatic mock actions
  const displayActions = actions?.length > 0 ? actions : [
    { problem: "Overdraft Risk: Projected to drop below $100 by the 24th.", action: "Pause your 'Entertainment' budget for the next 6 days to safely clear the month." },
    { problem: "Subscription Bloat: 3 unused services found.", action: "Cancel 'StreamCloud', 'FitPro App', and 'CloudStorage' to save $45/mo immediately." },
    { problem: "Cash SITTING idle: $2,400 in checking.", action: "Move $1,500 to your High-Yield Vault (5% APY) to earn $75 effortlessly this year." }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center">
      <div className="text-center mb-20 max-w-2xl">
        <h2 className="font-manrope font-bold text-4xl md:text-5xl mb-4 tracking-tight text-white">Small changes. Big difference.</h2>
        <p className="font-inter text-[#988ca0] text-lg">Flip the cards to reveal actionable steps uniquely tailored to your financial gravity.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 w-full">
        {displayActions.map((actionItem, index) => (
          <FlipCard key={index} item={actionItem} index={index} />
        ))}
      </div>
    </div>
  );
}

function FlipCard({ item, index }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="relative w-full h-[320px] cursor-pointer group perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-all duration-700"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front Face (Problem) */}
        <div className="absolute inset-0 backface-hidden flex flex-col p-8 glass-card border-red-500/20 hover:border-red-500/40">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none rounded-[inherit]" />
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-6 shrink-0">
            <AlertCircle size={24} />
          </div>
          <h3 className="font-inter font-semibold text-white text-lg leading-snug">
            {item.problem}
          </h3>
          <p className="mt-auto text-sm text-[#988ca0] font-inter uppercase tracking-widest flex items-center justify-between">
            Problem <span className="material-symbols-outlined text-sm">sync</span>
          </p>
        </div>

        {/* Back Face (Action) */}
        <div 
          className="absolute inset-0 backface-hidden flex flex-col p-8 glass-card border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.15)]"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent pointer-events-none rounded-[inherit]" />
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 mb-6 shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="font-inter font-semibold text-white text-lg leading-snug">
            {item.action}
          </h3>
          <p className="mt-auto text-sm text-green-400 font-inter uppercase tracking-widest">
            Action Revealed
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
