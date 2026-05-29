import { Mail, Phone, MapPin, Clock, ShieldCheck } from "lucide-react";
import { ContactForm } from "./ContactForm";
import { PageShell } from "@/components/shared/PageShell";

export const metadata = {
  title: "Contact Us - GENGRAPHS AND GRAPHICS PVT LTD®",
  description: "Get in touch with GENGRAPHS AND GRAPHICS PVT LTD®, founded by Mohit Bhardwaj. Secure an analytics consultation or custom Power BI and design deployment.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <main className="relative z-10 flex-grow pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          

          {/* Page Header */}
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-500 mb-4 backdrop-blur-md">
              <span>Direct Strategy Link</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
              Get in Touch with <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 bg-clip-text text-transparent">Mohit Bhardwaj</span>
            </h1>
            <p className="max-w-xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Have a complex analytics challenge, custom visual request, or interface mockup project? Let&apos;s deploy a high-fidelity business intelligence solution together.
            </p>
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
            
            {/* Left Column: Premium Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Strategic Framework Card */}
              <div className="rounded-3xl bg-card border border-border p-6 backdrop-blur-xl shadow-sm">
                <h2 className="text-base font-bold text-foreground mb-3">Studio Touchpoints</h2>
                <div className="h-0.5 w-8 bg-amber-500 rounded-full mb-6" />
                
                <div className="space-y-4">
                  {/* Email */}
                  <a 
                    href="mailto:info@gengraphsandgraphics.com" 
                    className="group flex gap-4 items-center p-3 rounded-2xl border border-transparent hover:border-border hover:bg-accent/30 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Secure Email</div>
                      <div className="text-xs font-semibold text-foreground mt-0.5 group-hover:text-amber-500 transition-colors">info@gengraphsandgraphics.com</div>
                    </div>
                  </a>
 
                  {/* Office SLA */}
                  <div className="flex gap-4 items-center p-3 rounded-2xl border border-transparent">
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Response SLA</div>
                      <div className="text-xs font-semibold text-foreground mt-0.5">Guaranteed within 12 Hours</div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex gap-4 items-center p-3 rounded-2xl border border-transparent">
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Location Hub</div>
                      <div className="text-xs font-semibold text-foreground mt-0.5">New Delhi, India (Global Remote)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Matrix Highlight */}
              <div className="rounded-3xl bg-card/60 p-6 border border-border/80 shadow-xs backdrop-blur-md space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Strategic Delivery Pillars</h3>
                
                <div className="space-y-3">
                  <div className="flex gap-2.5 items-start">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-[11px] text-muted-foreground leading-relaxed">
                      <strong className="text-foreground font-semibold">Custom Power BI Solutions:</strong> High-performance DAX architecture, semantic modeling, and executive-level report layers.
                    </span>
                  </div>
                  
                  <div className="flex gap-2.5 items-start">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-[11px] text-muted-foreground leading-relaxed">
                      <strong className="text-foreground font-semibold">Premium Interface Design:</strong> End-to-end UX/UI mapping in Figma and Adobe XD matching your corporate brand guidelines.
                    </span>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-[11px] text-muted-foreground leading-relaxed">
                      <strong className="text-foreground font-semibold">Interactive Presentations:</strong> Boardroom-ready pitch decks and slide matrices built to translate intelligence instantly.
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-5">
              <ContactForm />
            </div>

          </div>

        </div>
      </main>
    </PageShell>
  );
}
