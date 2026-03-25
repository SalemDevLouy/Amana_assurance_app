import React from 'react'

export default function HowItWorks() {
  const steps = [
    {
      title: 'Connexion',
      description: 'Connectez-vous à votre espace client sécurisé pour démarrer votre demande d’assurance.',
    },
    {
      title: 'Informations personnelles',
      description: 'Renseignez vos informations personnelles pour préparer une offre adaptée à votre profil.',
    },
    {
      title: 'Personnalisez votre assurance',
      description: 'Choisissez les garanties et options qui correspondent à vos besoins et à votre budget.',
    },
    {
      title: 'Validation & suivi digital',
      description: 'Suivez l’état de votre dossier et finalisez votre assurance directement depuis votre espace client.',
    },
  ];

  return (
    <section id="how-it-works" className="py-28 overflow-hidden border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="flex justify-center mb-6" data-aos="fade-up">
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full">
            Processus
          </span>
        </div>
        <h2
          className="text-4xl sm:text-5xl font-extrabold text-gray-500 text-center leading-tight mb-4"
          data-aos="fade-up"
          data-aos-delay="50"
        >
          Comment ça{' '}
          <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            marche ?
          </span>
        </h2>
        <p
          className="text-base text-gray-500/45 text-center max-w-xl mx-auto mb-16"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Quatre étapes simples pour obtenir votre assurance en ligne.
        </p>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[calc(50%+28px)] w-[calc(100%-56px)] h-px bg-gradient-to-r from-blue-600/40 to-cyan-500/40" />
              )}
              {/* Step number bubble */}
              <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-gray-100 font-bold text-lg shadow-lg shadow-blue-600/25 mb-5">
                {index + 1}
              </div>
              <h3 className="text-base font-bold text-gray-700 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
