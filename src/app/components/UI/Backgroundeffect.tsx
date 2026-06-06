export default function BackgroundEffect() {
  return (
    // overflow-hidden clips layout; clipPath:"inset(0)" clips paint including blur halos
    // even inside GPU-composited layers (fixes iOS Safari blur leak).
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ clipPath: "inset(0)" }}
      aria-hidden="true"
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#eef2ff] via-[#f4f6fb] to-[#f0fdf9]" />

      {/* Orbs use % widths + max-w so they stay within the fixed viewport container */}

      {/* Top-center spotlight */}
      <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-3/4 max-w-[700px] aspect-square rounded-full bg-blue-400/15 blur-[130px]" />

      {/* Bottom-left ambient */}
      <div className="absolute -bottom-1/4 -left-1/4 w-1/2 max-w-[500px] aspect-square rounded-full bg-blue-600/10 blur-[150px]" />

      {/* Top-right ambient */}
      <div className="absolute -top-1/4 -right-1/4 w-1/2 max-w-[480px] aspect-square rounded-full bg-cyan-500/10 blur-[140px]" />

      {/* Mid-page emerald accent */}
      <div className="absolute top-2/3 right-0 w-1/3 max-w-[320px] aspect-square rounded-full bg-emerald-400/8 blur-[110px]" />

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
