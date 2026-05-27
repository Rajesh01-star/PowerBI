"use client";
import React from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
  AnimatePresence,
} from "framer-motion";

export interface Product {
  title: string;
  link: string;
  thumbnail: string;
}

export const HeroParallax = ({
  products,
}: {
  products: Product[];
}) => {
  const [activeProduct, setActiveProduct] = React.useState<Product | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveProduct(null);
      }
    };
    if (activeProduct) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [activeProduct]);

  return (
    <div
      ref={ref}
      className="h-[300vh] py-20 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
              onClick={() => setActiveProduct(product)}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
              onClick={() => setActiveProduct(product)}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
              onClick={() => setActiveProduct(product)}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Modal Popup via Portal to prevent 3D perspective distortion */}
      {mounted && createPortal(
        <AnimatePresence>
          {activeProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
              onClick={() => setActiveProduct(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                className="relative max-w-4xl w-full bg-zinc-955 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-4 md:p-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveProduct(null)}
                  className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/70 border border-white/15 text-white/80 hover:text-white hover:bg-black hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* High-res Image Wrapper */}
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-900/40 flex items-center justify-center border border-white/5">
                  <img
                    src={activeProduct.thumbnail}
                    alt={activeProduct.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Title & Actions */}
                <div className="mt-4 md:mt-6 px-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-amber-500 uppercase tracking-widest font-mono font-semibold">Verified Professional Credential</span>
                    <h3 className="text-base md:text-lg font-bold text-white mt-1 leading-snug">
                      {activeProduct.title}
                    </h3>
                  </div>
                  
                  <a
                    href={activeProduct.thumbnail}
                    target="_blank"
                    rel="noreferrer"
                    className="self-start md:self-center inline-flex items-center gap-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-4 py-2.5 text-xs font-semibold text-amber-500 transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    <span>Open Full Resource</span>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <h1 className="text-4xl md:text-5xl font-bold dark:text-white">
        Verified Professional <br /> Credentials
      </h1>
      <p className="max-w-2xl text-base mt-4 dark:text-neutral-200 text-muted-foreground">
        A comprehensive showcase of professional certifications across Data Analytics, 
        Project Management, Product Leadership, and Business Frameworks.
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
  onClick,
}: {
  product: Product;
  translate: MotionValue<number>;
  onClick: () => void;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      onClick={onClick}
      key={product.title}
      className="group/product h-80 w-[24rem] md:h-96 md:w-[30rem] relative shrink-0 rounded-2xl overflow-hidden border border-border/40 shadow-md bg-zinc-900 cursor-pointer"
    >
      <div className="block h-full w-full">
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-contain object-center absolute h-full w-full inset-0 transition-transform duration-500 group-hover/product:scale-105"
          alt={product.title}
        />
      </div>
      <div className="absolute inset-0 h-full w-full opacity-30 group-hover/product:opacity-80 bg-black transition-opacity duration-300 pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 right-4 opacity-0 group-hover/product:opacity-100 text-white font-semibold text-sm md:text-base bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 transition-all duration-300 transform translate-y-2 group-hover/product:translate-y-0 text-xs!">
        {product.title}
      </h2>
    </motion.div>
  );
};
