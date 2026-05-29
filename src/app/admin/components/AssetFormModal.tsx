"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Edit3, Plus, X, Laptop, ImageIcon, CheckCircle2, Loader2, Link as LinkIcon, Trash2 } from "lucide-react";
import { createPostAction, updatePostAction, getUploadUrlAction } from "../actions";
import { Input } from "@/components/ui/input";
import { getMediaUrl } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminTagSelector } from "./AdminTagSelector";
import { Editor } from "@/components/tiptap/Editor";
import { ContentRenderer } from "@/components/tiptap/ContentRenderer";

const getCleanFilename = (path: string) => {
    const base = path.split("/").pop() || "Uploaded Archive";
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i.test(base)) {
        return base.substring(37);
    }
    return base;
};

export function AssetFormModal({
    editingPost,
    isOpen,
    onClose,
}: {
    editingPost: any | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Form states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [assetType, setAssetType] = useState<"powerbi" | "uiux">("powerbi");
    const [sourceLink, setSourceLink] = useState("");
    const [aspect, setAspect] = useState<"horizontal" | "vertical">("horizontal");
    const [url, setUrl] = useState("");
    const [thumbnails, setThumbnails] = useState<string[]>([]);
    const [activeThumbnailIndex, setActiveThumbnailIndex] = useState<number>(0);
    const [zipFileKey, setZipFileKey] = useState<string | null>(null);
    const [zipFileName, setZipFileName] = useState<string | null>(null);
    const [zipFileSize, setZipFileSize] = useState<number | null>(null);
    const [uploadingZipProgress, setUploadingZipProgress] = useState<number | null>(null);
    const [uploadingImageProgress, setUploadingImageProgress] = useState<number | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [tempPostId, setTempPostId] = useState("");
    
    // Reference links state
    const [references, setReferences] = useState<{ label: string; url: string }[]>([]);
    const [refLabelInput, setRefLabelInput] = useState("");
    const [refUrlInput, setRefUrlInput] = useState("");

    // Initialize states when modal opens or editingPost changes
    useEffect(() => {
        if (isOpen) {
            setTempPostId(editingPost?.id || crypto.randomUUID());
            if (editingPost) {
                setTitle(editingPost.title || "");
                setDescription(editingPost.description || "");
                setPrice(editingPost.price ? editingPost.price.toString() : "");
                setAssetType(editingPost.assetType || "powerbi");
                setSourceLink(editingPost.sourceLink || "");
                setAspect(editingPost.aspect || "horizontal");
                setUrl(editingPost.url || "");
                setThumbnails(editingPost.thumbnails?.length ? editingPost.thumbnails : (editingPost.imageUrl ? [editingPost.imageUrl] : []));
                setActiveThumbnailIndex(editingPost.activeThumbnailIndex || 0);
                setTags(editingPost.tags || []);
                setReferences(editingPost.references || []);
                setZipFileKey(editingPost.fileUrl || null);
                setZipFileName(editingPost.fileUrl ? getCleanFilename(editingPost.fileUrl) : null);
                setZipFileSize(null);
                setUploadingZipProgress(null);
                setUploadingImageProgress(null);
            } else {
                setTitle("");
                setDescription("");
                setPrice("");
                setAssetType("powerbi");
                setSourceLink("");
                setAspect("horizontal");
                setUrl("");
                setThumbnails([]);
                setActiveThumbnailIndex(0);
                setTags([]);
                setReferences([]);
                setZipFileKey(null);
                setZipFileName(null);
                setZipFileSize(null);
                setUploadingZipProgress(null);
                setUploadingImageProgress(null);
            }
            setRefLabelInput("");
            setRefUrlInput("");
        }
    }, [isOpen, editingPost]);

    // Escape key press handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (isLoading) {
                    toast.info("Please wait while the asset is being processed.");
                } else {
                    onClose();
                }
            }
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose, isLoading]);

    async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file && thumbnails.length < 4) {
            setIsLoading(true);
            setUploadingImageProgress(0);
            try {
                // Get the presigned upload URL and R2 key from server action (isPublic = true, postId = tempPostId)
                const uploadData = await getUploadUrlAction(file.name, file.type || "image/png", true, tempPostId);
                
                // Upload directly to Cloudflare R2 public bucket using XHR to track progress
                const xhr = new XMLHttpRequest();
                xhr.open("PUT", uploadData.uploadUrl, true);
                xhr.setRequestHeader("Content-Type", file.type || "image/png");
                
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = Math.round((event.loaded / event.total) * 100);
                        setUploadingImageProgress(percentComplete);
                    }
                };
                
                xhr.onload = () => {
                    if (xhr.status === 200) {
                        setThumbnails(prev => [...prev, uploadData.fileKey]);
                        setUploadingImageProgress(null);
                        toast.success("Image uploaded successfully!");
                    } else {
                        setUploadingImageProgress(null);
                        toast.error("Failed to upload image.");
                    }
                };
                
                xhr.onerror = () => {
                    setUploadingImageProgress(null);
                    toast.error("An error occurred during image upload.");
                };
                
                xhr.send(file);
            } catch (err: any) {
                setUploadingImageProgress(null);
                toast.error(err.message || "Failed to start image upload.");
            } finally {
                setIsLoading(false);
            }
        }
    }

    async function handleZipChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setUploadingZipProgress(0);
        setZipFileName(file.name);
        setZipFileSize(file.size);

        try {
            // Get the presigned upload URL and R2 key from server action (isPublic = false, postId = tempPostId)
            const uploadData = await getUploadUrlAction(file.name, file.type || "application/zip", false, tempPostId);

            // Upload directly to Cloudflare R2 private bucket using XHR to track progress
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", uploadData.uploadUrl, true);
            xhr.setRequestHeader("Content-Type", file.type || "application/zip");

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    setUploadingZipProgress(percentComplete);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    setZipFileKey(uploadData.fileKey);
                    setUploadingZipProgress(null);
                    toast.success("ZIP archive uploaded successfully!");
                } else {
                    setUploadingZipProgress(null);
                    setZipFileName(null);
                    setZipFileSize(null);
                    toast.error("Failed to upload ZIP archive.");
                }
            };

            xhr.onerror = () => {
                setUploadingZipProgress(null);
                setZipFileName(null);
                setZipFileSize(null);
                toast.error("An error occurred during ZIP upload.");
            };

            xhr.send(file);
        } catch (err: any) {
            setUploadingZipProgress(null);
            setZipFileName(null);
            setZipFileSize(null);
            toast.error(err.message || "Failed to start ZIP upload.");
        } finally {
            setIsLoading(false);
        }
    }

    function removeZipFile() {
        setZipFileKey(null);
        setZipFileName(null);
        setZipFileSize(null);
        setUploadingZipProgress(null);
    }

    function removeThumbnail(index: number) {
        setThumbnails(prev => prev.filter((_, i) => i !== index));
        if (activeThumbnailIndex === index) {
            setActiveThumbnailIndex(0);
        } else if (activeThumbnailIndex > index) {
            setActiveThumbnailIndex(activeThumbnailIndex - 1);
        }
    }

    function handleAddReference() {
        const label = refLabelInput.trim();
        const urlStr = refUrlInput.trim();
        if (label && urlStr) {
            try {
                new URL(urlStr);
                setReferences([...references, { label, url: urlStr }]);
                setRefLabelInput("");
                setRefUrlInput("");
            } catch (e) {
                toast.error("Please enter a valid URL including protocol (e.g. https://)");
            }
        } else {
            toast.warning("Both label and URL are required to add a reference.");
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("assetType", assetType);
        formData.append("sourceLink", sourceLink);
        formData.append("aspect", aspect);
        formData.append("url", url);
        formData.append("activeThumbnailIndex", activeThumbnailIndex.toString());
        formData.append("thumbnails", JSON.stringify(thumbnails));
        formData.append("tags", JSON.stringify(tags));
        formData.append("references", JSON.stringify(references));
        
        if (zipFileKey) {
            formData.append("fileUrl", zipFileKey);
        }
        
        if (editingPost) formData.append("id", editingPost.id);

        try {
            if (editingPost) {
                await updatePostAction(formData);
                toast.success('Configuration updated successfully!');
            } else {
                await createPostAction(formData);
                toast.success('Configuration published successfully!');
            }
            
            // Invalidate the react-query cache for posts
            queryClient.invalidateQueries({ queryKey: ['adminPosts'] });
            
            timeoutRef.current = setTimeout(() => { onClose(); }, 1200);
        } catch (error: any) {
            toast.error(error.message || 'Failed to process request');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-5">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98, y: 10 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.98, y: 10 }} 
                        transition={{ type: "spring", duration: 0.4 }}
                        className="bg-gradient-to-b from-[#18110E] to-[#0E0A09] border border-[#3E291F]/60 rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 lg:p-6 relative shadow-[0_0_50px_-12px_rgba(245,158,11,0.12)]"
                    >
                        <button 
                            onClick={() => {
                                if (isLoading) {
                                    toast.info("Please wait while the asset is being processed.");
                                } else {
                                    onClose();
                                }
                            }} 
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
                                        {editingPost ? 'Edit Configuration' : 'Global Asset Setup'}
                                    </h3>
                                    <p className="text-[12px] text-muted-foreground">Customize your Power BI interactive dashboard blueprint</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                                <div className="space-y-1">
                                    <Select value={assetType} onValueChange={(val) => { console.log('AssetType changed to:', val); setAssetType(val as "powerbi" | "uiux"); }}>
                                        <SelectTrigger className="w-full bg-[#130B09] border border-[#3E291F] rounded-xl text-xs h-9 px-3 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all outline-none cursor-pointer">
                                            <SelectValue placeholder="Asset Type *" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#18110E] border border-[#3E291F] text-white text-xs shadow-xl rounded-xl ring-1 ring-black/40 z-[200]">
                                            <SelectItem value="powerbi" className="hover:bg-amber-500/10 focus:bg-amber-500/10 text-white text-xs py-2 rounded-lg cursor-pointer">Power BI Dashboard</SelectItem>
                                            <SelectItem value="uiux" className="hover:bg-amber-500/10 focus:bg-amber-500/10 text-white text-xs py-2 rounded-lg cursor-pointer">UX/UI & Graphic Design</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

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

                                <div className="space-y-1 border border-[#3E291F] rounded-xl overflow-hidden focus-within:border-amber-500/50 focus-within:ring-2 focus-within:ring-amber-500/10 transition-all bg-[#161616]">
                                    <div className="px-3 py-2 text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider bg-[#0E0907] border-b border-[#3E291F]">Description Editor</div>
                                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                        <Editor content={description} onChange={setDescription} />
                                    </div>
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
                                                <img src={getMediaUrl(thumb)} alt="thumb" className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300" />
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
                                        {uploadingImageProgress !== null && (
                                            <div className="relative rounded-xl overflow-hidden aspect-video border border-[#3E291F] bg-[#130B09]/40 flex flex-col items-center justify-center animate-pulse">
                                                <Loader2 className="w-4 h-4 animate-spin text-amber-500 mb-1" />
                                                <span className="text-[9px] font-mono text-amber-400 font-bold">{uploadingImageProgress}%</span>
                                            </div>
                                        )}
                                        {thumbnails.length < 4 && uploadingImageProgress === null && (
                                            <div className="relative rounded-xl border border-dashed border-[#3E291F] hover:border-amber-500/50 bg-[#130B09]/40 hover:bg-[#130B09]/80 flex flex-col items-center justify-center aspect-video cursor-pointer transition-all duration-200 group">
                                                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                                                <Plus className="w-5 h-5 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                                                <span className="text-[9px] font-medium text-muted-foreground group-hover:text-amber-400 mt-1 transition-colors">Add Image</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* ZIP UPLOAD */}
                                <div className="space-y-2">
                                    <div className="relative border border-dashed border-[#3E291F] hover:border-amber-500/50 bg-[#0E0907] hover:bg-[#130B09]/60 rounded-xl transition-all duration-200 cursor-pointer group">
                                        <input
                                            type="file"
                                            disabled={uploadingZipProgress !== null}
                                            accept={assetType === 'powerbi' ? ".zip,application/zip,.pbix" : ".zip,application/zip,.fig,.psd,.ai,.xd"}
                                            onChange={handleZipChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                                        />
                                        <div className="flex items-center gap-3 px-3 py-2 pointer-events-none">
                                            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 group-hover:border-amber-500/35 flex items-center justify-center shrink-0 transition-all duration-200">
                                                {uploadingZipProgress !== null ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                                                ) : (
                                                    <Upload className="w-3.5 h-3.5 text-amber-500/70 group-hover:text-amber-400 transition-colors" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-semibold text-white/70 group-hover:text-white transition-colors leading-none">
                                                    {zipFileKey ? "Replace ZIP Archive" : editingPost ? "Replace file (.zip, .pbix, etc)" : "Upload file (.zip, .pbix, etc)"}
                                                </p>
                                                <p className="text-[9px] text-white/30 mt-0.5">
                                                    {uploadingZipProgress !== null ? `Uploading: ${uploadingZipProgress}%` : "Drag & drop, or click Browse"}
                                                </p>
                                            </div>
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 group-hover:bg-amber-500/20 group-hover:border-amber-500/40 text-[9px] font-semibold text-amber-400 group-hover:text-amber-300 transition-all duration-200 shrink-0">
                                                Browse
                                            </span>
                                        </div>
                                    </div>

                                    {/* Upload Progress Bar */}
                                    {uploadingZipProgress !== null && (
                                        <div className="flex flex-col gap-1.5 bg-[#130B09]/40 border border-[#3E291F] rounded-xl px-3 py-2.5">
                                            <div className="flex items-center justify-between text-[10px]">
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                                                    <span className="text-white/70 font-semibold truncate max-w-[200px]">{zipFileName}</span>
                                                </div>
                                                <span className="text-amber-400 font-bold font-mono">{uploadingZipProgress}%</span>
                                            </div>
                                            <div className="w-full bg-[#1F1613] h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-amber-500 h-full transition-all duration-150" style={{ width: `${uploadingZipProgress}%` }} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Uploaded File indicator card */}
                                    {zipFileKey && uploadingZipProgress === null && (
                                        <div className="flex items-center gap-2.5 bg-[#0D1F15] border border-emerald-500/25 rounded-xl px-3 py-2">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-semibold text-emerald-300 truncate">{zipFileName}</p>
                                                <p className="text-[9px] text-emerald-500/50">{zipFileSize ? `${(zipFileSize / 1024).toFixed(0)} KB · ` : ""}ZIP Archive ready</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={removeZipFile}
                                                className="w-5 h-5 rounded-md bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors cursor-pointer shrink-0"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* TAGS */}
                                <AdminTagSelector tags={tags} setTags={setTags} />

                                {/* Row with Value, Aspect Ratio, and Power BI Link */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
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
                                    <div className="md:col-span-5">
                                        <Input 
                                            type="url" 
                                            value={url} 
                                            onChange={(e) => setUrl(e.target.value)} 
                                            placeholder={assetType === 'powerbi' ? "Power BI Live Link (https://...)" : "Live Preview Link (Figma prototype / web)"} 
                                            className="w-full h-9 px-3 bg-[#130B09] border border-[#3E291F] rounded-xl text-xs text-white placeholder:text-white/40 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 focus-visible:ring-amber-500/10 focus-visible:border-amber-500/50 transition-all outline-none duration-150" 
                                        />
                                    </div>
                                </div>

                                {assetType === 'uiux' && (
                                    <div className="space-y-1">
                                        <Input 
                                            type="url" 
                                            value={sourceLink} 
                                            onChange={(e) => setSourceLink(e.target.value)} 
                                            placeholder="Figma Edit Link (Optional source link for buyers)" 
                                            className="w-full h-9 px-3 bg-[#130B09] border border-[#3E291F] rounded-xl text-xs text-white placeholder:text-white/40 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 focus-visible:ring-amber-500/10 focus-visible:border-amber-500/50 transition-all outline-none duration-150" 
                                        />
                                    </div>
                                )}

                                {/* REFERENCES & SUPPLEMENTAL RESOURCES SECTION */}
                                <div className="space-y-2 border-t border-[#3E291F]/40 pt-3.5">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
                                            <LinkIcon className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                                            Reference & Educational Links
                                        </div>
                                        <span className="text-[9px] font-mono text-[#A08B7E]">({references.length} added)</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                                        <div className="md:col-span-4">
                                            <Input 
                                                type="text" 
                                                value={refLabelInput}
                                                onChange={(e) => setRefLabelInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddReference();
                                                    }
                                                }}
                                                placeholder="Label (e.g. Gartner Retail Report)" 
                                                className="w-full h-8 px-2.5 bg-[#130B09] border border-[#3E291F] rounded-xl text-[11px] text-white placeholder:text-white/40 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/10 focus-visible:ring-amber-500/10 focus-visible:border-amber-500/50 outline-none transition-all duration-150" 
                                            />
                                        </div>
                                        <div className="md:col-span-6">
                                            <Input 
                                                type="url" 
                                                value={refUrlInput}
                                                onChange={(e) => setRefUrlInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddReference();
                                                    }
                                                }}
                                                placeholder="URL (https://example.com/industry-report)" 
                                                className="w-full h-8 px-2.5 bg-[#130B09] border border-[#3E291F] rounded-xl text-[11px] text-white placeholder:text-white/40 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/10 focus-visible:ring-amber-500/10 focus-visible:border-amber-500/50 outline-none transition-all duration-150" 
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <button 
                                                type="button" 
                                                onClick={handleAddReference}
                                                className="w-full h-8 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 hover:border-amber-500/40 text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer shadow-sm hover:shadow-[0_2px_8px_rgba(245,158,11,0.1)]"
                                            >
                                                <Plus className="w-3.5 h-3.5" /> Add Link
                                            </button>
                                        </div>
                                    </div>

                                    {/* List of references */}
                                    {references.length > 0 && (
                                        <div className="space-y-1.5 max-h-[130px] overflow-y-auto bg-[#130B09]/30 border border-[#3E291F]/40 p-2 rounded-2xl custom-scrollbar">
                                            {references.map((ref, idx) => (
                                                <div key={idx} className="flex items-center justify-between gap-3 bg-[#18110E] border border-[#3E291F]/30 px-3 py-1.5 rounded-xl group/ref text-[11px] hover:border-amber-500/20 transition-all duration-200">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
                                                        <p className="font-semibold text-white/90 truncate max-w-[160px]">{ref.label}</p>
                                                        <span className="text-white/30 text-[9px] font-mono truncate max-w-[240px]">{ref.url}</span>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setReferences(references.filter((_, i) => i !== idx))} 
                                                        className="w-5 h-5 rounded-lg bg-red-500/5 hover:bg-red-500/20 border border-red-500/15 hover:border-red-500/30 flex items-center justify-center text-red-400 hover:text-white transition-all cursor-pointer shrink-0"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-3 border-t border-[#3E291F]/40">
                                    <button 
                                        type="button" 
                                        onClick={onClose} 
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
                                                {editingPost ? "Update Blueprint" : "Publish Blueprint"}
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
                                <div className="flex items-center gap-2 text-[12px] text-amber-500/80 uppercase font-bold tracking-widest">
                                    <Laptop className="w-4 h-4" /> {assetType === 'powerbi' ? 'Real-time Asset Canvas' : 'UX/UI Design Canvas'}
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full bg-[#18100E] border border-[#3E291F] text-[11px] font-mono text-muted-foreground uppercase tracking-wider shadow-sm">
                                    Preview
                                </span>
                            </div>
                            
                            <div className="flex-1 flex items-center justify-center p-4 z-10">
                                <div className="w-full max-w-[270px] rounded-xl border border-[#3E291F] bg-[#110A08]/90 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-md hover:border-amber-500/30 transition-all duration-300 group">
                                    <div className={`w-full ${aspect === 'vertical' ? 'aspect-[3/4]' : 'aspect-video'} bg-[#1A1210] relative flex items-center justify-center border-b border-[#3E291F] overflow-hidden`}>
                                        {thumbnails.length > 0 ? (
                                            <img 
                                                src={thumbnails[activeThumbnailIndex] || thumbnails[0]} 
                                                alt="Snapshot Preview" 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-1.5 text-muted-foreground/35 font-mono text-[11px] select-none">
                                                <ImageIcon className="w-6 h-6 text-[#3E291F]" />
                                                <span>NO SNAPSHOT RENDERED</span>
                                            </div>
                                        )}
                                        {url && (
                                            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-[10px] font-bold text-blue-300 uppercase tracking-wide shadow-sm backdrop-blur-sm">
                                                Live Link
                                            </span>
                                        )}
                                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#0F0A09]/80 border border-[#3E291F] text-[10px] uppercase tracking-wider text-amber-400 font-bold font-mono shadow-sm">
                                            {aspect}
                                        </span>
                                    </div>
                                    <div className="p-4 space-y-2">
                                        <div className="flex items-start justify-between gap-3">
                                            <h2 className="font-bold text-sm text-foreground/90 truncate flex-1 group-hover:text-amber-400 transition-colors">
                                                {title || (assetType === 'powerbi' ? "Untitled Blueprint" : "Untitled Design")}
                                            </h2>
                                            <span className="text-sm font-mono text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg shadow-sm">
                                                {price ? `$${parseFloat(price).toFixed(2)}` : "Free"}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[36px]">
                                            {description ? (
                                                <ContentRenderer content={description} className="[&>p]:m-0 [&>p]:inline text-[10px]" />
                                            ) : (
                                                `No supplemental details provided for this ${assetType === 'powerbi' ? 'blueprint' : 'design'} asset. Add description on the form.`
                                            )}
                                        </div>
                                        
                                        {tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 pt-2 border-t border-[#3E291F]/30">
                                                {tags.slice(0, 3).map((tag, i) => (
                                                    <span key={i} className="text-[10px] font-semibold text-[#A08B7E] bg-[#1D1412] px-1.5 py-0.5 rounded border border-[#3E291F]/30">
                                                        #{tag}
                                                    </span>
                                                ))}
                                                {tags.length > 3 && (
                                                    <span className="text-[10px] text-muted-foreground/50 font-mono">
                                                        +{tags.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-center text-[10px] text-muted-foreground/40 font-mono tracking-wider pt-3 border-t border-[#3E291F]/30 z-10">
                                BLUEPRINT RENDER ENGINE v1.2
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
