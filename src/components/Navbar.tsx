"use client";

import Link from 'next/link';
import { BarChart3 } from 'lucide-react';
import { authClient } from "@/lib/auth-client";
import { usePathname } from 'next/navigation';

export function Navbar() {
  const { data: sessionData, isPending } = authClient.useSession();
  const pathname = usePathname();

  // Hide navbar on login/signup pages if desired, but user said "after login in also show the same navbar with in all protected route4s"
  // If they want it everywhere, we just return it. 
  if (pathname === '/login' || pathname === '/signup') {
    // Optionally return null or still show it. Let's show it but maybe simplified. Or just return null if it's a full-screen login.
    // I will return null for login page to keep the auth pages clean, but it will show on admin, dashboard, marketplace, etc.
    return null;
  }

  const handleLogout = async () => {
      await authClient.signOut();
      window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b-0 border-white/5 py-4 px-8 flex justify-between items-center">
      <Link href="/" className="font-heading font-bold text-2xl tracking-tight flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-indigo-500" />
        Lumina
      </Link>
      <div className="flex gap-6 items-center">
        <Link href="/marketplace" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Marketplace</Link>
        <Link href="/dashboard" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Dashboard</Link>
        {sessionData?.user?.isAdmin && (
           <Link href="/admin" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Admin Portal</Link>
        )}
        
        {isPending ? (
           <div className="w-20 h-9 rounded-full bg-white/5 animate-pulse" />
        ) : sessionData ? (
           <button onClick={handleLogout} className="px-5 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 text-sm font-medium transition-all">
             Logout
           </button>
        ) : (
           <Link href="/login" className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-medium transition-all">
             Sign In
           </Link>
        )}
      </div>
    </nav>
  );
}
