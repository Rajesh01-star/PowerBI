import { ProductsLayout } from '@/components/ProductsLayout';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { getSystemSettingsAction } from '@/app/admin/actions';
import { notFound } from 'next/navigation';

export default async function ProductsUiUx() {
  const settings = await getSystemSettingsAction();
  if (settings.hide_uiux) {
    notFound();
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-transparent text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
          <p className="text-xs text-muted-foreground font-mono">LOADING GALLERY Gallery...</p>
        </div>
      </div>
    }>
      <ProductsLayout 
        title={<>Production-Grade UI/UX <br className="hidden sm:inline" /><span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">Interactive Dashboard Gallery</span></>}
        description="Explore high-fidelity, interactive UI/UX templates optimized for executive operations, financial forecasting, dynamic sales performance, and HR metrics. Instantly launch layouts, explore live embeds, and download configuration files to elevate your BI strategy."
        statsLabel="UI/UX Templates"
        assetType="uiux"
      />
    </Suspense>
  );
}
