"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Command, User as UserIcon, LogOut, Search } from 'lucide-react';
import { RegisterDialog } from './RegisterDialog';
import { authClient } from '@/lib/auth-client';
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: sessionData, isPending } = authClient.useSession();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
    "from-indigo-900/50 to-neutral-900",
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
              ? "rounded-none border-x-0 border-t-0 border-white/[0.06] bg-black/80 shadow-[0_10px_40px_rgba(0,0,0,0.45)] px-6"
              : "rounded-[20px] border-white/[0.04] bg-black/40 shadow-[0_0_40px_rgba(79,70,229,0.04)] px-4 sm:px-6"
          )}
        >
          {/* Left: Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 py-1 text-sm font-semibold cursor-pointer">
            <img src="https://cdn.skiper-ui.com/logos/logo.svg" alt="Logo" className="w-6 h-6" />
            <span className="text-white tracking-wide hidden xs:block">LUMINA</span>
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/marketplace" className="text-white/70 hover:text-white transition-colors">Marketplace</Link>
            <Link href="/solutions" className="text-white/70 hover:text-white transition-colors">Solutions</Link>
            <Link href="/previews" className="text-white/70 hover:text-white transition-colors">Live Previews</Link>
            <Link href="/resources" className="text-white/70 hover:text-white transition-colors">Resources</Link>
          </div>

          {/* Right: Actions & Auth */}
          <div className="flex items-center gap-4">
            {/* Search/Command */}
            <button type="button" className="text-white/50 hover:text-white transition-colors p-2 flex items-center gap-2 rounded-md hover:bg-white/5">
              <Search className="w-4 h-4" />
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-white/50 opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            <div className="w-px h-6 bg-white/10" />

            {/* Auth State */}
            {!isPending && !sessionData?.user && <RegisterDialog />}

            {!isPending && sessionData?.user && (
              <div className="relative" ref={dropdownRef}>
                {/* Avatar Button */}
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`relative h-7 w-7 rounded-full border border-white/[0.08] bg-gradient-to-br ${currentGradient} flex items-center justify-center text-[10px] font-medium text-white/90 hover:border-white/[0.15] transition-colors cursor-pointer overflow-hidden`}
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
                  <div className="absolute right-0 mt-2 w-44 rounded-xl bg-[#0A0A0A]/95 border border-white/[0.06] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-1 z-50">
                    {/* Header */}
                    <div className="px-3 py-1.5 border-b border-white/[0.04] mb-1">
                      <div className="text-xs font-medium text-white">{sessionData.user.name}</div>
                      <div className="text-[10px] text-white/50 truncate">{sessionData.user.email}</div>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-0.5">
                      <Link href="/dashboard" className="flex items-center px-3 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors cursor-pointer">
                        Dashboard
                      </Link>
                      {sessionData.user.isAdmin && (
                        <Link href="/admin" className="flex items-center px-3 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-white/[0.04] rounded-lg transition-colors cursor-pointer">
                          Admin
                        </Link>
                      )}
                    </div>

                    <div className="h-px bg-white/[0.04] my-1" />

                    {/* Footer */}
                    <button 
                      onClick={handleLogout} 
                      className="w-full flex items-center px-3 py-1.5 text-xs text-white/60 hover:text-red-400 hover:bg-white/[0.04] rounded-lg transition-colors cursor-pointer"
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