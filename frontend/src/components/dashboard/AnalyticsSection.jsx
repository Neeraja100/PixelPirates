import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Moon, Clock, Coffee, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { generateSpendingDensity, generatePaymentMethods, generateGhostSubscriptions } from '../../utils/simulatedData';

export default function AnalyticsSection({ metrics, transactions }) {
  const densityMap = generateSpendingDensity(transactions);
  const paymentMethods = generatePaymentMethods(metrics);
  const ghostSubs = generateGhostSubscriptions(transactions);

  return (
    <div className="w-full relative z-10 flex flex-col items-center">
      
      <SectionHeader title="Analytics" subtitle="Deep dive into your financial reality" />

      {/* WHEN - Heatmap */}
      <RevealBlock>
        <div className="w-full max-w-5xl px-6 grid md:grid-cols-2 gap-12 items-center mb-40">
          <div className="glass-card p-8">
            <p className="overline mb-6 text-purple-400">WHEN</p>
            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {densityMap.map((cell, i) => (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.01, ease: 'easeOut' }}
                  key={i} 
                  className="aspect-square rounded-[2px]"
                  style={{ 
                    background: cell.value > 80 ? "#8a2be2" : cell.value > 50 ? "rgba(138,43,226,0.6)" : cell.value > 20 ? "rgba(138,43,226,0.3)" : "rgba(76,67,84,0.15)" 
                  }} 
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-[#988ca0] uppercase tracking-widest font-inter">
              <span>Mon</span><span>Sun</span>
            </div>
          </div>
          <div>
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-4xl md:text-5xl font-manrope font-bold mb-4 text-[#e5e2e1]"
            >
              You spend most on <span className="text-purple-400">weekends</span>.
            </motion.h3>
            <p className="font-inter text-[#988ca0] text-lg">Thursday night sets the tone. By Sunday, 40% of your weekly budget is usually gone.</p>
          </div>
        </div>
      </RevealBlock>

      {/* WHAT - Horizontal Scroll Cards */}
      <RevealBlock>
        <div className="w-full mb-40 overflow-hidden px-6">
           <div className="max-w-5xl mx-auto flex flex-col md:flex-row-reverse gap-12 items-center">
             
             {/* Text right */}
             <div className="md:w-1/3">
                <p className="overline mb-4 text-blue-400">WHAT</p>
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="font-manrope font-bold text-4xl mb-4 text-[#e5e2e1]"
                >
                  <span className="text-blue-400">Food</span> quietly became your biggest expense.
                </motion.h3>
                <p className="font-inter text-[#988ca0] text-lg">Small 300Rs bites add up faster than your major bills.</p>
             </div>

             {/* Overflow cards left */}
             <div className="md:w-2/3 flex gap-4 w-full overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
                <CardItem icon={<Coffee size={24}/>} name="Dining & Coffee" amount="12,450" percent="34%" color="#080cff" />
                <CardItem icon={<ShoppingBag size={24}/>} name="Shopping" amount="8,200" percent="22%" color="#8a2be2" />
                <CardItem icon={<ArrowUpRight size={24}/>} name="Transfers" amount="5,000" percent="15%" color="#ffb873" />
             </div>
           </div>
        </div>
      </RevealBlock>

      {/* HOW - Donut & Behavior */}
      <RevealBlock>
        <div className="w-full max-w-5xl px-6 grid md:grid-cols-2 gap-12 items-center mb-32">
          
          <div className="glass-card p-10 flex flex-col items-center justify-center relative">
            <p className="overline mb-8 absolute top-8 left-8 text-orange-400">HOW</p>
            <div className="w-64 h-64 relative mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={paymentMethods} 
                    innerRadius={80} 
                    outerRadius={100} 
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                    {paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: "rgba(20,20,20,0.8)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    itemStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-manrope text-3xl font-bold">70%</span>
                <span className="text-xs uppercase tracking-widest text-[#988ca0]">UPI / Online</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <p className="overline mb-2 text-white/50">BEHAVIOR DETECTED</p>
            <div className="glass-card p-6 flex items-start gap-4 hover:border-purple-400/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                <Moon size={20} />
              </div>
              <div>
                <h4 className="font-manrope font-bold text-lg text-white mb-1">Late-night spending spike</h4>
                <p className="text-sm font-inter text-[#988ca0]">30% of your discretionary spending occurs after 10 PM.</p>
              </div>
            </div>

            <div className="glass-card p-6 hover:border-blue-400/30 transition-colors">
              <h4 className="font-manrope font-bold text-lg text-white mb-4 flex items-center gap-2">
                <Clock size={20} className="text-blue-400"/> Subscription Leaks
              </h4>
              <div className="space-y-3">
                {ghostSubs.map((sub, i) => (
                  <div key={i} className="flex justify-between items-center text-sm font-inter">
                    <span className="text-[#cfc2d7]">{sub.name}</span>
                    <span className="text-red-400">${Math.abs(sub.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </RevealBlock>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="text-center mb-24"
    >
      <h2 className="font-manrope font-bold text-5xl mb-4 tracking-tight">{title}</h2>
      <p className="font-inter text-[#988ca0] text-lg tracking-wide">{subtitle}</p>
    </motion.div>
  );
}

function RevealBlock({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-150px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

function CardItem({ icon, name, amount, percent, color }) {
  return (
    <div className="shrink-0 w-64 glass-card p-6 snap-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: color }} />
      <div className="mb-6 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative z-10" style={{ color: color }}>
        {icon}
      </div>
      <p className="font-inter text-xs text-[#988ca0] uppercase tracking-widest mb-1 relative z-10">{name}</p>
      <div className="flex items-end justify-between relative z-10">
        <span className="font-manrope font-bold text-2xl text-white">₹{amount}</span>
        <span className="font-inter font-medium" style={{ color }}>{percent}</span>
      </div>
    </div>
  );
}
