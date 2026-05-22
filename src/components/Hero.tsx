"use client";

import { motion } from 'framer-motion';
import { Cloud, Shield, Zap, BarChart3, Star, Command, Maximize } from 'lucide-react';
import { OrbitingCircles } from '@/components/ui/orbiting-circles';
export function Hero() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center pt-20 lg:pt-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center w-full max-w-7xl mx-auto px-4 lg:px-8">

        {/* Left Column: Text & Stacks */}
        <div className="flex flex-col justify-center order-2 lg:order-1 z-20 ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 mb-6 self-start backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-medium text-amber-500 dark:text-amber-400">Available for Projects</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl lg:text-4xl font-sans font-medium tracking-tight mb-6 leading-[1.1] text-foreground"
          >
            Meet the Expert <br />
            Power BI Creator
          </motion.h1>
        </div>

        {/* Center Column: Subject Image with Orbiting Circles */}
        <div className="relative order-1 lg:order-2 flex items-center justify-center min-h-[550px] lg:min-h-[750px]">
          {/* Orbiting Circles Container */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

            {/* Inner Orbit */}
            <OrbitingCircles
              className="border-none bg-transparent"
              duration={25}
              radius={160}
              iconSize={40}
              path={false}
            >
              {/* Power BI - Official Multi-color */}
              <div className="flex items-center justify-center w-full h-full">
                <img
                  src="/icons/power-bi-icon.svg"
                  alt="Power BI"
                  className="w-8 h-8 object-contain"
                />
              </div>

              {/* Tableau - Official Multi-color */}
              <div className="flex items-center justify-center w-full h-full">
                <img
                  src="/icons/tableau.svg"
                  alt="Tableau"
                  className="w-8 h-8 object-contain"
                />
              </div>

              {/* Jira - Official Multi-color */}
              <div className="flex items-center justify-center w-full h-full">
                <img
                  src="https://api.iconify.design/logos:jira.svg"
                  alt="Jira"
                  className="w-8 h-8 object-contain"
                />
              </div>

              {/* Microsoft Excel - Modern Fluent Color */}
              <div className="flex items-center justify-center w-full h-full">
                <img
                  src="https://api.iconify.design/vscode-icons:file-type-excel.svg"
                  alt="Microsoft Excel"
                  className="w-8 h-8 object-contain"
                />
              </div>
            </OrbitingCircles>

            {/* Outer Orbit */}
            <OrbitingCircles
              className="border-none bg-transparent"
              radius={240}
              duration={35}
              reverse
              iconSize={48}
              path={false}
            >
              {/* Airtable - Official Multi-color */}
              <div className="flex items-center justify-center w-full h-full">
                <img
                  src="https://api.iconify.design/logos:airtable.svg"
                  alt="Airtable"
                  className="w-10 h-10 object-contain"
                />
              </div>

              {/* SQL - Clean Vector Database Icon */}
              <div className="flex items-center justify-center w-full h-full">
                <img
                  src="/icons/sql.svg"
                  alt="SQL"
                  className="w-10 h-10 object-contain"
                />
              </div>

              {/* Adobe Photoshop - Official Multi-color */}
              <div className="flex items-center justify-center w-full h-full">
                <img
                  src="https://api.iconify.design/logos:adobe-photoshop.svg"
                  alt="Adobe Photoshop"
                  className="w-10 h-10 object-contain"
                />
              </div>

              {/* Adobe Express - Official Multi-color */}
              <div className="flex items-center justify-center w-full h-full">
                <img
                  src="/icons/adobe-express-icon.svg"
                  alt="Adobe Express"
                  className="w-10 h-10 object-contain"
                />
              </div>

              {/* Adobe Animate - Clean Vector Logo */}
              <div className="flex items-center justify-center w-full h-full">
                <img
                  src="/icons/adobe-animate-icon.svg"
                  alt="Adobe Animate"
                  className="w-10 h-10 object-contain"
                />
              </div>

              {/* Figma - Official Multi-color */}
              <div className="flex items-center justify-center w-full h-full">
                <img
                  src="https://api.iconify.design/logos:figma.svg"
                  alt="Figma"
                  className="w-10 h-10 object-contain"
                />
              </div>
            </OrbitingCircles>
          </div>

          {/* Person Image */}
          <div className="relative z-10 flex items-end justify-center w-full h-full">
            <img
              src="/images/sample_nobg_cropped.png"
              alt="Power BI Creator"
              className="w-full max-w-[250px] lg:max-w-[250px] object-contain object-bottom relative z-10 translate-x-[20px]"
            />
            {/* Fade overlay specifically for the image cutoff */}
          </div>
        </div>

        {/* Right Column: Text & Spinning Badge */}
        <div className="flex flex-col justify-center items-end order-3 relative z-20">
          {/* Spinning Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute top-[-80px] lg:top-[-60px] right-0 lg:right-[-20px] flex items-center justify-center"
          >
            <div className="relative w-[120px] h-[120px] lg:w-[140px] lg:h-[140px] animate-[spin_15s_linear_infinite]">
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                <path id="circlePath" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" fill="transparent" />
                <text className="text-[11px] lg:text-[12px] font-bold tracking-widest fill-current text-foreground uppercase">
                  <textPath href="#circlePath" startOffset="0%">POWER BI EXPERT CREATOR •</textPath>
                </text>
              </svg>
            </div>
            <div className="absolute w-12 h-12 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-foreground" />
            </div>
          </motion.div>

          {/* Description and Button */}
          <div className="mt-32 lg:mt-20 text-left">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-muted-foreground text-[15px] leading-relaxed mb-8 max-w-[320px] font-light"
            >
              As a professional Power BI developer, I rely on top-notch tools to create stunning executive dashboards that captivate and engage. Skip the endless development cycles and get premium access.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button className="px-8 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-black text-sm font-bold transition-all duration-300 shadow-[0_10px_20px_rgba(245,158,11,0.25)] hover:shadow-[0_10px_25px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 cursor-pointer">
                Explore Services
              </button>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="absolute w-[200vw] left-[-50vw] bottom-[-10px] h-[350px] bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none z-10" />
    </div>
  );
}
