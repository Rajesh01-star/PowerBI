import { ProductsLayout } from '@/components/ProductsLayout';

export default function ProductsPowerBi() {
  return (
    <ProductsLayout 
      title={<>Production-Grade Power BI <br className="hidden sm:inline" /><span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">Interactive Dashboard Gallery</span></>}
      description="Explore high-fidelity, interactive Power BI templates optimized for executive operations, financial forecasting, dynamic sales performance, and HR metrics. Instantly launch layouts, explore live embeds, and download configuration files to elevate your BI strategy."
      statsLabel="Power BI Templates"
      assetType="powerbi"
    />
  );
}
