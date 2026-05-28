
export default function BackgroundEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base gradient canvas */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#eef2ff] via-[#f4f6fb] to-[#f0fdf9]" />

      {/* Top-center spotlight */}
      <div className="absolute -top-56 left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full bg-blue-400/15 blur-[130px]" />

      {/* Bottom-left ambient */}
      <div className="absolute -bottom-56 -left-48 w-[650px] h-[650px] rounded-full bg-blue-600/10 blur-[150px]" />

      {/* Top-right ambient */}
      <div className="absolute -top-40 -right-40 w-[580px] h-[580px] rounded-full bg-cyan-500/10 blur-[140px]" />

      {/* Mid-page emerald accent */}
      <div className="absolute top-2/3 -right-20 w-[380px] h-[380px] rounded-full bg-emerald-400/8 blur-[110px]" />

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(37,99,235,0.13) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Edge vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_60%,rgba(240,244,255,0.6)_100%)]" />
    </div>
  );
}
