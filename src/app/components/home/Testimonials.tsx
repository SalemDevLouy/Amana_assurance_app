import React from 'react'
import { FaStar } from 'react-icons/fa';

export default function Testimonials() {
  const testimonials = [
    {
      text: "J&apos;ai finalisé mon assurance en quelques minutes. Le parcours est clair et tout est suivi depuis mon espace client.",
      author: 'Samia',
      location: 'Constantine',
      initials: 'SA',
    },
    {
      text: "Les options de personnalisation sont simples à comprendre. J&apos;ai choisi exactement la couverture dont j&apos;avais besoin.",
      author: 'Amani',
      location: 'Batna',
      initials: 'AM',
    },
    {
      text: "Enfin une solution d&apos;assurance digitale qui évite les démarches compliquées. Tout se fait depuis mon espace client.",
      author: 'Maisoune',
      location: 'Tébessa',
      initials: 'MA',
    },
    {
      text: "Service rapide et professionnel. J&apos;ai pu compléter mes informations, personnaliser mon contrat et finaliser mon dossier entièrement en ligne.",
      author: 'Sofiane',
      location: 'Sétif',
      initials: 'SO',
    },
  ];

  return (
    <section className="py-28 overflow-hidden border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="flex justify-center mb-6" data-aos="fade-up">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-500 bg-blue-600/10 border border-blue-600/20 px-4 py-1.5 rounded-full">
            Témoignages
          </span>
        </div>
        <h2
          className="text-4xl sm:text-5xl font-extrabold text-gray-500 text-center leading-tight mb-4"
          data-aos="fade-up"
          data-aos-delay="50"
        >
          Ce que disent{' '}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            nos utilisateurs
          </span>
        </h2>
        <p
          className="text-base text-gray-500/45 text-center max-w-xl mx-auto mb-16"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Des clients qui ont souscrit leur assurance avec Amana en toute simplicité.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, index) => (
            <div
              key={`${t.author}-${t.location}`}
              className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-blue-600/40 hover:bg-white/10 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} className="text-amber-400 text-xs" />
                ))}
              </div>
              <p className="text-gray-500/65 leading-relaxed text-sm mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-gray-100 text-xs font-bold">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">{t.author}</p>
                  <p className="text-xs text-gray-500/35">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
