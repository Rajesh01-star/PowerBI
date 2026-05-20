"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Cpu, Award } from "lucide-react";

export function TransitionSection() {
  const stats = [
    {
      icon: <TrendingUp className="w-4 h-4 text-amber-400" />,
      value: "150+",
      label: "Enterprise Blueprints Deployed",
      desc: "Interactive dashboards active across retail, finance, and operations."
    },
    {
      icon: <Cpu className="w-4 h-4 text-amber-400" />,
      value: "10x",
      label: "Cognitive Load Reduction",
      desc: "Engineered user interfaces that deliver critical decision metrics in minutes."
    },
    {
      icon: <Award className="w-4 h-4 text-amber-400" />,
      value: "99.8%",
      label: "Executive Satisfaction Score",
      desc: "Highly rated by corporate officers, directors, and data analysts alike."
    }
  ];

  return (
    <section className="relative w-full overflow-hidden py-24 bg-[linear-gradient(135deg,_#050303_0%,_#0C0806_40%,_#2A170D_100%)] border-y border-amber-950/20 selection:bg-amber-500/30">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.03),_transparent_60%)] pointer-events-none" />

      {/* Grid Pattern Overlay for Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "24px 24px"
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Pitch */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold text-amber-400 backdrop-blur-md uppercase tracking-wider">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Architectural Performance</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-white leading-tight">
              Empowering Decision <br />
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                Makers in Real-Time
              </span>
            </h2>
            
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              We leverage advanced DAX patterns, clean UI design principles, and responsive layouts to deliver Power BI spaces that are fast, robust, and highly functional.
            </p>
          </div>

          {/* Right Column: Dynamic Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-amber-500/20 p-5 flex flex-col justify-between space-y-4 transition-all duration-300"
              >
                {/* Glow behind icon */}
                <div className="absolute top-6 left-6 w-8 h-8 rounded-lg bg-amber-500/5 blur-md pointer-events-none group-hover:bg-amber-500/10 transition-colors" />

                <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.05] group-hover:border-amber-500/30 flex items-center justify-center shrink-0 relative z-10 transition-colors">
                  {stat.icon}
                </div>

                <div className="space-y-1 relative z-10">
                  <div className="text-2xl font-mono font-bold text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-bold text-amber-300/90 tracking-wider uppercase">
                    {stat.label}
                  </div>
                  <p className="text-[10px] text-neutral-400 leading-relaxed font-light">
                    {stat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
