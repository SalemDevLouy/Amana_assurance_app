import React from 'react'
import { FaGlobeAfrica, FaLightbulb, FaRocket } from 'react-icons/fa';

export default function Features() {
  const features = [
    {
      title: 'Parcours guidé',
      description: 'De la connexion à la validation, chaque étape est claire pour compléter votre dossier sans complexité.',
      icon: <FaRocket />,
      color: 'from-blue-600 to-pink-500',
      bg: 'bg-blue-600/10',
      border: 'border-blue-600/20',
    },
    {
      title: 'Assurance personnalisable',
      description: 'Ajustez votre formule selon votre profil, vos besoins et votre budget, avec des options adaptées.',
      icon: <FaGlobeAfrica />,
      color: 'from-cyan-400 to-blue-500',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
    },
    {
      title: 'Gestion 100% numérique',
      description: 'Suivez vos demandes, mises à jour et validations directement en ligne, sans démarches papier.',
      icon: <FaLightbulb />,
      color: 'from-amber-400 to-orange-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/20',
    },
  ];

  return (
    <section className="relative py-28 overflow-hidden border-t border-white/5">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="flex justify-center mb-6" data-aos="fade-up">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-500 bg-blue-600/10 border border-blue-600/20 px-4 py-1.5 rounded-full">
            Fonctionnalités
          </span>
        </div>
        <h2
          className="text-4xl sm:text-5xl font-extrabold text-gray-700 text-center leading-tight mb-4"
          data-aos="fade-up"
          data-aos-delay="50"
        >
          Pourquoi choisir{' '}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Amana ?
          </span>
        </h2>
        <p
          className="text-base text-gray-500/45 text-center max-w-xl mx-auto mb-16"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Une expérience d&apos;assurance moderne, conçue pour être rapide et compréhensible.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`p-8 rounded-2xl border ${feature.border} ${feature.bg} hover:scale-105 transition-all duration-300`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} text-gray-100 text-xl mb-5 shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-500 mb-2">{feature.title}</h3>
              <p className="text-gray-500/50 leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}