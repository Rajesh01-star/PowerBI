"use client";

import React, { useState } from 'react';
import { Shield, Mail, Phone, X, Send } from 'lucide-react';
import { FaLinkedin, FaInstagram, FaTwitter, FaYoutube, FaFacebook } from 'react-icons/fa';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
      // In a real app we'd show a success toast here
    }, 1000);
  };

  return (
    <>
      <footer className="border-t border-border bg-card/30 backdrop-blur-xl relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12 text-xs">
          {/* Top Row: Full-width Branding & Description */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/40 pb-8 mb-10">
            <div className="flex items-center gap-3">
              <img src="/icons/logo.png" alt="Logo" className="h-9 w-auto object-contain drop-shadow-sm" />
              <BrandLogo size="md" />
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed max-w-md">
              Premium engineered data visualization matrices and deployment assets built for enterprise pipelines.
            </p>
          </div>

          {/* Grid Columns for Directories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 items-start">

            {/* Column 2: Navigation & Security */}
            <div className="space-y-6">
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Navigation Workspace</h4>
                <div className="flex flex-col gap-1.5 text-muted-foreground/80">
                  <Link href="/" className="hover:text-foreground transition-colors text-[11px]">Showroom Matrix</Link>
                  <Link href="#live-demo" className="hover:text-foreground transition-colors text-[11px]">Active Blueprints</Link>
                </div>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Secure Settlement</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted border border-border p-2 rounded-lg max-w-[220px]">
                  <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Encrypted Ledger Gateway Active</span>
                </div>
              </div>
            </div>

            {/* Column 3: Contact & Socials */}
            <div className="space-y-6">
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Contact Hub</h4>
                <div className="flex flex-col gap-2 text-muted-foreground/80">
                  <a href="mailto:info@gengraphsandgraphics.com" className="flex items-center gap-2 hover:text-foreground transition-colors text-[11px]">
                    <Mail className="w-3.5 h-3.5" /> info@gengraphsandgraphics.com
                  </a>
                  <a href="tel:+919211217121" className="flex items-center gap-2 hover:text-foreground transition-colors text-[11px]">
                    <Phone className="w-3.5 h-3.5" /> +91 9211217121
                  </a>
                </div>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Social Networks</h4>
                <div className="flex items-center gap-3">
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><FaLinkedin className="w-4 h-4" /></a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><FaInstagram className="w-4 h-4" /></a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><FaTwitter className="w-4 h-4" /></a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><FaYoutube className="w-4 h-4" /></a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><FaFacebook className="w-4 h-4" /></a>
                </div>
              </div>
            </div>

            {/* Column 4: Help & Assistance */}
            <div className="space-y-4">
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Help</h4>
                <div className="flex flex-col gap-1.5 text-muted-foreground/80">
                  <Link href="/faq" className="hover:text-foreground transition-colors text-[11px]">FAQ</Link>
                  <Link href="/contact" className="hover:text-foreground transition-colors text-[11px]">Contact Us</Link>
                </div>
              </div>
{/* 
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-2 w-full max-w-[200px] h-9 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                GENGRAPHS Assistance
              </button> */}
            </div>

          </div>
        </div>

        {/* Footer Bottom copyright seal */}
        <div className="max-w-7xl mx-auto px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-muted-foreground/60 font-mono">
          <p>© {new Date().getFullYear()} GENGRAPHS AND GRAPHICS PVT LTD®. ALL RIGHTS RESERVED.</p>
          <p className="tracking-tighter">BUILT FOR POWER BI TOPOLOGY</p>
        </div>
      </footer>

      {/* Assistance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="p-6 space-y-6">
              <div className="space-y-1.5">
                <h3 className="text-lg font-serif font-bold text-foreground">Assistance Request</h3>
                <p className="text-xs text-muted-foreground">Please fill out the form below and our team will get back to you shortly.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 transition-shadow"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 transition-shadow"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Mobile Number</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 transition-shadow"
                    placeholder="+91 9000000000"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Message</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 transition-shadow min-h-[100px] resize-y"
                    placeholder="How can we help you?"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-10 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 disabled:opacity-50 text-xs text-white font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-md mt-2"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Submit Request
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
