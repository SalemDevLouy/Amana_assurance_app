const testimonials = [
  {
    text: "J'ai finalisé mon assurance en quelques minutes. Le parcours est clair et tout est suivi depuis mon espace client.",
    author: 'Samia',
    location: 'Constantine',
    initials: 'SA',
  },
  {
    text: "Les options de personnalisation sont simples à comprendre. J'ai choisi exactement la couverture dont j'avais besoin.",
    author: 'Amani',
    location: 'Batna',
    initials: 'AM',
  },
  {
    text: "Enfin une solution d'assurance digitale qui évite les démarches compliquées. Tout se fait depuis mon espace client.",
    author: 'Maisoune',
    location: 'Tébessa',
    initials: 'MA',
  },
  {
    text: "Service rapide et professionnel. J'ai pu compléter mes informations, personnaliser mon contrat et finaliser mon dossier entièrement en ligne.",
    author: 'Sofiane',
    location: 'Sétif',
    initials: 'SO',
  },
];

export default function Testimonials() {
  return (
    <section className="py-8 px-4" style={{ background: '#d4d0c8' }}>
      <div className="max-w-4xl mx-auto">
        <div className="win-window">
          <div className="win-titlebar">
            <span>💬</span>
            <span>Témoignages — Ce que disent nos utilisateurs</span>
            <div className="ml-auto flex items-center gap-1">
              <button className="win-btn" style={{ padding: '0 6px', minWidth: 18, height: 16, fontSize: 10 }} aria-label="Minimize">_</button>
              <button className="win-btn" style={{ padding: '0 6px', minWidth: 18, height: 16, fontSize: 10 }} aria-label="Maximize">□</button>
            </div>
          </div>

          <div className="p-4">
            <p className="text-xs mb-4" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#444' }}>
              Des clients qui ont souscrit leur assurance avec Amana en toute simplicité.
            </p>

            {/* List-view style testimonials */}
            <div className="win-inset">
              {/* List header */}
              <div className="flex" style={{ background: '#d4d0c8', borderBottom: '1px solid #808080' }}>
                <div className="win-panel px-3 py-1 text-xs font-bold flex-1" style={{ fontFamily: 'Tahoma, Arial, sans-serif', borderTop: 'none', borderLeft: 'none' }}>Utilisateur</div>
                <div className="win-panel px-3 py-1 text-xs font-bold flex-1" style={{ fontFamily: 'Tahoma, Arial, sans-serif', borderTop: 'none', borderLeft: 'none' }}>Ville</div>
                <div className="win-panel px-3 py-1 text-xs font-bold" style={{ fontFamily: 'Tahoma, Arial, sans-serif', borderTop: 'none', borderLeft: 'none', width: 60 }}>Note</div>
              </div>

              {testimonials.map((t, index) => (
                <div key={`${t.author}-${t.location}`}>
                  {/* Row */}
                  <div
                    className="flex items-start gap-2 px-2 py-2"
                    style={{
                      background: index % 2 === 0 ? '#ffffff' : '#f0f0f0',
                      borderBottom: '1px solid #e0e0e0',
                    }}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {/* Avatar */}
                      <div className="win-inset flex items-center justify-center flex-shrink-0" style={{ width: 28, height: 28 }}>
                        <span className="text-xs font-bold" style={{ color: '#000080', fontFamily: 'Tahoma, Arial, sans-serif' }}>{t.initials}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>{t.author}</p>
                        <p className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#555' }}>&ldquo;{t.text}&rdquo;</p>
                      </div>
                    </div>
                    <div className="flex-1 px-2">
                      <span className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#444' }}>{t.location}</span>
                    </div>
                    <div style={{ width: 60 }}>
                      <span style={{ color: '#FFB800', fontSize: 11 }}>★★★★★</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-3 pt-2" style={{ borderTop: '1px solid #808080' }}>
              <button className="win-btn text-xs" style={{ padding: '4px 16px' }}>Fermer</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
