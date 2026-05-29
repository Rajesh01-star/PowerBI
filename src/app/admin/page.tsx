"use client";

import { useState } from "react";
import { Shield, Plus, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPostsAction, getSystemSettingsAction, updateSystemSettingAction } from "./actions";
import { AdminMetrics } from "./components/AdminMetrics";
import { AssetGrid } from "./components/AssetGrid";
import { AssetFormModal } from "./components/AssetFormModal";
import { toast } from "sonner";

export default function AdminPage() {
    const { data: sessionData, isPending } = authClient.useSession();
    const [editingPost, setEditingPost] = useState<any | null>(null);
    const [showForm, setShowForm] = useState(false);

    // react-query for posts
    const { data: posts = [], isLoading: isFetchingPosts } = useQuery({
        queryKey: ['adminPosts'],
        queryFn: () => getPostsAction(),
        enabled: !!sessionData?.user?.isAdmin,
    });

    // react-query for system settings
    const queryClient = useQueryClient();
    const { data: settings } = useQuery({
        queryKey: ['systemSettings'],
        queryFn: () => getSystemSettingsAction(),
        enabled: !!sessionData?.user?.isAdmin,
    });
    const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

    async function handleTogglePowerbi() {
        if (isUpdatingSettings) return;
        setIsUpdatingSettings(true);
        try {
            const newValue = settings?.hide_powerbi ? "false" : "true";
            await updateSystemSettingAction("hide_powerbi", newValue);
            await queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
            toast.success(newValue === "true" ? "Data Analytics section hidden from public view" : "Data Analytics section is now visible to public");
        } catch (err: any) {
            toast.error("Failed to update setting: " + err.message);
        } finally {
            setIsUpdatingSettings(false);
        }
    }

    async function handleToggleUiux() {
        if (isUpdatingSettings) return;
        setIsUpdatingSettings(true);
        try {
            const newValue = settings?.hide_uiux ? "false" : "true";
            await updateSystemSettingAction("hide_uiux", newValue);
            await queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
            toast.success(newValue === "true" ? "Graphic Design section hidden from public view" : "Graphic Design section is now visible to public");
        } catch (err: any) {
            toast.error("Failed to update setting: " + err.message);
        } finally {
            setIsUpdatingSettings(false);
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

    function openCreateForm() {
        setEditingPost(null);
        setShowForm(true);
    }

    function handleEditClick(post: any) {
        setEditingPost(post);
        setShowForm(true);
    }

    return (
        <div className="min-h-screen bg-transparent text-foreground overflow-x-hidden relative select-none">
            <div className="max-w-7xl mx-auto px-6 pt-28 pb-8 space-y-8 relative z-10">
                {/* Metrics */}
                <AdminMetrics posts={posts} />

                {/* Global Business Line Visibility Settings */}
                <div className="p-5 rounded-2xl border border-amber-500/10 bg-neutral-900/40 backdrop-blur-xl shadow-md space-y-4">
                    <div className="flex items-center gap-2.5 border-b border-border/40 pb-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500">
                            <Shield className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Business Line Visibility Controls</h3>
                            <p className="text-[11px] text-muted-foreground font-mono">Toggles public visibility of entire business lines and pages</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Data Analytics Toggle */}
                        <div className="flex items-center justify-between bg-card/60 p-4 rounded-xl border border-border shadow-sm backdrop-blur-md">
                            <div className="space-y-0.5">
                                <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">Data Analytics (Power BI)</p>
                                <p className="text-sm font-bold tracking-tight text-foreground/90">
                                    {settings?.hide_powerbi ? "Draft / Hidden from public" : "Live / Visible to public"}
                                </p>
                            </div>
                            <button
                                onClick={handleTogglePowerbi}
                                disabled={isUpdatingSettings}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    settings?.hide_powerbi ? 'bg-[#251A17]' : 'bg-amber-500'
                                } ${isUpdatingSettings ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#18110E] shadow ring-0 transition duration-200 ease-in-out ${
                                        settings?.hide_powerbi ? 'translate-x-0' : 'translate-x-5'
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Graphic Design Toggle */}
                        <div className="flex items-center justify-between bg-card/60 p-4 rounded-xl border border-border shadow-sm backdrop-blur-md">
                            <div className="space-y-0.5">
                                <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">Graphic Design (UX/UI)</p>
                                <p className="text-sm font-bold tracking-tight text-foreground/90">
                                    {settings?.hide_uiux ? "Draft / Hidden from public" : "Live / Visible to public"}
                                </p>
                            </div>
                            <button
                                onClick={handleToggleUiux}
                                disabled={isUpdatingSettings}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    settings?.hide_uiux ? 'bg-[#251A17]' : 'bg-amber-500'
                                } ${isUpdatingSettings ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#18110E] shadow ring-0 transition duration-200 ease-in-out ${
                                        settings?.hide_uiux ? 'translate-x-0' : 'translate-x-5'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sub-header Controls */}
                <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="space-y-0.5">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-foreground/80">Active Asset Portfolio</h2>
                        <p className="text-[11px] text-muted-foreground">{posts.length} functional items deployed</p>
                    </div>
                    {!showForm && (
                        <button onClick={openCreateForm} className="h-8 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-[11px] font-medium flex items-center gap-1.5 transition-all text-black animate-fade-in cursor-pointer">
                            <Plus className="w-3.5 h-3.5" /> Create New Asset
                        </button>
                    )}
                </div>

                {/* Grid or Loader */}
                {isFetchingPosts ? (
                    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin text-amber-500 mb-2" />
                        <p className="text-xs">Loading assets...</p>
                    </div>
                ) : (
                    <AssetGrid posts={posts} onEdit={handleEditClick} onCreate={openCreateForm} />
                )}
            </div>

            {/* Main Configuration Modal Workspace Overlay 
                Placed OUTSIDE of the z-10 relative container to ensure it renders above nav/footer
            */}
            <AssetFormModal 
                isOpen={showForm}
                editingPost={editingPost}
                onClose={() => {
                    setShowForm(false);
                    setEditingPost(null);
                }}
            />
        </div>
    );
}