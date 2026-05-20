"use client";
import { motion } from 'framer-motion';
import { Shield, Zap, Cloud } from 'lucide-react';

export function Benefits() {
  const benefits = [
    { icon: <Zap className="w-4 h-4 text-amber-500" />, title: "Instant Hydration", desc: "Download and deploy premium template architectures smoothly into production spaces." },
    { icon: <Shield className="w-4 h-4 text-amber-500" />, title: "Enterprise Secure", desc: "Engineered strict data safety principles with integrated row-level governance." },
    { icon: <Cloud className="w-4 h-4 text-amber-500" />, title: "Cloud Topology", desc: "Native alignment configurations tailored perfectly for global Power BI Services environments." },
  ];

  return (
    <section className="py-16 border-t border-border relative z-10 bg-muted/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-card/50 border border-border p-5 rounded-xl flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/10 shrink-0">
                {b.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">{b.title}</h3>
                <p className="text-muted-foreground text-[11px] leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
