"use client";
import { motion } from 'framer-motion';
import { Shield, Zap, Cloud } from 'lucide-react';

export function Benefits() {
  const benefits = [
    { icon: <Zap className="w-4 h-4 text-indigo-400" />, title: "Instant Hydration", desc: "Download and deploy premium template architectures smoothly into production spaces." },
    { icon: <Shield className="w-4 h-4 text-indigo-400" />, title: "Enterprise Secure", desc: "Engineered strict data safety principles with integrated row-level governance." },
    { icon: <Cloud className="w-4 h-4 text-indigo-400" />, title: "Cloud Topology", desc: "Native alignment configurations tailored perfectly for global Power BI Services environments." },
  ];

  return (
    <section className="py-16 border-t border-white/5 relative z-10 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white/[0.01] border border-white/5 p-5 rounded-xl flex flex-col justify-between space-y-3"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/10 shrink-0">
                {b.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/80">{b.title}</h3>
                <p className="text-white/40 text-[11px] leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
