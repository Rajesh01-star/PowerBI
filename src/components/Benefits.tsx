"use client";
import { motion } from 'framer-motion';
import { Shield, Zap, Cloud } from 'lucide-react';

export function Benefits() {
  const benefits = [
    { icon: <Zap className="w-6 h-6 text-indigo-400" />, title: "Instant Workflow", desc: "Download and deploy premium dashboards in minutes, not months." },
    { icon: <Shield className="w-6 h-6 text-indigo-400" />, title: "Enterprise Secure", desc: "Built with best practices for data governance and security." },
    { icon: <Cloud className="w-6 h-6 text-indigo-400" />, title: "Cloud Ready", desc: "Seamless integration with Power BI Service and Office 365." },
  ];

  return (
    <section className="py-20 border-t border-white/5 relative z-10 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((b, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-8 rounded-3xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 border border-indigo-500/30">
                {b.icon}
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">{b.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
