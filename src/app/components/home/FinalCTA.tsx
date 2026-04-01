import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="py-8 px-4" style={{ background: '#d4d0c8' }}>
      <div className="max-w-2xl mx-auto">
        {/* Modal-style dialog */}
        <div className="win-window">
          <div className="win-titlebar">
            <span>🛡️</span>
            <span>Amana — Démarrer</span>
            <div className="ml-auto flex items-center gap-1">
              <button className="win-btn" style={{ padding: '0 6px', minWidth: 18, height: 16, fontSize: 10 }} aria-label="Close">✕</button>
            </div>
          </div>

          <div className="p-6">
            {/* Icon + message row — classic Windows dialog layout */}
            <div className="flex items-start gap-4 mb-6">
              <span style={{ fontSize: 48 }}>🚀</span>
              <div>
                <p className="font-bold mb-2" style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontSize: 13, color: '#000080' }}>
                  Lancez votre assurance dès aujourd&apos;hui
                </p>
                <div className="win-separator" />
                <p className="text-xs mt-2" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#333', lineHeight: 1.6 }}>
                  Rejoignez des centaines de clients assurés. Connectez-vous, complétez vos informations, personnalisez votre couverture et gérez tout votre parcours d&apos;assurance en ligne.
                </p>
                <p className="text-xs mt-2" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#333' }}>
                  Voulez-vous créer votre compte ou vous connecter ?
                </p>
              </div>
            </div>

            {/* Progress bar decorative */}
            <div className="win-inset mb-6 h-5 overflow-hidden">
              <div style={{ height: '100%', width: '72%', background: 'linear-gradient(to right, #000080, #1084d0)', display: 'flex', alignItems: 'center', paddingLeft: 4 }}>
                <span style={{ color: '#fff', fontSize: 10, fontFamily: 'Tahoma, Arial, sans-serif' }}>72% des utilisateurs recommandent Amana</span>
              </div>
            </div>

            {/* Dialog buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/signup" className="win-btn win-btn-primary text-xs font-bold" style={{ padding: '8px 24px', fontSize: 12 }}>
                <span>📁</span> Créer mon compte
              </Link>
              <Link href="/login" className="win-btn text-xs" style={{ padding: '8px 24px', fontSize: 12 }}>
                <span>🔑</span> Se connecter
              </Link>
              <button className="win-btn text-xs" style={{ padding: '8px 24px', fontSize: 12 }}>
                Annuler
              </button>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center gap-1 px-2 py-1" style={{ borderTop: '1px solid #808080', background: '#d4d0c8' }}>
            <div className="win-inset flex-1 px-2 py-0.5">
              <span className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>500+ clients assurés • 100% parcours digital</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
