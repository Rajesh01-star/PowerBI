"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CheckCircle2, CreditCard, Mail, User } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateName: string;
  price: string;
}

export default function CheckoutModal({ isOpen, onClose, templateName, price }: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [checkoutType, setCheckoutType] = useState<'guest' | 'account' | null>(null);

  const handleClose = () => {
    setStep(1);
    setCheckoutType(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div>
                <h3 className="font-heading text-xl font-semibold">Secure Checkout</h3>
                <p className="text-white/50 text-sm mt-1">{templateName}</p>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 glass rounded-xl">
                    <span className="text-white/70">Total Due</span>
                    <span className="text-2xl font-mono text-indigo-400 font-medium">{price}</span>
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={() => { setCheckoutType('account'); setStep(2); }}
                      className="w-full flex items-center p-4 border border-white/10 rounded-xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4">
                        <User className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Create Account & Checkout</h4>
                        <p className="text-sm text-white/50">Save purchases and access future updates.</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => { setCheckoutType('guest'); setStep(2); }}
                      className="w-full flex items-center p-4 border border-white/10 rounded-xl hover:border-white/20 hover:bg-white/5 transition-all text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                        <Mail className="w-5 h-5 text-white/70" />
                      </div>
                      <div>
                        <h4 className="font-medium">Guest Checkout</h4>
                        <p className="text-sm text-white/50">Quick purchase without creating an account.</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  {checkoutType === 'account' && (
                    <div className="space-y-4 mb-6">
                      <h4 className="font-medium mb-2">Account Details</h4>
                      <input type="text" placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" />
                      <input type="password" placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" />
                    </div>
                  )}
                  
                  <h4 className="font-medium mb-2">Payment Information</h4>
                  <input type="email" placeholder="Email Address (for receipt & download link)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" />
                  
                  <div className="relative mt-4">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input type="text" placeholder="Card Number" className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <input type="text" placeholder="MM/YY" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" />
                    <input type="text" placeholder="CVC" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-heading font-semibold mb-2">Payment Successful!</h3>
                  <p className="text-white/60 mb-8 max-w-sm">Your template is ready. We've sent the receipt and download instructions to your email.</p>
                  <button onClick={handleClose} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition-colors">
                    Go to Dashboard
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {step < 3 && (
              <div className="p-6 border-t border-white/5 flex items-center justify-between bg-white/[0.02]">
                {step > 1 ? (
                  <button onClick={() => setStep(1)} className="text-sm text-white/50 hover:text-white transition-colors">Back</button>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Lock className="w-3 h-3" /> Secure 256-bit SSL
                  </div>
                )}
                
                {step === 2 && (
                  <button onClick={() => setStep(3)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm font-medium transition-colors">
                    Pay {price}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
