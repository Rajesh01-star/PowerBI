

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Cloud, BarChart3, Star, Command, Maximize } from 'lucide-react';
import Link from 'next/link';
import { OrbitingCircles } from '@/components/ui/orbiting-circles';

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
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="w-full max-w-3xl bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-full py-2.5 px-3 flex justify-between items-center shadow-2xl">
          <div className="font-heading font-bold text-[14px] tracking-wide flex items-center gap-3 pl-3">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-inner" />
            SKIPER-UI
          </div>
          <div className="flex gap-1 items-center">
            <Link href="/pricing" className="px-4 py-2 text-[13px] font-medium text-white/60 hover:text-white transition-colors">Pricing</Link>
            <Link href="/components" className="px-4 py-2 text-[13px] font-medium text-white/60 hover:text-white transition-colors">Components</Link>
            <div className="flex gap-2 ml-2">
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-white/70 transition-all">
                <Command className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-white/70 transition-all">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <main className="pt-12 lg:pt-16 pb-20 px-4 md:px-8 max-w-[1300px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch min-h-[600px] lg:min-h-[700px] mb-24">
          
          {/* Left Column: Text & Stacks */}
          <div className="flex flex-col justify-center order-2 lg:order-1 pt-0 z-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#25D366]/30 bg-transparent mb-4 self-start">
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]" />
                <span className="text-sm font-medium text-white/90">Available for Projects</span>
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl lg:text-4xl font-sans font-medium tracking-tight mb-4 leading-[1.1] text-white"
            >
              Meet the Expert <br />
              Power BI Creator
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-4 px-6 py-2.5 rounded-full bg-transparent border border-white/10 w-fit">
                <span className="text-sm font-medium text-white/80">My Fav Stacks</span>
                <div className="flex items-center gap-4 border-l border-white/20 pl-4">
                  <BarChart3 className="w-4 h-4 text-white/70" />
                  <Cloud className="w-4 h-4 text-white/70" />
                  <Zap className="w-4 h-4 text-white/70" />
                  <Shield className="w-4 h-4 text-white/70" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Center Column: Subject Image */}
          <div className="flex flex-col items-start justify-center relative order-1 lg:order-2 h-[400px] lg:h-auto overflow-visible mt-6 lg:mt-40">
            {/* Orbiting Circles Background */}
            <div className="absolute inset-0 flex mt-[-15rem] items-center justify-center pointer-events-none z-0">
              <OrbitingCircles
                className="border-none bg-transparent"
                duration={25}
                radius={160}
                iconSize={40}
                // path={false}
              >
                <div className="text-[#25D366] flex items-center justify-center w-full h-full"><BarChart3 className="w-8 h-8" /></div>
                <div className="text-white/80 flex items-center justify-center w-full h-full"><Cloud className="w-8 h-8" /></div>
                <div className="text-white flex items-center justify-center w-full h-full"><Shield className="w-8 h-8" /></div>
                <div className="text-[#25D366] flex items-center justify-center w-full h-full"><Zap className="w-8 h-8" /></div>
              </OrbitingCircles>

              <OrbitingCircles
                className="border-none bg-transparent"
                radius={240}
                duration={35}
                reverse
                iconSize={48}
                // path={false}
              >
                <div className="text-white/80 flex items-center justify-center w-full h-full"><Star className="w-10 h-10" /></div>
                <div className="text-[#25D366] flex items-center justify-center w-full h-full"><Command className="w-10 h-10" /></div>
                <div className="text-white flex items-center justify-center w-full h-full"><Maximize className="w-10 h-10" /></div>
                <div className="text-[#25D366] flex items-center justify-center w-full h-full"><BarChart3 className="w-10 h-10" /></div>
              </OrbitingCircles>
            </div>

            {/* The Person Picture */}
            <div className="absolute inset-x-0 z-10 flex justify-center pointer-events-none">
              <img 
                src="/images/sample_nobg.png" 
                alt="Leo Adam" 
                className="w-full max-w-[550px] md:max-w-[650px] lg:max-w-[1050px] object-contain object-bottom pointer-events-auto transform scale-[1.1] origin-bottom"
              />
            </div>
            
            {/* Fade overlay to blend the hard image cut and lower orbit paths */}
            <div className="absolute inset-x-[-50vw] bottom-[-60px] h-[200px] bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-20 pointer-events-none" />
          </div>

          {/* Right Column: Text & Spinning Badge */}
          <div className="flex flex-col justify-end lg:justify-center items-center lg:items-start order-3 relative lg:pl-16 pt-16 lg:pt-0 z-20">
            {/* Spinning Badge - Top Right */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute top-0 right-0 hidden lg:flex items-center justify-center"
            >
               <div className="relative w-[140px] h-[140px] animate-[spin_10s_linear_infinite]">
                 <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                   <path id="circlePath" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" fill="transparent" />
                   <text className="text-[12px] font-bold tracking-widest fill-white uppercase">
                     <textPath href="#circlePath" startOffset="0%">POWER BI EXPERT CREATOR •</textPath>
                   </text>
                 </svg>
               </div>
               <div className="absolute w-12 h-12 rounded-xl flex items-center justify-center">
                 <BarChart3 className="w-8 h-8 text-white" />
               </div>
            </motion.div>

            {/* Bottom Right Text and Button */}
            <div className="mt-auto lg:mt-64 text-center lg:text-left">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-white/70 text-[15px] leading-relaxed mb-8 max-w-[280px] mx-auto lg:mx-0 font-light"
              >
                As a professional Power BI developer, I rely on top-notch tools to create stunning executive dashboards that captivate and engage. Skip the endless development cycles and get premium access.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <button className="px-8 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#25D366]/90 text-black font-semibold transition-all">
                  Explore Services
                </button>
              </motion.div>
            </div>
          </div>
        </div>


        {/* Live Demo Iframes */}
        <div id="live-demo" className="w-full flex flex-col gap-16 mt-4">
          {/* First Iframe */}
          <motion.div 
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

          {/* Second Iframe */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-full max-w-[600px] mx-auto relative group"
            style={{ aspectRatio: '600 / 373.5' }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            <div className="relative w-full h-full bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)] transition-all hover:shadow-[0_0_60px_-10px_rgba(168,85,247,0.4)] duration-500">
              <iframe 
                title="Gen Koffee Infographics - for 1st page only" 
                className="w-full h-full border-0 absolute inset-0 z-0 pointer-events-none"
                src="https://app.powerbi.com/view?r=eyJrIjoiZTRmYjI0NTMtZjk3MS00NzczLTlmZDItNTA2NTQyNzA5NWRiIiwidCI6ImI5ZjU1ZTRjLTRhNzEtNDg0ZS1iZWJiLTA3NThlYjRjZTUyNyJ9" 
                allowFullScreen={true}>
              </iframe>

              {/* Interactive Overlay */}
              <Link 
                href="/template/gen-koffee-infographics" 
                className="absolute inset-0 z-10 bg-[#050505]/20 hover:bg-[#050505]/10 flex items-center justify-center transition-colors duration-300 group/overlay"
              >
                <div className="px-6 py-3 rounded-full bg-purple-600 shadow-xl opacity-0 group-hover/overlay:opacity-100 transition-all duration-300 flex items-center gap-2 transform translate-y-4 group-hover/overlay:translate-y-0 text-white font-medium">
                  <BarChart3 className="w-5 h-5" />
                  Click to Interact & Purchase
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
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