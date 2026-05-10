

"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Cloud, BarChart3, Star } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const benefits = [
    { icon: <Zap className="w-6 h-6 text-indigo-400" />, title: "Instant Workflow", desc: "Download and deploy premium dashboards in minutes, not months." },
    { icon: <Shield className="w-6 h-6 text-indigo-400" />, title: "Enterprise Secure", desc: "Built with best practices for data governance and security." },
    { icon: <Cloud className="w-6 h-6 text-indigo-400" />, title: "Cloud Ready", desc: "Seamless integration with Power BI Service and Office 365." },
  ];

  const featuredTemplates = [
    { id: 'finance-pro', title: "Finance Pro Exec", category: "Finance", price: "$149", rating: 4.9, img: "bg-gradient-to-br from-emerald-900 to-slate-900" },
    { id: 'sales-command', title: "Sales Command Center", category: "Sales", price: "$129", rating: 4.8, img: "bg-gradient-to-br from-blue-900 to-slate-900" },
    { id: 'hr-analytics', title: "HR People Analytics", category: "HR", price: "$99", rating: 4.7, img: "bg-gradient-to-br from-purple-900 to-slate-900" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-indigo-500/30">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b-0 border-white/5 py-4 px-8 flex justify-between items-center">
        <div className="font-heading font-bold text-2xl tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-500" />
          Lumina
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/marketplace" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Marketplace</Link>
          <Link href="/dashboard" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Dashboard</Link>
          <Link href="/login" className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-medium transition-all">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-xs font-medium text-indigo-200 tracking-wide uppercase">Premium Power BI Templates</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6 max-w-4xl leading-tight"
        >
          Elevate Your Data with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 text-glow">Executive Grade</span> Dashboards.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 font-light"
        >
          Skip the endless development cycles. Access an exclusive marketplace of highly-engineered, beautiful Power BI templates ready for the boardroom.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <Link href="/marketplace" className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-full overflow-hidden transition-all">
            Explore Collection
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#live-demo" className="px-8 py-4 rounded-full glass hover:bg-white/10 text-white font-medium transition-all flex items-center justify-center">
            View Live Demo
          </a>
        </motion.div>

        {/* Live Demo Iframe */}
        <motion.div
          id="live-demo"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-blue-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          <div className="relative w-full aspect-[16/9] bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)] transition-all hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.4)] duration-500">
            <iframe
              title="Campaign Performance Marketing_Power BI project by Mohit Bhardwaj_April 25, 2026"
              className="w-full h-full border-0 absolute inset-0 z-0 pointer-events-none"
              src="https://app.powerbi.com/view?r=eyJrIjoiMzNhODIyNDQtNjM5Ny00ZThhLTg1MjktOTc0ZDI1NWZiNWM3IiwidCI6ImI5ZjU1ZTRjLTRhNzEtNDg0ZS1iZWJiLTA3NThlYjRjZTUyNyJ9"
              allowFullScreen={true}>
            </iframe>

            {/* Interactive Overlay */}
            <Link
              href="/template/campaign-performance"
              className="absolute inset-0 z-10 bg-[#050505]/20 hover:bg-[#050505]/10 flex items-center justify-center transition-colors duration-300 group/overlay"
            >
              <div className="px-6 py-3 rounded-full bg-indigo-600 shadow-xl opacity-0 group-hover/overlay:opacity-100 transition-all duration-300 flex items-center gap-2 transform translate-y-4 group-hover/overlay:translate-y-0 text-white font-medium">
                <BarChart3 className="w-5 h-5" />
                Click to Interact & Purchase
              </div>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Benefits Section */}
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

      {/* Curated Collection */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Curated Collection</h2>
              <p className="text-white/60">Our most requested enterprise templates.</p>
            </div>
            <Link href="/marketplace" className="text-indigo-400 hover:text-indigo-300 font-medium text-sm flex items-center gap-1 group">
              View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTemplates.map((template, i) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={`/template/${template.id}`} className="block glass-card rounded-3xl overflow-hidden group">
                  <div className={`w-full aspect-[4/3] ${template.img} relative flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    <BarChart3 className="w-16 h-16 text-white/20" />
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass text-xs font-medium">
                      {template.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-heading font-semibold">{template.title}</h3>
                      <span className="font-mono font-medium text-indigo-400">{template.price}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-white/50">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {template.rating} • Premium Support
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}