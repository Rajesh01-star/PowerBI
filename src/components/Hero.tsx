"use client";

import { motion } from 'framer-motion';

import { OrbitingCircles } from '@/components/ui/orbiting-circles';
import { useRouter } from 'next/navigation';

export function Hero() {
  const router = useRouter();
  return (
    <div className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-20 lg:pt-0 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none flex items-center justify-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center opacity-40 scale-105"
        >
          <source src="/video/bg_video.mp4" type="video/mp4" />
        </video>
        {/* Subtle dark gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-background/60 to-background" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full max-w-7xl mx-auto px-4 lg:px-8 relative">

        {/* Left Column: Text & Actions */}
        <div className="flex flex-col justify-center order-2 lg:order-1 z-20 lg:pr-8">
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
            className="text-4xl lg:text-5xl font-serif font-medium tracking-tight mb-6 leading-[1.1] text-foreground "
          >
            Meet the Expert <br />
            Power BI Creator
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground text-[15px] lg:text-[17px] leading-relaxed mb-8 max-w-[480px] font-light"
          >
            As a professional Power BI developer, I rely on top-notch tools to create stunning executive dashboards that captivate and engage. Skip the endless development cycles and get premium access.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-4"
          >
            <button onClick={()=>router.push("/products")} className="px-8 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-black text-sm font-bold transition-all duration-300 shadow-[0_10px_20px_rgba(245,158,11,0.25)] hover:shadow-[0_10px_25px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 cursor-pointer">
              Explore Products
            </button>
          </motion.div>
        </div>

        {/* Right Column: Subject Image with Orbiting Circles */}
        <div className="relative order-1 lg:order-2 flex items-center justify-end min-h-[550px] lg:min-h-[750px] w-full">

          {/* Orbiting Circles Container */}
          <div className="absolute inset-y-0 right-0 flex items-center justify-center pointer-events-none w-full lg:w-[350px] max-w-[320px] lg:max-w-[350px] -translate-y-24 lg:-translate-y-46 lg:-translate-x-5 z-[60]">

            {/* Inner Orbit */}
            <OrbitingCircles
              className="border-none bg-transparent"
              duration={25}
              radius={130}
              iconSize={32}
              path={false}
            >
              {/* Jira */}
              <div className="flex items-center justify-center w-full h-full">
                <img src="https://api.iconify.design/logos:jira.svg" alt="Jira" className="w-8 h-8 object-contain" />
              </div>
              {/* Airtable */}
              <div className="flex items-center justify-center w-full h-full">
                <img src="https://api.iconify.design/logos:airtable.svg" alt="Airtable" className="w-8 h-8 object-contain" />
              </div>
              {/* Adobe Photoshop */}
              <div className="flex items-center justify-center w-full h-full">
                <img src="https://api.iconify.design/logos:adobe-photoshop.svg" alt="Adobe Photoshop" className="w-8 h-8 object-contain" />
              </div>
              {/* Adobe Express */}
              <div className="flex items-center justify-center w-full h-full">
                <img src="/icons/adobe-express-icon.svg" alt="Adobe Express" className="w-8 h-8 object-contain" />
              </div>
              {/* Adobe Animate */}
              <div className="flex items-center justify-center w-full h-full">
                <img src="/icons/adobe-animate-icon.svg" alt="Adobe Animate" className="w-8 h-8 object-contain" />
              </div>
              {/* Figma */}
              <div className="flex items-center justify-center w-full h-full">
                <img src="https://api.iconify.design/logos:figma.svg" alt="Figma" className="w-8 h-8 object-contain" />
              </div>
            </OrbitingCircles>

            {/* Outer Orbit */}
            <OrbitingCircles
              className="border-none bg-transparent"
              radius={190}
              duration={30}
              reverse
              iconSize={40}
              path={false}
            >
              {/* Power BI */}
              <div className="flex items-center justify-center w-full h-full">
                <img src="/icons/power-bi-icon.svg" alt="Power BI" className="w-10 h-10 object-contain" />
              </div>
              {/* Tableau */}
              <div className="flex items-center justify-center w-full h-full">
                <img src="/icons/tableau.svg" alt="Tableau" className="w-10 h-10 object-contain" />
              </div>
              {/* Microsoft Excel */}
              <div className="flex items-center justify-center w-full h-full">
                <img src="https://api.iconify.design/vscode-icons:file-type-excel.svg" alt="Microsoft Excel" className="w-10 h-10 object-contain" />
              </div>
              {/* SQL */}
              <div className="flex items-center justify-center w-full h-full">
                <img src="/icons/sql.svg" alt="SQL" className="w-10 h-10 object-contain" />
              </div>
            </OrbitingCircles>
          </div>

          {/* Person Image */}
          <div className="absolute inset-y-0 right-0 flex items-center justify-center w-full max-w-[320px] lg:max-w-[380px] pointer-events-none z-[70]">
            <img
              src="/images/sample_nobg_cropped.png"
              alt="Power BI Creator"
              className="w-full object-contain object-bottom relative z-10 pointer-events-auto"
            />
            {/* Fade the bottom of the subject image to blend with background */}
            <div className="absolute inset-x-0 bottom-0 h-[200px] lg:h-[280px] bg-gradient-to-t from-background via-background/90 via-35% to-transparent z-20 pointer-events-none" />
          </div>
        </div>

      </div>
      <div className="absolute w-[200vw] left-[-50vw] bottom-[-10px] h-[450px] lg:h-[520px] bg-gradient-to-t from-background via-background/90 via-35% to-transparent pointer-events-none z-10" />
    </div>
  );
}
