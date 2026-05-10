"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Upload, FileText, Link as LinkIcon, DollarSign, Layout, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { createPostAction } from "./actions";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function AdminPage() {
    const { data: sessionData, isPending } = authClient.useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // If loading session
    if (isPending) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    // If not logged in or not an admin
    if (!sessionData?.user?.isAdmin) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-4">
                <div className="text-center max-w-md w-full glass-card p-10 rounded-3xl border border-red-500/20 bg-red-500/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
                    <Shield className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-heading font-bold mb-3">Access Denied</h1>
                    <p className="text-white/60 mb-8">You need administrator privileges to view this page. If you believe this is an error, please contact support.</p>
                    <Link href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors w-full font-medium">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);

        const formData = new FormData(e.currentTarget);
        try {
            await createPostAction(formData);
            setStatus({ type: 'success', message: 'Template successfully published!' });
            (e.target as HTMLFormElement).reset();
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Failed to create template' });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-hidden py-24 px-4 relative">
             {/* Background glow effects */}
             <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10">
                <div className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <Shield className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-heading font-bold">Admin Portal</h1>
                            <p className="text-white/60">Upload and manage Power BI templates.</p>
                        </div>
                    </div>
                    <Link href="/" className="px-4 py-2 rounded-full glass hover:bg-white/10 text-sm font-medium transition-colors">
                        Exit Admin
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.02]"
                >
                    <h2 className="text-xl font-heading font-semibold mb-6 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-indigo-400" />
                        Publish New Template
                    </h2>

                    {status && (
                        <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' : 'bg-red-500/10 border-red-500/20 text-red-200'}`}>
                            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                            <p className="text-sm font-medium">{status.message}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-white/40" />
                                    Template Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    placeholder="e.g., Finance Pro Exec Dashboard"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-white/40" />
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    placeholder="Provide a detailed description of the template..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-white/40" />
                                    Price ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    name="price"
                                    placeholder="0.00"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                                    <Layout className="w-4 h-4 text-white/40" />
                                    Aspect Ratio <span className="text-red-400">*</span>
                                </label>
                                <select
                                    name="aspect"
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none"
                                >
                                    <option value="horizontal">Horizontal (16:9)</option>
                                    <option value="vertical">Vertical (9:16)</option>
                                </select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4 text-white/40" />
                                    Power BI Embed URL
                                </label>
                                <input
                                    type="url"
                                    name="url"
                                    placeholder="https://app.powerbi.com/view?r=..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5" />
                                        Publish Template
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
