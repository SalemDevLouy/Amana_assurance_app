
export default function BackgroundEffect() {
  return (
    <div className='pointer-events-none fixed inset-0 top-0 right-0 z-0 min-h-screen overflow-hidden'>
        {/* Ambient blobs */}
      <div className="pointer-events-none absolute -bottom-64 -left-48 w-[700px] h-[700px] rounded-full bg-blue-700/35 blur-[140px]" />
      <div className="pointer-events-none absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full bg-cyan-600/35 blur-[140px]" />
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}
