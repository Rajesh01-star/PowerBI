"use client";

import React from 'react';
import Link from 'next/link';
import { Command, Maximize, User as UserIcon, LogOut } from 'lucide-react';
import { RegisterDialog } from './RegisterDialog';
import { authClient } from '@/lib/auth-client';

export function Navbar() {
  const { data: sessionData } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  return (
    <>
      <div className="fixed top-3 sm:top-6 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none">
        <div className="w-full max-w-3xl pointer-events-auto">
          <nav className="bg-[#111111]/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border-white/[0.08] flex w-full items-center justify-between rounded-2xl border px-3 sm:px-5 h-[40px] sm:h-[44px] pr-2 sm:pr-2.5 backdrop-blur-md">
            <div className="flex items-center gap-2 py-1 text-sm font-semibold">
              <img src="https://cdn.skiper-ui.com/logos/logo.svg" alt="Logo" className="w-6 h-6" />
              <Link href="/" className="text-white tracking-wide hidden xs:block">SKIPER-UI</Link>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4 text-[12px] sm:text-[13px]">
              <Link 
                className="rounded-md opacity-50 outline-offset-4 outline-sky-500 hover:opacity-100 focus-visible:outline-1 transition-opacity" 
                href="/pricing"
              >
                Pricing
              </Link>
              <Link 
                className="relative text-white/50 hover:text-white flex gap-1 rounded-md outline-offset-4 outline-sky-500 focus-visible:outline-1 transition-colors" 
                href="/components"
              >
                Components
              </Link>
              
              {!sessionData?.user && <RegisterDialog />}
            </div>
          </nav>
        </div>
      </div>

      {sessionData?.user && (
        <div className="fixed top-3 right-3 sm:top-6 sm:right-6 z-50">
          <nav className="bg-[#111111]/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border-white/[0.08] flex items-center gap-3 rounded-2xl border px-3 sm:px-4 h-[40px] sm:h-[44px] backdrop-blur-md">
            <div className="flex items-center text-white/80" title={sessionData.user.name}>
              <UserIcon className="w-4 h-4 text-white/70" />
            </div>
            
            {sessionData.user.isAdmin && (
              <>
                <div className="w-px h-4 bg-white/10 hidden sm:block" />
                <Link href="/admin" className="text-indigo-400 hover:text-indigo-300 text-[12px] sm:text-[13px] font-medium hidden sm:block">
                  Admin
                </Link>
              </>
            )}
            
            <div className="w-px h-4 bg-white/10" />
            
            <button 
              onClick={handleLogout} 
              className="text-white/60 hover:text-red-400 transition-colors flex items-center"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </nav>
        </div>
      )}
    </>
  );
}