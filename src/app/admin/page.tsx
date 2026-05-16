"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Upload, FileText, Link as LinkIcon, DollarSign, Layout, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { createPostAction, getPostsAction, updatePostAction } from "./actions";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
    const { data: sessionData, isPending } = authClient.useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const [posts, setPosts] = useState<any[]>([]);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);

    // Form states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [aspect, setAspect] = useState<"horizontal" | "vertical">("horizontal");
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (sessionData?.user?.isAdmin) {
            fetchPosts();
        }
    }, [sessionData]);

    async function fetchPosts() {
        try {
            const data = await getPostsAction();
            setPosts(data);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        }
    }

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
                    <p className="text-xs text-white/60 mb-8">You need administrator privileges to view this page. If you believe this is an error, please contact support.</p>
                    <Link href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors w-full text-sm font-medium">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    function clearForm() {
        setEditingPostId(null);
        setTitle("");
        setDescription("");
        setPrice("");
        setAspect("horizontal");
        setUrl("");
        setStatus(null);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("aspect", aspect);
        formData.append("url", url);
        if (editingPostId) {
            formData.append("id", editingPostId);
        }

        try {
            if (editingPostId) {
                await updatePostAction(formData);
                setStatus({ type: 'success', message: 'Template successfully updated!' });
            } else {
                await createPostAction(formData);
                setStatus({ type: 'success', message: 'Template successfully published!' });
            }
            
            // Refresh list first
            fetchPosts();
            
            // Keep the success status visible but reset form fields
            const currentStatus = { type: 'success', message: editingPostId ? 'Template successfully updated!' : 'Template successfully published!' };
            clearForm();
            setStatus(currentStatus as { type: 'success', message: string });
            
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Failed to process request' });
        } finally {
            setIsLoading(false);
        }
    }

    function handleCardClick(post: any) {
        setEditingPostId(post.id);
        setTitle(post.title || "");
        setDescription(post.description || "");
        setPrice(post.price ? post.price.toString() : "");
        setAspect(post.aspect || "horizontal");
        setUrl(post.url || "");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-hidden py-24 px-4 relative">
            {/* Background glow effects */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10">
                <div className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-xl md:text-xl font-heading font-bold">Admin Portal</h1>
                            <p className="text-sm text-white/60">Upload and manage Power BI templates.</p>
                        </div>
                    </div>
                    <Link href="/" className="px-4 py-2 rounded-full glass hover:bg-white/10 text-xs font-medium transition-colors">
                        Exit Admin
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.02]"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
                            {editingPostId ? 'Edit Template' : 'Publish New Template'}
                        </h2>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={isLoading}
                            className="text-xs h-8 px-3 text-white/60 hover:text-white hover:bg-white/10"
                            onClick={clearForm}
                        >
                            {editingPostId ? 'Cancel Edit' : 'Clear'}
                        </Button>
                    </div>

                    {status && (
                        <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' : 'bg-red-500/10 border-red-500/20 text-red-200'}`}>
                            {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                            <p className="text-xs font-medium">{status.message}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-xs font-medium text-white/80 flex items-center gap-2">
                                    <FileText className="w-3.5 h-3.5 text-white/40" />
                                    Template Title <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                    type="text"
                                    name="title"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Finance Pro Exec Dashboard"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-xs font-medium text-white/80 flex items-center gap-2">
                                    <FileText className="w-3.5 h-3.5 text-white/40" />
                                    Description
                                </Label>
                                <Textarea
                                    name="description"
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Provide a detailed description of the template..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-white/80 flex items-center gap-2">
                                    <DollarSign className="w-3.5 h-3.5 text-white/40" />
                                    Price ($)
                                </Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    name="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-white/80 flex items-center gap-2">
                                    <Layout className="w-3.5 h-3.5 text-white/40" />
                                    Aspect Ratio <span className="text-red-400">*</span>
                                </Label>
                                <Select 
                                    name="aspect" 
                                    required 
                                    value={aspect} 
                                    onValueChange={(val) => {
                                        if (val) setAspect(val as "horizontal" | "vertical");
                                    }}
                                >
                                    <SelectTrigger className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all">
                                        <SelectValue placeholder="Select aspect ratio" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="horizontal">Horizontal (16:9)</SelectItem>
                                        <SelectItem value="vertical">Vertical (9:16)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-xs font-medium text-white/80 flex items-center gap-2">
                                    <LinkIcon className="w-3.5 h-3.5 text-white/40" />
                                    Power BI Embed URL
                                </Label>
                                <Input
                                    type="url"
                                    name="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://app.powerbi.com/view?r=..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isLoading}
                                className="w-full"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {editingPostId ? 'Updating...' : 'Publishing...'}
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        {editingPostId ? 'Update Template' : 'Publish Template'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>

                {/* Published Templates List */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-12"
                >
                    <h2 className="text-lg font-heading font-semibold mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-400" />
                        Published Templates
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {posts.map((post) => (
                            <div 
                                key={post.id} 
                                onClick={() => handleCardClick(post)}
                                className={`glass-card p-5 rounded-2xl border ${editingPostId === post.id ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-white/10 bg-white/[0.02]'} cursor-pointer hover:bg-white/[0.04] transition-all flex flex-col gap-2`}
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="font-medium text-sm text-white truncate pr-2">{post.title}</h3>
                                    {post.price && <span className="text-xs font-semibold text-emerald-400">${post.price}</span>}
                                </div>
                                {post.description && (
                                    <p className="text-xs text-white/50 line-clamp-2">{post.description}</p>
                                )}
                                <div className="flex gap-3 mt-2">
                                    <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 text-white/60">
                                        {post.aspect}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {posts.length === 0 && (
                            <p className="text-xs text-white/40 col-span-2 text-center py-8">No templates published yet.</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
