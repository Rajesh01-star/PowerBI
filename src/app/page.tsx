

import React from 'react';

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white font-sans p-4 md:p-8 flex flex-col items-center">

      {/* Header Section */}
      <header className="w-full max-w-7xl mt-8 mb-12 text-center animate-fade-in-down">
        <div className="inline-flex items-center justify-center space-x-3 mb-4 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-sm font-medium text-slate-200 tracking-wide uppercase">Live Analytics</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-300 mb-6 drop-shadow-lg">
          Campaign Performance Marketing
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          Interactive Power BI Dashboard. Analyze your key campaign metrics and ROI in real-time.
        </p>
      </header>

      {/* Main Dashboard Container */}
      <main className="w-full max-w-7xl animate-fade-in-up">
        {/* Glassmorphism Wrapper */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(45,212,191,0.3)] bg-white/5 backdrop-blur-2xl border border-white/10 p-2 md:p-4 transition-all hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.4)] duration-500 group">

          {/* Subtle animated gradient background behind the iframe */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          {/* POWER BI IFRAME WRAPPER (16:9 Aspect Ratio) */}
          <div className="relative w-full aspect-[16/9] bg-slate-900/50 rounded-2xl overflow-hidden flex items-center justify-center border border-white/5 shadow-inner">

            {/* Power BI Iframe */}
            <iframe 
              title="Campaign Performance Marketing_Power BI project by Mohit Bhardwaj_April 25, 2026" 
              className="w-full h-full border-0 absolute inset-0 z-0"
              src="https://app.powerbi.com/view?r=eyJrIjoiMzNhODIyNDQtNjM5Ny00ZThhLTg1MjktOTc0ZDI1NWZiNWM3IiwidCI6ImI5ZjU1ZTRjLTRhNzEtNDg0ZS1iZWJiLTA3NThlYjRjZTUyNyJ9" 
              allowFullScreen={true}>
            </iframe>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-slate-500 text-sm font-medium tracking-wide">
        Secure Data Visualization • Power BI Integration
      </footer>
    </div>
  );
};

export default Page;