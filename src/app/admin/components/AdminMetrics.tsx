import { FileText, DollarSign } from "lucide-react";

export function AdminMetrics({ posts }: { posts: any[] }) {
    const totalTemplates = posts.length;
    const totalRevenue = posts.reduce((sum, post) => sum + (parseFloat(post.price) || 0), 0);

    return (
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
    );
}
