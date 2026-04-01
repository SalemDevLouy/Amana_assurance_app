const features = [
  {
    title: 'Parcours guidé',
    description: 'De la connexion à la validation, chaque étape est claire pour compléter votre dossier sans complexité.',
    icon: '🚀',
    key: 'guided',
  },
  {
    title: 'Assurance personnalisable',
    description: 'Ajustez votre formule selon votre profil, vos besoins et votre budget, avec des options adaptées.',
    icon: '🌍',
    key: 'custom',
  },
  {
    title: 'Gestion 100% numérique',
    description: 'Suivez vos demandes, mises à jour et validations directement en ligne, sans démarches papier.',
    icon: '💡',
    key: 'digital',
  },
];

export default function Features() {
  return (
    <section className="py-8 px-4" style={{ background: '#d4d0c8' }}>
      <div className="max-w-4xl mx-auto">
        <div className="win-window">
          <div className="win-titlebar">
            <span>📦</span>
            <span>Fonctionnalités — Pourquoi choisir Amana ?</span>
            <div className="ml-auto flex items-center gap-1">
              <button className="win-btn" style={{ padding: '0 6px', minWidth: 18, height: 16, fontSize: 10 }} aria-label="Minimize">_</button>
              <button className="win-btn" style={{ padding: '0 6px', minWidth: 18, height: 16, fontSize: 10 }} aria-label="Maximize">□</button>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex items-end gap-0 px-2 pt-2" style={{ borderBottom: '2px solid #808080' }}>
            <div className="win-panel px-4 py-1" style={{ borderBottom: '2px solid #d4d0c8', marginBottom: -2, zIndex: 1, position: 'relative' }}>
              <span className="text-xs font-bold" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>Général</span>
            </div>
            <div className="px-4 py-1" style={{ background: '#bfbfbf', cursor: 'pointer' }}>
              <span className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#444' }}>Avancé</span>
            </div>
          </div>

          <div className="p-4">
            <p className="text-xs mb-4" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#444' }}>
              Une expérience d&apos;assurance moderne, conçue pour être rapide et compréhensible.
            </p>

            {/* Feature icons grid — Win2000 Large Icons style */}
            <div className="grid md:grid-cols-3 gap-4">
              {features.map((feature) => (
                <div key={feature.key} className="win-window flex flex-col items-center p-4 text-center">
                  <div className="win-inset p-3 mb-3" style={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 28 }}>{feature.icon}</span>
                  </div>
                  <p className="text-xs font-bold mb-2" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>{feature.title}</p>
                  <p className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#555', lineHeight: 1.6 }}>{feature.description}</p>
                </div>
              ))}
            </div>

            {/* OK / Cancel row */}
            <div className="flex justify-end gap-2 mt-4 pt-3" style={{ borderTop: '1px solid #808080' }}>
              <button className="win-btn win-btn-primary text-xs" style={{ padding: '4px 20px' }}>OK</button>
              <button className="win-btn text-xs" style={{ padding: '4px 20px' }}>Annuler</button>
              <button className="win-btn text-xs" style={{ padding: '4px 20px' }}>Appliquer</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
