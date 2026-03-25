import React from 'react'
import { FaCheckCircle, FaStar } from 'react-icons/fa';

const plans = [
  {
    name: 'BMC Simple',
    price: '2 000',
    period: 'DA',
    description: 'Pour structurer votre première idée de manière claire et rapide.',
    features: [
      'Guidage de base avec questions simples',
      'Modèle générique adapté à tout projet',
      'Export PDF standard',
      'Accessible sans accompagnement',
      'Idéal pour réflexion personnelle ou académique',
    ],
    cta: 'Commencer',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'BMC Avancé',
    price: '5 000',
    period: 'DA',
    description: 'Pour présenter votre projet à des partenaires, incubateurs ou investisseurs.',
    features: [
      'Accompagnement intelligent par secteur',
      'Modèle pré-rempli adapté à votre domaine',
      'Exemples concrets du contexte algérien',
      "Export professionnel prêt à l'usage externe",
      "Suivi personnalisé et retours d'experts",
      "Recommandé pour porteurs d'idées ambitieux",
    ],
    cta: 'Passer au Premium',
    href: '/signup',
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <section className="py-28 overflow-hidden border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="flex justify-center mb-6" data-aos="fade-up">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-500 bg-blue-600/10 border border-blue-600/20 px-4 py-1.5 rounded-full">
            Tarifs
          </span>
        </div>
        <h2
          className="text-4xl sm:text-5xl font-extrabold text-gray-500 text-center leading-tight mb-4"
          data-aos="fade-up"
          data-aos-delay="50"
        >
          Des offres pour{' '}
          <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            chaque étape
          </span>
        </h2>
        <p
          className="text-base text-gray-500/45 text-center max-w-xl mx-auto mb-16"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Choisissez l&apos;offre adaptée à votre niveau et à vos ambitions.
        </p>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-300 ${
                plan.highlighted
                  ? 'border-blue-600/50 bg-gradient-to-b from-blue-600/10 to-transparent shadow-xl shadow-blue-600/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-gray-500 text-xs font-semibold px-4 py-1 rounded-full shadow-lg">
                    <FaStar className="text-[10px]" /> Populaire
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-extrabold text-gray-500">{plan.price}</span>
                  <span className="text-gray-500/40 text-sm mb-1">{plan.period}</span>
                </div>
                <p className="text-lg font-semibold text-gray-500">{plan.name}</p>
                <p className="text-sm text-gray-500/45 mt-1">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-500/60">
                    <FaCheckCircle className="text-cyan-400 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={plan.href}
                className={`block w-full text-center py-3.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-gray-500 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/50 hover:scale-105'
                    : 'border border-white/20 text-gray-500 hover:bg-white/5'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
