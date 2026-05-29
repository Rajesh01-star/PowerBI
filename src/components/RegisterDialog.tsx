"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function RegisterDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  forceLoginView = false,
  trigger
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  forceLoginView?: boolean;
  trigger?: React.ReactNode;
} = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const [isLoginView, setIsLoginView] = useState(forceLoginView);

  useEffect(() => {
    setIsLoginView(forceLoginView);
  }, [forceLoginView]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLoginView) {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });
        if (error) throw new Error(error.message || "Failed to sign in");
      } else {
        if (!name) throw new Error("Name is required");
        const { error } = await authClient.signUp.email({
          email,
          password,
          name,
        });
        if (error) throw new Error(error.message || "Failed to sign up");
      }
      if (isControlled && controlledOnOpenChange) {
        controlledOnOpenChange(false);
      } else {
        setUncontrolledOpen(false);
      }
      window.location.reload(); // Refresh the page to show logged-in state
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.pathname, // Stay on the same page
      });
    } catch (err: any) {
      setError("Google login failed");
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled && controlledOnOpenChange) {
      controlledOnOpenChange(newOpen);
    } else {
      setUncontrolledOpen(newOpen);
    }
    if (!newOpen) {
      setTimeout(() => {
        setIsLoginView(forceLoginView);
        setError("");
        setEmail("");
        setPassword("");
        setName("");
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger ? (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      ) : (
        !isControlled && (
          <DialogTrigger asChild>
            <Button className="text-[13px] font-medium bg-foreground text-background hover:bg-foreground/90 px-4 py-5 transition-colors cursor-pointer">
              Register
            </Button>
          </DialogTrigger>
        )
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isLoginView ? "Welcome back" : "Create an account"}
          </DialogTitle>
          <DialogDescription>
            {isLoginView
              ? "Sign in to your account to continue."
              : "Sign up to get started with your account."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center text-destructive text-sm">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {!isLoginView && (
            <div>
              <Label className="block mb-1.5 text-foreground/80 font-semibold">
                Full Name
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground z-10">
                  <User className="h-4 w-4" />
                </div>
                <Input
                  type="text"
                  required={!isLoginView}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-9 pr-3 py-5 !bg-white !text-black border-zinc-200 placeholder-zinc-400 focus-visible:ring-amber-500/50"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div>
            <Label className="block mb-1.5 text-foreground/80 font-semibold">
              Email Address
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground z-10">
                <Mail className="h-4 w-4" />
              </div>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-9 pr-3 py-5 bg-white text-black border-zinc-200 placeholder-zinc-400 focus-visible:ring-amber-500/50"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <Label className="block mb-1.5 text-foreground/80 font-semibold">
              Password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground z-10">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-9 pr-3 py-5 bg-white text-black border-zinc-200 placeholder-zinc-400 focus-visible:ring-amber-500/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-5 px-4 rounded-lg text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-4 cursor-pointer"
          >
            {loading ? "Please wait..." : isLoginView ? "Sign in" : "Sign up"}
            {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
          </Button>
        </form>

        <div className="mt-2">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-popover text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-4">
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center px-4 py-2 bg-input/10 border-border text-sm font-medium text-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </div>
        </div>

        <div className="mt-2 text-center text-sm">
          <span className="text-muted-foreground">
            {isLoginView ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError("");
            }}
            className="ml-2 font-medium text-amber-500 hover:text-amber-400 focus:outline-none cursor-pointer"
          >
            {isLoginView ? "Sign up" : "Sign in"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
