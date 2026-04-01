const steps = [
  {
    num: 1,
    title: 'Connexion',
    description: 'Connectez-vous à votre espace client sécurisé pour démarrer votre demande d\'assurance.',
    icon: '🔑',
  },
  {
    num: 2,
    title: 'Informations personnelles',
    description: 'Renseignez vos informations personnelles pour préparer une offre adaptée à votre profil.',
    icon: '📝',
  },
  {
    num: 3,
    title: 'Personnalisez votre assurance',
    description: 'Choisissez les garanties et options qui correspondent à vos besoins et à votre budget.',
    icon: '⚙️',
  },
  {
    num: 4,
    title: 'Validation & suivi digital',
    description: 'Suivez l\'état de votre dossier et finalisez votre assurance directement depuis votre espace client.',
    icon: '✅',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-8 px-4" style={{ background: '#d4d0c8' }}>
      <div className="max-w-4xl mx-auto">
        <div className="win-window">
          <div className="win-titlebar">
            <span>📋</span>
            <span>Processus — Comment ça marche ?</span>
            <div className="ml-auto flex items-center gap-1">
              <button className="win-btn" style={{ padding: '0 6px', minWidth: 18, height: 16, fontSize: 10 }} aria-label="Minimize">_</button>
              <button className="win-btn" style={{ padding: '0 6px', minWidth: 18, height: 16, fontSize: 10 }} aria-label="Maximize">□</button>
            </div>
          </div>

          <div className="p-4">
            {/* Wizard-style step panels */}
            <div className="win-inset p-4 mb-4">
              <p className="text-xs mb-4" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#444' }}>
                Quatre étapes simples pour obtenir votre assurance en ligne.
              </p>

              <div className="grid md:grid-cols-2 gap-3">
                {steps.map((step) => (
                  <div key={step.num} className="win-panel flex items-start gap-3 p-3">
                    {/* Step number badge */}
                    <div className="win-inset flex items-center justify-center flex-shrink-0" style={{ width: 32, height: 32 }}>
                      <span className="font-bold text-sm" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#000080' }}>{step.num}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span style={{ fontSize: 14 }}>{step.icon}</span>
                        <p className="text-xs font-bold" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>{step.title}</p>
                      </div>
                      <p className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#555', lineHeight: 1.5 }}>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wizard navigation buttons */}
            <div className="flex justify-between items-center pt-2" style={{ borderTop: '1px solid #808080' }}>
              <button className="win-btn text-xs" style={{ padding: '4px 16px' }}>◄ Précédent</button>
              <div className="flex gap-2">
                <button className="win-btn win-btn-primary text-xs" style={{ padding: '4px 20px' }}>Suivant ►</button>
                <button className="win-btn text-xs" style={{ padding: '4px 20px' }}>Annuler</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
