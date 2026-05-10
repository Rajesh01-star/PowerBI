"use client";

import { motion } from 'framer-motion';
import { Cloud, Shield, Zap, BarChart3, Star, Command, Maximize } from 'lucide-react';
import { OrbitingCircles } from '@/components/ui/orbiting-circles';
import GradualBlur from './GradualBlur';
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#25D366]/30 bg-transparent mb-6 self-start">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]" />
              <span className="text-sm font-medium text-white/90">Available for Projects</span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl lg:text-5xl font-sans font-medium tracking-tight mb-6 leading-[1.1] text-white"
          >
            Meet the Expert <br />
            Power BI Creator
          </motion.h1>
        </div>

        {/* Center Column: Subject Image with Orbiting Circles */}
        <div className="relative order-1 lg:order-2 flex items-center justify-center min-h-[550px] lg:min-h-[750px]">
          {/* Orbiting Circles Container */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <OrbitingCircles
              className="border-none bg-transparent"
              duration={25}
              radius={160}
              iconSize={40}
            >
              <div className="flex items-center justify-center w-full h-full">
                <img src="https://cdn.simpleicons.org/sap/sap" alt="SAP" className="w-8 h-8 object-contain" />
              </div>
              <div className="flex items-center justify-center w-full h-full">
                <img src="https://cdn.simpleicons.org/steam/steam" alt="steam" className="w-8 h-8 object-contain" />
              </div>
              <div className="flex items-center justify-center w-full h-full">
                <img src="https://cdn.simpleicons.org/firefox/firefox" alt="Firefox" className="w-8 h-8 object-contain" />
              </div>
              <div className="flex items-center justify-center w-full h-full">
                <img src="https://cdn.simpleicons.org/swift/swift" alt="swift" className="w-8 h-8 object-contain" />
              </div>
            </OrbitingCircles>

            <OrbitingCircles
              className="border-none bg-transparent"
              radius={240}
              duration={35}
              reverse
              iconSize={48}
            >
              <div className="flex items-center justify-center w-full h-full">
                <img src="https://cdn.simpleicons.org/figma/figma" alt="Figma" className="w-10 h-10 object-contain" />
              </div>
              <div className="flex items-center justify-center w-full h-full">
                <img src="https://cdn.simpleicons.org/simpleanalytics/simpleanalytics" alt="simpleanalytics" className="w-10 h-10 object-contain" />
              </div>
              <div className="flex items-center justify-center w-full h-full">
                <img src="https://cdn.simpleicons.org/snapcraft/snapcraft" alt="snapcraft" className="w-10 h-10 object-contain" />
              </div>
              <div className="flex items-center justify-center w-full h-full">
                <img src="https://cdn.simpleicons.org/python/python" alt="Python" className="w-10 h-10 object-contain" />
              </div>
              <div className="flex items-center justify-center w-full h-full">
                <img src="https://cdn.simpleicons.org/postgresql/postgresql" alt="PostgreSQL" className="w-10 h-10 object-contain" />
              </div>
              <div className="flex items-center justify-center w-full h-full">
                <img src="https://cdn.simpleicons.org/googlesheets/googlesheets" alt="google sheets" className="w-10 h-10 object-contain" />
              </div>
            </OrbitingCircles>
          </div>

          {/* Person Image */}
          <div className="relative z-10 flex items-end justify-center w-full h-full">
            <img 
              src="/images/sample_nobg.png" 
              alt="Power BI Creator" 
              className="w-full max-w-[450px] lg:max-w-[580px] object-contain object-bottom relative z-10"
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
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-[-80px] lg:top-[-60px] right-0 lg:right-[-20px] flex items-center justify-center"
          >
            <div className="relative w-[120px] h-[120px] lg:w-[140px] lg:h-[140px] animate-[spin_10s_linear_infinite]">
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                <path id="circlePath" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" fill="transparent" />
                <text className="text-[11px] lg:text-[12px] font-bold tracking-widest fill-white uppercase">
                  <textPath href="#circlePath" startOffset="0%">POWER BI EXPERT CREATOR •</textPath>
                </text>
              </svg>
            </div>
            <div className="absolute w-12 h-12 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* Description and Button */}
          <div className="mt-32 lg:mt-20 text-left">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/60 text-[15px] leading-relaxed mb-8 max-w-[320px] font-light"
            >
              As a professional Power BI developer, I rely on top-notch tools to create stunning executive dashboards that captivate and engage. Skip the endless development cycles and get premium access.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button className="px-8 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#25D366]/90 text-black font-semibold transition-all shadow-lg shadow-[#25D366]/20">
                Explore Services
              </button>
            </motion.div>
          </div>
        </div>
      </div>
      <GradualBlur
        position="bottom"
        height="10rem"
        strength={10}
        divCount={10}
        curve="bezier"
        exponential
        opacity={1}
      />
      <div className="absolute w-[200vw] left-[-50vw] bottom-[-10px] h-[350px] bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent pointer-events-none z-10" />
    </div>
  );
}
