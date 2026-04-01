export default function ProblemSolution() {
  return (
    <section className="py-8 px-4" style={{ background: '#d4d0c8' }}>
      <div className="max-w-4xl mx-auto">
        {/* Window */}
        <div className="win-window">
          <div className="win-titlebar">
            <span>⚠️</span>
            <span>Contexte — Le Défi &amp; Notre Solution</span>
            <div className="ml-auto flex items-center gap-1">
              <button className="win-btn" style={{ padding: '0 6px', minWidth: 18, height: 16, fontSize: 10 }} aria-label="Minimize">_</button>
              <button className="win-btn" style={{ padding: '0 6px', minWidth: 18, height: 16, fontSize: 10 }} aria-label="Maximize">□</button>
            </div>
          </div>

          <div className="p-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Problem */}
              <div className="win-window">
                <div className="win-titlebar" style={{ background: 'linear-gradient(to right, #8b0000, #c08080)' }}>
                  <span>⚠️</span>
                  <span>Le Problème</span>
                </div>
                <div className="p-4">
                  <div className="win-inset p-3 mb-3">
                    <p className="text-xs font-bold mb-2" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#8b0000' }}>
                      Parcours assurance complexe
                    </p>
                    <p className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif', lineHeight: 1.6 }}>
                      Beaucoup de clients perdent du temps entre formulaires, offres peu claires et démarches papier pour obtenir une couverture adaptée.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span style={{ fontSize: 20 }}>📋</span>
                    <span className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#666' }}>Démarches lentes et manuelles</span>
                  </div>
                  <div className="win-separator" />
                  <div className="flex items-start gap-2 mt-2">
                    <span style={{ fontSize: 20 }}>❌</span>
                    <span className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#666' }}>Offres peu lisibles et confuses</span>
                  </div>
                </div>
              </div>

              {/* Solution */}
              <div className="win-window">
                <div className="win-titlebar" style={{ background: 'linear-gradient(to right, #005000, #50a050)' }}>
                  <span>💡</span>
                  <span>Notre Solution</span>
                </div>
                <div className="p-4">
                  <div className="win-inset p-3 mb-3">
                    <p className="text-xs font-bold mb-2" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#005000' }}>
                      Guidé, personnalisé, digital
                    </p>
                    <p className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif', lineHeight: 1.6 }}>
                      Amana centralise tout dans un parcours simple : connexion, informations personnelles, personnalisation de la couverture, validation et suivi digital du dossier.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span style={{ fontSize: 20 }}>✅</span>
                    <span className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#666' }}>Tout depuis un seul espace client</span>
                  </div>
                  <div className="win-separator" />
                  <div className="flex items-start gap-2 mt-2">
                    <span style={{ fontSize: 20 }}>🖥️</span>
                    <span className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#666' }}>100% numérique, sans papier</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
