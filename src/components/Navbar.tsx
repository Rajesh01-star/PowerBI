"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User as UserIcon, LogOut, Search } from 'lucide-react';
import { RegisterDialog } from './RegisterDialog';
import { authClient } from '@/lib/auth-client';
import { cn } from "@/lib/utils";
import { ModeToggle } from './ModeToggle';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { BrandLogo } from './BrandLogo';
import { useQuery } from '@tanstack/react-query';
import { getSystemSettingsAction } from '@/app/admin/actions';

const AdobeXDIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#FF26BE]" fill="currentColor">
    <rect width="24" height="24" rx="5" fill="url(#xd-grad)" />
    <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Xd</text>
    <defs>
      <linearGradient id="xd-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#470037" />
        <stop offset="100%" stopColor="#FF26BE" />
      </linearGradient>
    </defs>
  </svg>
);

const FigmaIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5C12 3.34315 10.6569 2 9 2C7.34315 2 6 3.34315 6 5C6 6.65685 7.34315 8 9 8C10.6569 8 12 6.65685 12 5Z" fill="#F24E1E" />
    <path d="M6 11C6 9.34315 7.34315 8 9 8H12V14H9C7.34315 14 6 12.6569 6 11Z" fill="#A259FF" />
    <path d="M12 8H15C16.6569 8 18 6.65685 18 5C18 3.34315 16.6569 2 15 2C13.3431 2 12 3.34315 12 5V8Z" fill="#F24E1E" />
    <path d="M12 11H15C16.6569 11 18 12.3431 18 14C18 15.6569 16.6569 17 15 17C13.3431 17 12 15.6569 12 14V11Z" fill="#1ABC9C" />
    <path d="M6 17C6 15.3431 7.34315 14 9 14H12V17C12 18.6569 10.6569 20 9 20C7.34315 20 6 18.6569 6 17Z" fill="#0ACF83" />
  </svg>
);

const PowerBIIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="4" width="4" height="16" rx="1" fill="#F2C811" />
    <rect x="10" y="9" width="4" height="11" rx="1" fill="#F2A511" />
    <rect x="5" y="14" width="4" height="6" rx="1" fill="#D97911" />
  </svg>
);

export function Navbar() {
  const router = useRouter();
  const { data: sessionData, isPending } = authClient.useSession();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: () => getSystemSettingsAction(),
  });

  const showPowerbi = !settings?.hide_powerbi;
  const showUiux = !settings?.hide_uiux;
  const showProducts = showPowerbi || showUiux;
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarHash = (id: string) => {
    return id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  };

  const avatarIndex = sessionData?.user ? getAvatarHash(sessionData.user.id) % 5 : 0;

  const gradients = [
    "from-neutral-800 to-neutral-900",
    "from-amber-900/50 to-neutral-900",
    "from-zinc-800 to-zinc-950",
    "from-slate-800 to-slate-950",
    "from-stone-800 to-stone-950"
  ];

  const currentGradient = gradients[avatarIndex];

  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-out",
        scrolled
          ? "top-0 px-0"
          : "top-3 sm:top-6 px-3 sm:px-4"
      )}
    >
      <div
        className={cn(
          "pointer-events-auto transition-all duration-500 ease-out",
          scrolled
            ? "w-full max-w-full"
            : "w-full max-w-7xl"
        )}
      >
        <nav
          className={cn(
            "flex h-16 items-center justify-between border backdrop-blur-2xl transition-all duration-500 ease-out",
            scrolled
              ? "rounded-none border-x-0 border-t-0 border-border/40 bg-background/80 shadow-md px-6"
              : "rounded-[20px] border-border/40 bg-background/40 shadow-sm px-4 sm:px-6"
          )}
        >
          {/* Left: Logo & Brand */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-2 py-1 cursor-pointer">
              <img src="/icons/logo.png" alt="Logo" className="h-9 w-auto object-contain drop-shadow-sm" />
              <BrandLogo size="md" className="pt-0.5" />
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                {/* About Us Nav Item */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    onClick={() => router.push('/about')}
                    className="text-foreground/70 hover:text-foreground bg-transparent hover:bg-accent focus:bg-accent data-[popup-open]:bg-accent data-[popup-open]:text-foreground transition-all cursor-pointer text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1"
                  >
                    About Us
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="cursor-pointer p-5 w-[560px] md:w-[600px] lg:w-[640px]" onClick={() => { router.push("/about") }}>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                      <div className="md:col-span-2 flex flex-col justify-between rounded-xl bg-gradient-to-br from-amber-950/20 via-popover to-background p-4 border border-border/40 shadow-xl">
                        <div>
                          <h4 className="text-xs font-semibold text-foreground tracking-wide uppercase bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                            Gengraphs &amp; Graphics
                          </h4>
                          <p className="mt-2 text-[10px] text-muted-foreground leading-relaxed">
                            Founded in 2026 by <span className="text-foreground font-medium">Mohit Bhardwaj</span>.
                          </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-border/40">
                          <Link
                            href="/about"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1.5 text-[9px] font-medium text-amber-500 transition-all border border-amber-500/20 group/btn"
                          >
                            <span>About Us</span>
                            <span className="transition-transform group-hover/btn:translate-x-0.5">→</span>
                          </Link>
                        </div>
                      </div>

                      <div className="md:col-span-3 flex flex-col justify-between gap-3 text-foreground/70 text-[10px] leading-relaxed">
                        <p>
                          Offers services in <span className="text-foreground font-medium">Data analytics</span>, <span className="text-foreground font-medium">Business Intelligence</span>, and <span className="text-foreground font-medium">Graphic designing</span>, drawing on deep expertise in Power BI, Tableau, Advanced Excel, and Project Management. Every project is approached like a mini-strategy engagement: understanding your goals, mapping the right KPIs, and delivering visuals that executives can act on in minutes, not hours.
                        </p>
                        <p>
                          Alongside data, we offer end-to-end visual and product design—brand-aligned graphic design, presentation and pitch-deck design, and UX/UI for dashboards, internal tools, and business websites—so your insights and ideas look as powerful as they look premium.
                        </p>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Products Nav Item */}
                {showProducts && (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      onClick={() => router.push('/products')}
                      className="text-foreground/70 hover:text-foreground bg-transparent hover:bg-accent focus:bg-accent data-[popup-open]:bg-accent data-[popup-open]:text-foreground transition-all cursor-pointer text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      Products
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="p-2 w-[450px]">
                      <div className="grid grid-cols-1 gap-1">
                        {showUiux && (
                          <NavigationMenuLink href="/products/ui-ux" className="group/item flex gap-4 rounded-xl p-2.5 hover:bg-accent transition-all duration-300 border border-transparent hover:border-border cursor-pointer">
                            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 group-hover/item:bg-purple-500/20 transition-all duration-300">
                              <FigmaIcon />
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-foreground group-hover/item:text-purple-500 transition-colors">UX/UI & Graphic Designing</h4>
                              <p className="mt-0.5 text-[10px] text-muted-foreground leading-relaxed">
                                Professional UX/UI mockup design, brand-aligned graphic design, and high-fidelity wireframing.
                              </p>
                            </div>
                          </NavigationMenuLink>
                        )}

                        {showPowerbi && (
                          <NavigationMenuLink href="/products/power-bi" className="group/item flex gap-4 rounded-xl p-2.5 hover:bg-accent transition-all duration-300 border border-transparent hover:border-border cursor-pointer">
                            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 group-hover/item:bg-yellow-500/20 transition-all duration-300">
                              <PowerBIIcon />
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-foreground group-hover/item:text-[#F2C811] transition-colors">Power BI</h4>
                              <p className="mt-0.5 text-[10px] text-muted-foreground leading-relaxed">
                                Interactive corporate dashboards, advanced DAX modeling, custom visuals, and actionable intelligence.
                              </p>
                            </div>
                          </NavigationMenuLink>
                        )}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )}

                {/* Contact Nav Item */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    onClick={() => router.push('/contact')}
                    className="text-foreground/70 hover:text-foreground bg-transparent hover:bg-accent focus:bg-accent data-[popup-open]:bg-accent data-[popup-open]:text-foreground transition-all cursor-pointer text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1"
                  >
                    Contact
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="cursor-pointer p-5 w-[560px] md:w-[600px] lg:w-[640px]" onClick={() => { router.push("/contact") }}>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                      <div className="md:col-span-2 flex flex-col justify-between rounded-xl bg-gradient-to-br from-amber-950/20 via-popover to-background p-4 border border-border/40 shadow-xl">
                        <div>
                          <h4 className="text-xs font-semibold text-foreground tracking-wide uppercase bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                            Get In Touch
                          </h4>
                          <p className="mt-2 text-[10px] text-muted-foreground leading-relaxed">
                            Have a complex analytics challenge, custom visual request, or interface mockup project? Let&apos;s deploy a high-fidelity business intelligence solution together.
                          </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-border/40">
                          <Link
                            href="/contact"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1.5 text-[9px] font-medium text-amber-500 transition-all border border-amber-500/20 group/btn"
                          >
                            <span>Send Message</span>
                            <span className="transition-transform group-hover/btn:translate-x-0.5">→</span>
                          </Link>
                        </div>
                      </div>

                      <div className="md:col-span-3 flex flex-col justify-between gap-3 text-foreground/70 text-[10px] leading-relaxed">
                        <div className="space-y-4">
                          <div className="flex gap-3 items-center">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5A2.25 2.25 0 0 1 2.25 17.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-[8px] text-muted-foreground uppercase tracking-widest font-mono">Secure Email</div>
                              <div className="text-[10px] font-semibold text-foreground"> info@gengraphsandgraphics.com</div>
                            </div>
                          </div>

                          <div className="flex gap-3 items-center">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-[8px] text-muted-foreground uppercase tracking-widest font-mono">Response SLA</div>
                              <div className="text-[10px] font-semibold text-foreground">Guaranteed within 12 Hours</div>
                            </div>
                          </div>

                          <div className="flex gap-3 items-center">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-[8px] text-muted-foreground uppercase tracking-widest font-mono">Location Hub</div>
                              <div className="text-[10px] font-semibold text-foreground">New Delhi, India (Global Remote)</div>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-[9px] text-muted-foreground leading-relaxed italic border-t border-border/40 pt-2">
                          Ready to optimize your data pipeline or build standard mockups? Click above to launch our strategy submission form.
                        </p>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right: Actions & Auth */}
          <div className="flex-1 flex justify-end items-center gap-4">
            {/* Search/Command */}
            {/* <button type="button" className="text-muted-foreground hover:text-foreground transition-colors p-2 flex items-center gap-2 rounded-md hover:bg-accent">
              <Search className="w-4 h-4" />
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button> */}
            {/* <ModeToggle /> */}

            <div className="w-px h-6" />

            {/* Auth State */}
            {!isPending && !sessionData?.user && <RegisterDialog />}

            {!isPending && sessionData?.user && (
              <div className="relative" ref={dropdownRef}>
                {/* Avatar Button */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`relative h-7 w-7 rounded-full border border-border bg-gradient-to-br ${currentGradient} flex items-center justify-center text-[10px] font-medium text-foreground/90 hover:border-border/80 transition-colors cursor-pointer overflow-hidden`}
                >
                  <img
                    src={`/avatars/${String((avatarIndex % 5) + 1).padStart(2, '0')}.webp`}
                    alt="Avatar"
                    className="absolute inset-0 w-full h-full object-cover z-20"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <span className="relative z-10">
                    {sessionData.user.name ? getInitials(sessionData.user.name) : <UserIcon className="w-3.5 h-3.5" />}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl bg-popover/95 border border-border backdrop-blur-2xl shadow-xl p-1 z-50 text-popover-foreground">
                    {/* Header */}
                    <div className="px-3 py-1.5 border-b border-border/40 mb-1">
                      <div className="text-xs font-medium text-foreground">{sessionData.user.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{sessionData.user.email}</div>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-0.5">
                      <Link href="/dashboard" className="flex items-center px-3 py-1.5 text-xs text-foreground/70 hover:text-foreground hover:bg-accent rounded-lg transition-colors cursor-pointer">
                        Dashboard
                      </Link>
                      {sessionData.user.isAdmin && (
                        <Link href="/admin" className="flex items-center px-3 py-1.5 text-xs text-amber-500 hover:text-amber-600 hover:bg-accent rounded-lg transition-colors cursor-pointer">
                          Admin
                        </Link>
                      )}
                    </div>

                    <div className="h-px bg-border/40 my-1" />

                    {/* Footer */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}