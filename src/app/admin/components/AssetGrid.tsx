import { FileText, Edit3 } from "lucide-react";
import { ContentRenderer } from "@/components/tiptap/ContentRenderer";
import { getMediaUrl } from "@/lib/utils";

export function AssetGrid({ posts, onEdit, onCreate }: { posts: any[], onEdit: (post: any) => void, onCreate: () => void }) {
    if (posts.length === 0) {
        return (
            <div className="border border-border bg-card p-10 rounded-xl text-center max-w-md mx-auto shadow-sm">
                <FileText className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
                <button onClick={onCreate} className="bg-muted text-[11px] h-8 px-3 rounded-md hover:bg-muted/80">Add Asset</button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[280px] gap-4">
            {posts.map((post) => (
                <div key={post.id} className={`group bg-card rounded-xl border border-border hover:border-border/80 transition-all overflow-hidden flex flex-col relative shadow-sm hover:shadow-md ${post.aspect === 'vertical' ? 'row-span-2' : 'row-span-1'}`}>
                    <div className={`w-full ${post.aspect === 'vertical' ? 'flex-1' : 'aspect-video'} bg-muted/40 relative flex items-center justify-center border-b border-border overflow-hidden`}>
                        {post.thumbnails?.length > 0 ? (
                            <img src={getMediaUrl(post.thumbnails[post.activeThumbnailIndex] || post.thumbnails[0])} alt={post.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                        ) : post.imageUrl ? (
                            <img src={getMediaUrl(post.imageUrl)} alt={post.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                        ) : (
                            <FileText className="w-5 h-5 text-muted-foreground/20" />
                        )}

                        <div className="absolute top-2 left-2 z-10">
                            <span className="px-1 py-0.5 rounded bg-muted border border-border text-[9px] font-mono text-muted-foreground uppercase tracking-wider">{post.aspect}</span>
                        </div>
                        
                        <div onClick={() => onEdit(post)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer z-20">
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
                            {post.description && (
                                <div className="text-[11px] text-muted-foreground line-clamp-1 leading-normal overflow-hidden">
                                    <ContentRenderer content={post.description} className="[&>p]:m-0 [&>p]:inline [&_*]:!text-[11px] [&_*]:!text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div className="pt-2 border-t border-border flex items-center justify-end">
                            <button onClick={() => onEdit(post)} className="text-[11px] font-medium text-amber-500 hover:text-amber-400 hover:underline flex items-center gap-0.5 cursor-pointer">Configure Space →</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
