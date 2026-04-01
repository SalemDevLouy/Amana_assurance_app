"use client"
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-16 pb-8 px-4" style={{ background: '#008080' }}>
      {/* Big desktop window */}
      <div className="win-window w-full max-w-3xl">
        {/* Title bar */}
        <div className="win-titlebar">
          {/* Window icon */}
          <span style={{ fontSize: 12 }}>🛡️</span>
          <span>Amana Assurance — Bienvenue</span>
          <div className="ml-auto flex items-center gap-1">
            <button className="win-btn" style={{ padding: '0 6px', minWidth: 18, height: 16, fontSize: 10 }} aria-label="Minimize">_</button>
            <button className="win-btn" style={{ padding: '0 6px', minWidth: 18, height: 16, fontSize: 10 }} aria-label="Maximize">□</button>
            <button className="win-btn" style={{ padding: '0 6px', minWidth: 18, height: 16, fontSize: 10, fontWeight: 'bold' }} aria-label="Close">✕</button>
          </div>
        </div>

        {/* Menu bar */}
        <div className="flex items-center gap-0 px-1 py-0.5" style={{ background: '#d4d0c8', borderBottom: '1px solid #808080' }}>
          {['Fichier', 'Édition', 'Affichage', 'Aide'].map((m) => (
            <button key={m} className="px-3 py-0.5 text-xs hover:bg-[#0a246a] hover:text-white" style={{ fontFamily: 'Tahoma, Arial, sans-serif', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 11 }}>
              {m}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-2 py-1.5 win-panel" style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: '2px solid #808080' }}>
          <button className="win-btn text-xs" aria-label="Back">◄ Précédent</button>
          <button className="win-btn text-xs" aria-label="Forward">Suivant ►</button>
          <div className="win-separator" style={{ width: 1, height: 20, margin: '0 4px', borderTop: 'none', borderLeft: '1px solid #808080', borderRight: '1px solid #fff' }} />
          <div className="win-inset flex-1 flex items-center gap-1 px-2" style={{ height: 22 }}>
            <span className="text-xs" style={{ color: '#808080' }}>Adresse :</span>
            <span className="text-xs" style={{ color: '#0000ff', fontFamily: 'Tahoma, Arial, sans-serif' }}>https://amana.dz/</span>
          </div>
          <button className="win-btn text-xs" aria-label="Go">OK</button>
        </div>

        {/* Window body */}
        <div className="p-6">
          {/* Hero content inside inset panel */}
          <div className="win-inset p-6 text-center">
            {/* Big icon / logo area */}
            <div className="flex justify-center mb-4">
              <div className="win-panel p-3" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 48, lineHeight: 1 }}>🛡️</span>
                <span className="text-xs font-bold" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>Amana v1.0</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#000080', letterSpacing: 0 }}>
              Protégez l&apos;essentiel. Simplement.
            </h1>
            <p className="text-xs mb-1" style={{ color: '#444', fontFamily: 'Tahoma, Arial, sans-serif' }}>
              Agence d&apos;assurance digitale en Algérie
            </p>
            <div className="win-separator" style={{ margin: '12px auto', maxWidth: 300 }} />

            {/* Sub text */}
            <p className="text-xs mb-6 max-w-md mx-auto" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#222', lineHeight: 1.6 }}>
              Avec Amana, toute la gestion d&apos;assurance devient digitale :
              souscription, personnalisation, validation et suivi depuis un seul
              espace client.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <Link href="/signup" className="win-btn win-btn-primary text-xs font-bold" style={{ padding: '6px 20px' }}>
                <span>📁</span> Créer mon dossier
              </Link>
              <Link href="/login" className="win-btn text-xs" style={{ padding: '6px 20px' }}>
                <span>🔑</span> Se connecter
              </Link>
            </div>

            {/* Stats strip — Win2000 status bar style */}
            <div className="flex justify-center gap-1">
              {[
                { value: '500+', label: 'Clients assurés' },
                { value: '1K+', label: 'Devis traités' },
                { value: '100%', label: 'Parcours digital' },
              ].map((stat, i) => (
                <div key={stat.label} className="win-inset flex flex-col items-center px-6 py-2" style={{ minWidth: 90 }}>
                  <span className="font-bold text-sm" style={{ color: '#000080', fontFamily: 'Tahoma, Arial, sans-serif' }}>{stat.value}</span>
                  <span className="text-xs" style={{ color: '#444', fontFamily: 'Tahoma, Arial, sans-serif' }}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-1 px-2 py-1" style={{ borderTop: '1px solid #808080', background: '#d4d0c8' }}>
          <div className="win-inset flex-1 px-2 py-0.5">
            <span className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#000' }}>Prêt</span>
          </div>
          <div className="win-inset px-3 py-0.5">
            <span className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>Algérie 🇩🇿</span>
          </div>
        </div>
      </div>
    </div>
  );
}
