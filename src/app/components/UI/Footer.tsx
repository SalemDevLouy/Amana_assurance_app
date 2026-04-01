import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#d4d0c8', borderTop: '2px solid #808080' }}>
      {/* Windows taskbar style */}
      <div className="flex items-center gap-2 px-2 py-1" style={{ background: '#d4d0c8', borderTop: '2px solid #fff', borderBottom: '1px solid #808080' }}>
        {/* Start button */}
        <button
          className="win-btn font-bold flex items-center gap-1"
          style={{ padding: '4px 10px', fontSize: 11, background: '#d4d0c8' }}
        >
          <span style={{ fontSize: 14 }}>🪟</span>
          <span style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontWeight: 'bold' }}>Démarrer</span>
        </button>

        <div className="win-separator" style={{ width: 1, height: 22, margin: '0 4px', borderTop: 'none', borderLeft: '1px solid #808080', borderRight: '1px solid #fff' }} />

        {/* Quick launch icons */}
        {[
          { icon: '🛡️', label: 'Amana' },
          { icon: '📋', label: 'Dossier' },
          { icon: '⚙️', label: 'Paramètres' },
        ].map((item) => (
          <button key={item.label} className="win-btn p-1" title={item.label} aria-label={item.label} style={{ minWidth: 28, height: 28, padding: 2 }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
          </button>
        ))}

        <div className="flex-1" />

        {/* System tray area */}
        <div className="win-inset flex items-center gap-3 px-3 py-1">
          <span style={{ fontSize: 14 }}>🇩🇿</span>
          <span className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>DZ</span>
          <div className="win-separator" style={{ width: 1, height: 14, margin: '0 2px', borderTop: 'none', borderLeft: '1px solid #808080', borderRight: '1px solid #fff' }} />
          <span className="text-xs font-bold" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>
            {new Date().getHours().toString().padStart(2, '0')}:{new Date().getMinutes().toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Links row */}
      <div className="flex items-center justify-center gap-4 py-2 px-4" style={{ borderTop: '1px solid #fff' }}>
        <span className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#444' }}>© 2026 Amana. Tous droits réservés.</span>
        <div className="win-separator" style={{ width: 1, height: 12, margin: '0 4px', borderTop: 'none', borderLeft: '1px solid #808080', borderRight: '1px solid #fff' }} />
        <Link href="/privacy" className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#0000ff', textDecoration: 'underline' }}>Confidentialité</Link>
        <Link href="/terms" className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#0000ff', textDecoration: 'underline' }}>Conditions</Link>
        <Link href="/contact" className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#0000ff', textDecoration: 'underline' }}>Contact</Link>
      </div>
    </footer>
  );
}
