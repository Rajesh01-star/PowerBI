"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Upload, FileText, Link as LinkIcon, DollarSign, Layout, CheckCircle2, AlertCircle, Loader2, Edit3, Plus, X, Eye, Laptop, ImageIcon } from "lucide-react";
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
    const [showForm, setShowForm] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Form states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [aspect, setAspect] = useState<"horizontal" | "vertical">("horizontal");
    const [url, setUrl] = useState("");
    
    // New states
    const [thumbnails, setThumbnails] = useState<string[]>([]);
    const [activeThumbnailIndex, setActiveThumbnailIndex] = useState<number>(0);
    const [zipFile, setZipFile] = useState<File | null>(null);
    
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

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

    // Handles the client-side visual image preview switch
    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file && thumbnails.length < 4) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnails(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        }
    }

    function removeThumbnail(index: number) {
        setThumbnails(prev => prev.filter((_, i) => i !== index));
        if (activeThumbnailIndex === index) {
            setActiveThumbnailIndex(0);
        } else if (activeThumbnailIndex > index) {
            setActiveThumbnailIndex(activeThumbnailIndex - 1);
        }
    }

    if (isPending) {
        return (
            <div className="min-h-screen bg-transparent flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                    <p className="text-xs text-muted-foreground">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    if (!sessionData?.user?.isAdmin) {
        return (
            <div className="min-h-screen bg-transparent flex flex-col items-center justify-center text-foreground p-4">
                <div className="text-center max-w-sm w-full glass-card p-6 rounded-2xl border border-red-500/15 bg-red-500/5">
                    <Shield className="w-10 h-10 text-red-500 mx-auto mb-4" />
                    <h1 className="text-sm font-bold mb-1">Access Denied</h1>
                    <Link href="/" className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-muted hover:bg-accent hover:text-accent-foreground text-xs transition-all w-full border border-border">Return Home</Link>
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
        setThumbnails([]);
        setActiveThumbnailIndex(0);
        setTags([]);
        setTagInput("");
        setZipFile(null);
        setStatus(null);
        setShowForm(false);
    }

    function openCreateForm() {
        clearForm();
        setShowForm(true);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("aspect", aspect);
        formData.append("url", url);
        formData.append("activeThumbnailIndex", activeThumbnailIndex.toString());
        formData.append("thumbnails", JSON.stringify(thumbnails));
        formData.append("tags", JSON.stringify(tags));
        
        if (zipFile) {
            formData.append("file", zipFile);
        }
        
        if (editingPostId) formData.append("id", editingPostId);

        try {
            if (editingPostId) {
                await updatePostAction(formData);
                setStatus({ type: 'success', message: '✓ Configuration updated!' });
            } else {
                await createPostAction(formData);
                setStatus({ type: 'success', message: '✓ Configuration published!' });
            }
            await fetchPosts();
            timeoutRef.current = setTimeout(() => { clearForm(); }, 1200);
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Failed to process request' });
        } finally {
            setIsLoading(false);
        }
    }

    function handleEditClick(post: any) {
        setEditingPostId(post.id);
        setTitle(post.title || "");
        setDescription(post.description || "");
        setPrice(post.price ? post.price.toString() : "");
        setAspect(post.aspect || "horizontal");
        setUrl(post.url || "");
        
        setThumbnails(post.thumbnails?.length ? post.thumbnails : (post.imageUrl ? [post.imageUrl] : []));
        setActiveThumbnailIndex(post.activeThumbnailIndex || 0);
        setTags(post.tags || []);
        
        setShowForm(true);
    }

    const totalTemplates = posts.length;
    const totalRevenue = posts.reduce((sum, post) => sum + (parseFloat(post.price) || 0), 0);

    return (
        <div className="min-h-screen bg-transparent text-foreground overflow-x-hidden relative select-none">
            <div className="max-w-7xl mx-auto px-6 pt-28 pb-8 space-y-8 relative z-10">
                
                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-border bg-card/60 shadow-sm backdrop-blur-md flex items-center justify-between">
                        <div className="space-y-0.5">
                            <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">Total Assets</p>
                            <p className="text-xl font-bold tracking-tight">{totalTemplates}</p>
                        </div>
                        <FileText className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-card/60 shadow-sm backdrop-blur-md flex items-center justify-between">
                        <div className="space-y-0.5">
                            <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">Combined Value</p>
                            <p className="text-xl font-bold tracking-tight">${totalRevenue.toFixed(2)}</p>
                        </div>
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                    </div>
                </div>

                {/* Sub-header Controls */}
                <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="space-y-0.5">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-foreground/80">Active Asset Portfolio</h2>
                        <p className="text-[11px] text-muted-foreground">{totalTemplates} functional items deployed</p>
                    </div>
                    {!showForm && (
                        <button onClick={openCreateForm} className="h-8 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-[11px] font-medium flex items-center gap-1.5 transition-all text-black animate-fade-in">
                            <Plus className="w-3.5 h-3.5" /> Create New Asset
                        </button>
                    )}
                </div>

                {/* Main Configuration Modal Workspace Overlay */}
                <AnimatePresence>
                    {showForm && (
                        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-5">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98, y: 10 }} 
                                animate={{ opacity: 1, scale: 1, y: 0 }} 
                                exit={{ opacity: 0, scale: 0.98, y: 10 }} 
                                transition={{ type: "spring", duration: 0.4 }}
                                className="bg-gradient-to-b from-[#18110E] to-[#0E0A09] border border-[#3E291F]/60 rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 lg:p-6 relative shadow-[0_0_50px_-12px_rgba(245,158,11,0.12)]"
                            >
                                <button 
                                    onClick={clearForm} 
                                    className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center bg-[#1D1412] border border-[#3E291F]/50 hover:bg-[#251A17] text-muted-foreground hover:text-white transition-colors z-20 cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                
                                {/* Form Core Setup Left */}
                                <div className="lg:col-span-7 space-y-4">
                                    <div className="flex items-center gap-3 pb-2.5 border-b border-[#3E291F]/40">
                                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500">
                                            <Edit3 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                                                {editingPostId ? 'Edit Configuration' : 'Global Asset Setup'}
                                            </h3>
                                            <p className="text-[9px] text-muted-foreground">Customize your Power BI interactive dashboard blueprint</p>
                                        </div>
                                    </div>
 
                                    <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                                        <div className="space-y-1">
                                            <Input 
                                                type="text" 
                                                required 
                                                value={title} 
                                                onChange={(e) => setTitle(e.target.value)} 
                                                placeholder="Template Title * (e.g., Executive Business Intelligence Board)" 
                                                className="w-full h-9 px-3 bg-[#130B09] border border-[#3E291F] rounded-xl text-xs text-white placeholder:text-white/40 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 focus-visible:ring-amber-500/10 focus-visible:border-amber-500/50 transition-all outline-none duration-150" 
                                            />
                                        </div>
 
                                        <div className="space-y-1">
                                            <Textarea 
                                                rows={2} 
                                                value={description} 
                                                onChange={(e) => setDescription(e.target.value)} 
                                                placeholder="Description (framework specifications / supplemental details)..." 
                                                className="w-full px-3 py-2 bg-[#130B09] border border-[#3E291F] rounded-xl text-xs text-white placeholder:text-white/40 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 focus-visible:ring-amber-500/10 focus-visible:border-amber-500/50 transition-all outline-none duration-150 resize-none min-h-[56px]" 
                                            />
                                        </div>
 
                                        {/* THUMBNAILS UPLOAD */}
                                        <div className="space-y-1.5">
                                            <div className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider">Thumbnails (Max 4)</div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                                                {thumbnails.map((thumb, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className={`relative rounded-xl overflow-hidden aspect-video border group/thumb transition-all duration-200 ${activeThumbnailIndex === idx ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-[#3E291F] hover:border-[#5C3E30]'}`}
                                                    >
                                                        <img src={thumb} alt="thumb" className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300" />
                                                        <div className="absolute top-1 right-1 flex gap-1 z-30 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                                            <button 
                                                                type="button" 
                                                                onClick={() => removeThumbnail(idx)} 
                                                                className="bg-black/80 hover:bg-red-500 p-1.5 rounded-lg text-white transition-colors cursor-pointer"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setActiveThumbnailIndex(idx)} 
                                                            className="absolute inset-0 z-10 flex items-end justify-center p-1.5 cursor-pointer bg-gradient-to-t from-black/60 via-transparent to-transparent"
                                                        >
                                                            {activeThumbnailIndex === idx ? (
                                                                <span className="bg-amber-500 text-black text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full shadow-[0_2px_8px_rgba(245,158,11,0.4)]">Primary</span>
                                                            ) : (
                                                                <span className="text-white text-[8px] bg-black/40 px-1.5 py-0.5 rounded opacity-0 group-hover/thumb:opacity-100 transition-opacity">Set Primary</span>
                                                            )}
                                                        </button>
                                                    </div>
                                                ))}
                                                {thumbnails.length < 4 && (
                                                    <div className="relative rounded-xl border border-dashed border-[#3E291F] hover:border-amber-500/50 bg-[#130B09]/40 hover:bg-[#130B09]/80 flex flex-col items-center justify-center aspect-video cursor-pointer transition-all duration-200 group">
                                                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                                                        <Plus className="w-5 h-5 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                                                        <span className="text-[9px] font-medium text-muted-foreground group-hover:text-amber-400 mt-1 transition-colors">Add Image</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
 
                                        {/* ZIP UPLOAD */}
                                        <div className="space-y-1">
                                            {zipFile ? (
                                                /* Attached state — compact row with file info + clear button */
                                                <div className="flex items-center gap-2.5 bg-[#0D1F15] border border-emerald-500/25 rounded-xl px-3 py-2">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[10px] font-semibold text-emerald-300 truncate">{zipFile.name}</p>
                                                        <p className="text-[9px] text-emerald-500/50">{(zipFile.size / 1024).toFixed(0)} KB · ZIP Archive</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setZipFile(null)}
                                                        className="w-5 h-5 rounded-md bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors cursor-pointer shrink-0"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                /* Empty state — compact horizontal row with Browse File CTA */
                                                <div className="relative border border-dashed border-[#3E291F] hover:border-amber-500/50 bg-[#0E0907] hover:bg-[#130B09]/60 rounded-xl transition-all duration-200 cursor-pointer group">
                                                    <input
                                                        type="file"
                                                        accept=".zip,application/zip"
                                                        onChange={(e) => setZipFile(e.target.files?.[0] || null)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className="flex items-center gap-3 px-3 py-2 pointer-events-none">
                                                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 group-hover:border-amber-500/35 flex items-center justify-center shrink-0 transition-all duration-200">
                                                            <Upload className="w-3.5 h-3.5 text-amber-500/70 group-hover:text-amber-400 transition-colors" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[10px] font-semibold text-white/70 group-hover:text-white transition-colors leading-none">
                                                                {editingPostId ? "Replace ZIP file" : "Upload ZIP file"}
                                                            </p>
                                                            <p className="text-[9px] text-white/30 mt-0.5">Drag & drop, or click Browse</p>
                                                        </div>
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 group-hover:bg-amber-500/20 group-hover:border-amber-500/40 text-[9px] font-semibold text-amber-400 group-hover:text-amber-300 transition-all duration-200 shrink-0">
                                                            Browse
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
 
                                        {/* TAGS */}
                                        <div className="space-y-1">
                                            <div className="flex flex-col gap-2">
                                                <Input 
                                                    type="text" 
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            const val = tagInput.trim();
                                                            if (val && !tags.includes(val)) {
                                                                setTags([...tags, val]);
                                                                setTagInput("");
                                                            }
                                                        }
                                                    }}
                                                    placeholder="Tags (Press Enter to add, e.g. Sales, Dark Mode, Finance)" 
                                                    className="w-full h-9 px-3 bg-[#130B09] border border-[#3E291F] rounded-xl text-xs text-white placeholder:text-white/40 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 focus-visible:ring-amber-500/10 focus-visible:border-amber-500/50 transition-all outline-none duration-150" 
                                                />
                                                {tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 bg-[#130B09]/40 border border-[#3E291F]/50 p-2 rounded-xl">
                                                        {tags.map((tag, idx) => (
                                                            <span key={idx} className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-lg text-[9px] flex items-center gap-1 hover:bg-amber-500/20 transition-all font-medium duration-150">
                                                                {tag}
                                                                <button type="button" onClick={() => setTags(tags.filter((_, i) => i !== idx))} className="hover:text-amber-300 transition-colors"><X className="w-2.5 h-2.5" /></button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
  
                                        {/* Row with Value, Aspect Ratio, and Power BI Link */}
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                            {/* Price/Value Column */}
                                            <div className="md:col-span-3">
                                                <Input 
                                                    type="number" 
                                                    step="0.01" 
                                                    min="0" 
                                                    value={price} 
                                                    onChange={(e) => setPrice(e.target.value)} 
                                                    placeholder="Price ($) - Free" 
                                                    className="w-full h-9 px-3 bg-[#130B09] border border-[#3E291F] rounded-xl text-xs text-white placeholder:text-white/40 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 focus-visible:ring-amber-500/10 focus-visible:border-amber-500/50 transition-all outline-none duration-150" 
                                                />
                                            </div>
                                            {/* Aspect Ratio Column */}
                                            <div className="md:col-span-4">
                                                <Select value={aspect} onValueChange={(val) => { if (val) setAspect(val as "horizontal" | "vertical"); }}>
                                                    <SelectTrigger className="w-full bg-[#130B09] border border-[#3E291F] rounded-xl text-xs h-9 px-3 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 focus-visible:ring-amber-500/10 focus-visible:border-amber-500/50 transition-all outline-none duration-150 data-[size=default]:h-9 data-[size=sm]:h-9">
                                                        <SelectValue placeholder="Format *" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-[#18110E] border border-[#3E291F] text-white text-xs shadow-xl rounded-xl ring-1 ring-black/40">
                                                        <SelectItem value="horizontal" className="hover:bg-amber-500/10 hover:text-amber-400 focus:bg-amber-500/10 focus:text-amber-400 text-xs py-2 rounded-lg cursor-pointer text-white">Horizontal (16:9)</SelectItem>
                                                        <SelectItem value="vertical" className="hover:bg-amber-500/10 hover:text-amber-400 focus:bg-amber-500/10 focus:text-amber-400 text-xs py-2 rounded-lg cursor-pointer text-white">Vertical (9:16)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            {/* Power BI Link Column */}
                                            <div className="md:col-span-5">
                                                <Input 
                                                    type="url" 
                                                    value={url} 
                                                    onChange={(e) => setUrl(e.target.value)} 
                                                    placeholder="Power BI Live Link (https://...)" 
                                                    className="w-full h-9 px-3 bg-[#130B09] border border-[#3E291F] rounded-xl text-xs text-white placeholder:text-white/40 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 focus-visible:ring-amber-500/10 focus-visible:border-amber-500/50 transition-all outline-none duration-150" 
                                                />
                                            </div>
                                        </div>
  
                                        <div className="flex gap-3 pt-3 border-t border-[#3E291F]/40">
                                            <button 
                                                type="button" 
                                                onClick={clearForm} 
                                                disabled={isLoading} 
                                                className="flex-1 h-9 rounded-xl bg-[#1D1412] hover:bg-[#251A17] text-muted-foreground hover:text-white border border-[#3E291F] transition-all duration-200 flex items-center justify-center font-medium cursor-pointer disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                type="submit" 
                                                disabled={isLoading} 
                                                className="flex-1 h-9 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold shadow-[0_4px_20px_rgba(245,158,11,0.15)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.3)] transition-all duration-200 border-none flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        {editingPostId ? "Update Blueprint" : "Publish Blueprint"}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
 
                                {/* Sandbox Card Visualizer Preview Right */}
                                <div className="lg:col-span-5 bg-gradient-to-br from-[#1C120E] via-[#0E0A08] to-[#050303] p-5 rounded-3xl border border-[#3E291F]/50 flex flex-col justify-between relative overflow-hidden min-h-[450px] shadow-inner">
                                    <div className="absolute inset-0 bg-[radial-gradient(#3E291F_1px,transparent_1px)] [background-size:16px_16px] opacity-35 pointer-events-none" />
                                    <div className="absolute top-[-20%] right-[-20%] w-[60%] aspect-square rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />
                                    <div className="absolute bottom-[-20%] left-[-20%] w-[60%] aspect-square rounded-full bg-orange-500/8 blur-[80px] pointer-events-none" />

                                    <div className="flex items-center justify-between z-10">
                                        <div className="flex items-center gap-2 text-[10px] text-amber-500/80 uppercase font-bold tracking-widest">
                                            <Laptop className="w-3.5 h-3.5" /> Real-time Asset Canvas
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full bg-[#18100E] border border-[#3E291F] text-[9px] font-mono text-muted-foreground uppercase tracking-wider shadow-sm">
                                            Preview
                                        </span>
                                    </div>
                                    
                                    <div className="flex-1 flex items-center justify-center p-4 z-10">
                                        <div className="w-full max-w-[240px] rounded-xl border border-[#3E291F] bg-[#110A08]/90 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-md hover:border-amber-500/30 transition-all duration-300 group">
                                            <div className={`w-full ${aspect === 'vertical' ? 'aspect-[3/4]' : 'aspect-video'} bg-[#1A1210] relative flex items-center justify-center border-b border-[#3E291F] overflow-hidden`}>
                                                {thumbnails.length > 0 ? (
                                                    <img 
                                                        src={thumbnails[activeThumbnailIndex] || thumbnails[0]} 
                                                        alt="Snapshot Preview" 
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-1.5 text-muted-foreground/35 font-mono text-[9px] select-none">
                                                        <ImageIcon className="w-5 h-5 text-[#3E291F]" />
                                                        <span>NO SNAPSHOT RENDERED</span>
                                                    </div>
                                                )}
                                                {url && (
                                                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-[8px] font-bold text-blue-300 uppercase tracking-wide shadow-sm backdrop-blur-sm">
                                                        Live Link
                                                    </span>
                                                )}
                                                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#0F0A09]/80 border border-[#3E291F] text-[8px] uppercase tracking-wider text-amber-400 font-bold font-mono shadow-sm">
                                                    {aspect}
                                                </span>
                                            </div>
                                            <div className="p-4 space-y-2">
                                                <div className="flex items-start justify-between gap-3">
                                                    <h4 className="font-bold text-xs text-foreground/90 truncate flex-1 group-hover:text-amber-400 transition-colors">
                                                        {title || "Untitled Blueprint"}
                                                    </h4>
                                                    <span className="text-xs font-mono text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg shadow-sm">
                                                        {price ? `$${parseFloat(price).toFixed(2)}` : "Free"}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed min-h-[30px]">
                                                    {description || "No supplemental details provided for this blueprint asset. Add description on the form."}
                                                </p>
                                                
                                                {tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 pt-2 border-t border-[#3E291F]/30">
                                                        {tags.slice(0, 3).map((tag, i) => (
                                                            <span key={i} className="text-[8px] font-semibold text-[#A08B7E] bg-[#1D1412] px-1.5 py-0.5 rounded border border-[#3E291F]/30">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                        {tags.length > 3 && (
                                                            <span className="text-[8px] text-muted-foreground/50 font-mono">
                                                                +{tags.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center text-[9px] text-muted-foreground/40 font-mono tracking-wider pt-3 border-t border-[#3E291F]/30 z-10">
                                        BLUEPRINT RENDER ENGINE v1.2
                                    </div>
                                </div>
 
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Portfolio Asset Registry Grid */}
                {posts.length === 0 ? (
                    <div className="border border-border bg-card p-10 rounded-xl text-center max-w-md mx-auto shadow-sm">
                        <FileText className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
                        <Button onClick={openCreateForm} className="bg-muted text-[11px] h-8 px-3">Add Asset</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[280px] gap-4">
                        {posts.map((post) => (
                            <div key={post.id} className={`group bg-card rounded-xl border border-border hover:border-border/80 transition-all overflow-hidden flex flex-col relative shadow-sm hover:shadow-md ${post.aspect === 'vertical' ? 'row-span-2' : 'row-span-1'}`}>
                                <div className={`w-full ${post.aspect === 'vertical' ? 'flex-1' : 'aspect-video'} bg-muted/40 relative flex items-center justify-center border-b border-border overflow-hidden`}>
                                    
                                    {post.thumbnails?.length > 0 ? (
                                        /* Displays the active thumbnail image directly in the cards portfolio grid */
                                        <img src={post.thumbnails[post.activeThumbnailIndex] || post.thumbnails[0]} alt={post.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                    ) : post.imageUrl ? (
                                        /* Fallback for legacy single image */
                                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                    ) : (
                                        <FileText className="w-5 h-5 text-muted-foreground/20" />
                                    )}

                                    <div className="absolute top-2 left-2 z-10">
                                        <span className="px-1 py-0.5 rounded bg-muted border border-border text-[9px] font-mono text-muted-foreground uppercase tracking-wider">{post.aspect}</span>
                                    </div>
                                    
                                    <div onClick={() => handleEditClick(post)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer z-20">
                                        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-md">
                                            <Edit3 className="w-3.5 h-3.5 text-white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                                    <div>
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="font-medium text-xs text-foreground truncate">{post.title}</h3>
                                            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">${post.price ? parseFloat(post.price).toFixed(2) : "0.00"}</span>
                                        </div>
                                        {post.description && <p className="text-[11px] text-muted-foreground line-clamp-1 leading-normal">{post.description}</p>}
                                    </div>
                                    <div className="pt-2 border-t border-border flex items-center justify-end">
                                        <button onClick={() => handleEditClick(post)} className="text-[11px] font-medium text-amber-500 hover:text-amber-400 hover:underline flex items-center gap-0.5 cursor-pointer">Configure Space →</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}