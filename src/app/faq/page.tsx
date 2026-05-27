"use client";

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    question: "What formats do your templates support?",
    answer: "Our premium templates are engineered specifically for Power BI (.pbix). Some specialized templates may include supplementary Excel datasets or layout guides."
  },
  {
    question: "How do I access my templates after purchase?",
    answer: "Once your secure settlement is complete, you will receive an encrypted ledger gateway link via email, which contains a persistent download link for your purchased assets."
  },
  {
    question: "Do you offer custom dashboard development?",
    answer: "Yes. Gengraphs & Graphics provides specialized engineering for custom data visualization matrices. Please use the Assistance Request modal in our footer or visit the Contact page to submit your requirements."
  },
  {
    question: "Are updates included with the template?",
    answer: "Yes, minor updates and bug fixes for the templates you purchase are included. You can re-download the latest version using your original secure download link."
  },
  {
    question: "What is your typical Response SLA?",
    answer: "For all support inquiries and custom development requests submitted via our Help modal, we guarantee a response within 12 hours."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-transparent text-foreground pb-24 selection:bg-amber-500/30">
      <div className="max-w-3xl mx-auto px-6 pt-32 space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs font-medium transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500 shadow-sm">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-foreground">Frequently Asked Questions</h1>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl font-sans">
            Find answers to common questions about our Power BI templates, licensing, and custom data visualization services.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className={`border rounded-xl transition-all duration-300 ${isOpen ? 'bg-card border-amber-500/30 shadow-md' : 'bg-card/30 border-border hover:border-border/80'}`}
              >
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                >
                  <span className="font-semibold text-sm text-foreground pr-8">{faq.question}</span>
                  <div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-500' : 'text-muted-foreground'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-5 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-border/10 mt-2">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Still need help */}
        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-center space-y-3">
          <h3 className="font-serif font-bold text-lg text-foreground">Still need help?</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">If you couldn't find the answer to your question, feel free to reach out to our team.</p>
          <div className="pt-2">
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-background border border-border hover:border-amber-500/50 hover:text-amber-500 text-xs font-medium transition-colors shadow-sm"
            >
              Contact Support
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
