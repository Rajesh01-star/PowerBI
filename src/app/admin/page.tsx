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
                    <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
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
                        <FileText className="w-4 h-4 text-indigo-400" />
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
                        <button onClick={openCreateForm} className="h-8 px-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-[11px] font-medium flex items-center gap-1.5 transition-all text-white">
                            <Plus className="w-3.5 h-3.5" /> Create New Asset
                        </button>
                    )}
                </div>

                {/* Main Configuration Modal Workspace Overlay */}
                <AnimatePresence>
                    {showForm && (
                        <div className="fixed inset-0 z-50 bg-background/85 backdrop-blur-sm flex items-center justify-center p-5">
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 relative shadow-xl">
                                <button onClick={clearForm} className="absolute top-1 right-1 w-6 h-6 rounded-md flex items-center justify-center hover:bg-muted text-muted-foreground z-10 cursor-pointer">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                                
                                {/* Form Core Setup Left */}
                                <div className="lg:col-span-7 space-y-4">
                                    <div className="flex items-center justify-between pb-2 border-b border-border">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/80">{editingPostId ? 'Edit Configuration' : 'Global Asset Setup'}</h3>
                                    </div>
 
                                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                                        <div className="space-y-1">
                                            <Label className="text-[11px] text-muted-foreground">Template Title *</Label>
                                            <Input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Executive Business Intelligence Board" className="bg-muted/20 border-border text-xs h-9" />
                                        </div>
 
                                        <div className="space-y-1">
                                            <Label className="text-[11px] text-muted-foreground">Description</Label>
                                            <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Summary framework specifications..." className="bg-muted/20 border-border text-xs rounded-lg resize-none" />
                                        </div>
 
                                        {/* THUMBNAILS UPLOAD */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-[11px] text-muted-foreground">Thumbnails (Max 4)</Label>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                {thumbnails.map((thumb, idx) => (
                                                    <div key={idx} className={`relative rounded-md overflow-hidden aspect-video border ${activeThumbnailIndex === idx ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-border'}`}>
                                                        <img src={thumb} alt="thumb" className="w-full h-full object-cover" />
                                                        <div className="absolute top-1 right-1 flex gap-1 z-20">
                                                            <button type="button" onClick={() => removeThumbnail(idx)} className="bg-black/60 p-1 rounded hover:bg-red-500/80 text-white"><X className="w-3 h-3" /></button>
                                                        </div>
                                                        <button type="button" onClick={() => setActiveThumbnailIndex(idx)} className="absolute inset-0 z-10 flex items-end p-1 cursor-pointer">
                                                            {activeThumbnailIndex === idx && <span className="bg-indigo-500 text-white text-[8px] px-1 rounded">Primary</span>}
                                                        </button>
                                                    </div>
                                                ))}
                                                {thumbnails.length < 4 && (
                                                    <div className="relative rounded-md border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center aspect-video cursor-pointer hover:border-indigo-400">
                                                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                        <Plus className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-[8px] text-muted-foreground mt-1">Add Image</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* ZIP UPLOAD */}
                                        <div className="space-y-1">
                                            <Label className="text-[11px] text-muted-foreground">Downloadable ZIP File</Label>
                                            <div className="relative border border-dashed border-border hover:border-accent-foreground/30 rounded-lg p-3 bg-muted/20 text-center transition-colors cursor-pointer group">
                                                <input type="file" accept=".zip,application/zip" onChange={(e) => setZipFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                <div className="flex flex-col items-center gap-1 text-muted-foreground group-hover:text-foreground">
                                                    <Upload className="w-3 h-3 text-emerald-400" />
                                                    <p className="text-[10px] font-medium">{zipFile ? zipFile.name : editingPostId ? "Upload new ZIP (replaces existing)" : "Click to select .zip asset"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* TAGS */}
                                        <div className="space-y-1">
                                            <Label className="text-[11px] text-muted-foreground">Tags (Press Enter to add)</Label>
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
                                                    placeholder="e.g. Sales, Dark Mode" 
                                                    className="bg-muted/20 border-border text-xs h-9" 
                                                />
                                                <div className="flex flex-wrap gap-1">
                                                    {tags.map((tag, idx) => (
                                                        <span key={idx} className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                                                            {tag}
                                                            <button type="button" onClick={() => setTags(tags.filter((_, i) => i !== idx))} className="hover:text-indigo-300"><X className="w-2.5 h-2.5" /></button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
 
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <Label className="text-[11px] text-muted-foreground">Value ($)</Label>
                                                <Input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Free" className="bg-muted/20 border-border text-xs h-9" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[11px] text-muted-foreground">Aspect Ratio *</Label>
                                                <Select value={aspect} onValueChange={(val) => { if (val) setAspect(val as "horizontal" | "vertical"); }}>
                                                    <SelectTrigger className="bg-muted/20 border-border text-xs h-9">
                                                        <SelectValue placeholder="Format" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
                                                        <SelectItem value="horizontal">Horizontal (16:9)</SelectItem>
                                                        <SelectItem value="vertical">Vertical (9:16)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
 
                                        <div className="space-y-1">
                                            <Label className="text-[11px] text-muted-foreground">Power BI Live Link</Label>
                                            <Input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://app.powerbi.com/view?..." className="bg-muted/20 border-border text-xs h-9" />
                                        </div>
 
                                        <div className="flex gap-2 pt-2 border-t border-border">
                                            <Button type="button" onClick={clearForm} disabled={isLoading} className="flex-1 bg-muted hover:bg-accent text-muted-foreground h-9">Cancel</Button>
                                            <Button type="submit" disabled={isLoading} className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white h-9">
                                                {isLoading ? <Loader2 className="w-3 animate-spin" /> : editingPostId ? "Update" : "Save"}
                                            </Button>
                                        </div>
                                    </form>
                                </div>

                                {/* Sandbox Card Visualizer Preview Right */}
                                <div className="lg:col-span-5 space-y-2 bg-muted/20 p-4 rounded-xl border border-border flex flex-col justify-between">
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                        <Laptop className="w-3 h-3" /> Real-time Asset Canvas Preview
                                    </div>
                                    
                                    <div className="flex-1 flex items-center justify-center p-3">
                                        <div className="w-full max-w-[240px] rounded-xl border border-border bg-card overflow-hidden shadow-xl">
                                            <div className={`w-full ${aspect === 'vertical' ? 'aspect-[3/4]' : 'aspect-video'} bg-muted/40 relative flex items-center justify-center border-b border-border overflow-hidden`}>
                                                {thumbnails.length > 0 ? (
                                                    /* Dynamic live uploaded thumbnail placeholder graphic */
                                                    <img src={thumbnails[activeThumbnailIndex] || thumbnails[0]} alt="Snapshot Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-1 text-muted-foreground/30 font-mono text-[9px]">
                                                        <ImageIcon className="w-5 h-5" />
                                                        <span>NO SNAPSHOT TRACKED</span>
                                                    </div>
                                                )}
                                                {url && <span className="absolute top-2 right-2 px-1 rounded bg-blue-500/10 border border-blue-500/20 text-[8px] font-bold text-blue-300 uppercase">Live link</span>}
                                                <span className="absolute top-2 left-2 px-1 rounded bg-muted/80 text-[8px] uppercase tracking-wider text-muted-foreground">{aspect}</span>
                                            </div>
                                            <div className="p-3 space-y-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h4 className="font-semibold text-xs truncate text-foreground/90">{title || "Untitled Blueprint Asset"}</h4>
                                                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">${price ? parseFloat(price).toFixed(2) : "0.00"}</span>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground line-clamp-2 leading-tight min-h-[24px]">{description || "No supplemental details provided."}</p>
                                            </div>
                                        </div>
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
                                        <button onClick={() => handleEditClick(post)} className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer">Configure Space →</button>
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