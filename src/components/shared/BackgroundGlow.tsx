/** Decorative background glow blobs used across page layouts */
export function BackgroundGlow() {
  return (
    <>
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-amber-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] bg-amber-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] bg-amber-600/5 blur-[110px] rounded-full pointer-events-none" />
    </>
  );
}
