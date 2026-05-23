"use client";

import { useState } from "react";
import { Mail, User, Send, AlertCircle, CheckCircle2, MessageSquare, ArrowRight, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Consulting");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setSuccess(true);
      // Reset form
      setName("");
      setEmail("");
      setSubject("Consulting");
      setMessage("");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-card/60 p-8 sm:p-12 text-center backdrop-blur-xl shadow-xl animate-in fade-in zoom-in duration-500">
        {/* Glow behind success */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Transmission Successful!
          </h3>
          <p className="max-w-md mx-auto text-xs sm:text-sm text-muted-foreground leading-relaxed mb-8">
            Your inquiry has been cataloged in our engineering queue. Mohit Bhardwaj or one of our senior strategy analysts will initiate contact within 12 hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
            <Button
              onClick={() => setSuccess(false)}
              variant="outline"
              size="sm"
              className="text-xs font-semibold hover:bg-accent border-border/60 transition-all cursor-pointer h-9 px-4 rounded-xl"
            >
              Send Another Message
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              size="sm"
              className="text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-black hover:-translate-y-0.5 transition-all shadow-[0_10px_20px_rgba(245,158,11,0.25)] hover:shadow-[0_10px_25px_rgba(245,158,11,0.4)] h-9 px-4 rounded-xl cursor-pointer"
            >
              Return to Showroom
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/40 p-6 sm:p-8 backdrop-blur-md shadow-lg">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] rounded-full pointer-events-none" />
      
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="w-4.5 h-4.5 text-amber-500" />
          Configure Inquiry
        </h3>
        <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
          Provide your specifications below to initiate a strategic workspace deployment.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center text-destructive text-xs animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="block mb-1.5 text-xs text-foreground/80 font-medium">
            Your Name
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted-foreground z-10">
              <User className="h-3.5 w-3.5" />
            </div>
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full pl-8 pr-3 h-8 text-xs bg-input/10 border-border text-foreground placeholder-muted-foreground focus-visible:ring-amber-500/30 focus-visible:border-ring rounded-lg"
              placeholder="John Adams"
            />
          </div>
        </div>

        <div>
          <Label className="block mb-1.5 text-xs text-foreground/80 font-medium">
            Email Address
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted-foreground z-10">
              <Mail className="h-3.5 w-3.5" />
            </div>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-8 pr-3 h-8 text-xs bg-input/10 border-border text-foreground placeholder-muted-foreground focus-visible:ring-amber-500/30 focus-visible:border-ring rounded-lg"
              placeholder="john@adams.com"
            />
          </div>
        </div>

        <div>
          <Label className="block mb-1.5 text-xs text-foreground/80 font-medium">
            Inquiry Type
          </Label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full h-8 px-2.5 py-1 text-xs bg-input/10 border border-border text-foreground hover:bg-input/20 transition-colors outline-none focus-visible:ring-amber-500/30 focus-visible:border-ring focus-visible:ring-2 focus-visible:outline-none rounded-lg cursor-pointer"
          >
            <option value="Consulting" className="bg-popover text-foreground">Data Analytics &amp; Power BI Consulting</option>
            <option value="Custom Design" className="bg-popover text-foreground">Bespoke UI/UX &amp; Graphic Design</option>
            <option value="Template Support" className="bg-popover text-foreground">Template Support &amp; Technical Queries</option>
            <option value="Partnership" className="bg-popover text-foreground">Business Collaboration / Partnership</option>
            <option value="General" className="bg-popover text-foreground">General Workspace Inquiry</option>
          </select>
        </div>

        <div>
          <Label className="block mb-1.5 text-xs text-foreground/80 font-medium">
            Project Specifications
          </Label>
          <Textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="block w-full px-3 py-2 text-xs bg-input/10 border-border text-foreground placeholder-muted-foreground focus-visible:ring-amber-500/30 focus-visible:border-ring rounded-lg min-h-24 field-sizing-content"
            placeholder="Describe your analytics goals, target audience, and preferred design stack..."
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="mx-auto w-fit flex items-center justify-center h-8 rounded-lg text-xs font-semibold text-black bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4 cursor-pointer shadow-[0_4px_12px_rgba(245,158,11,0.2)]"
        >
          {loading ? (
            <span className="flex items-center gap-1">
              <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Deploying Matrix...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <span>Transmit Secure Inquiry</span>
              <Send className="w-2.5 h-2.5" />
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}
