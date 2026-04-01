'use client'
import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa';

export default function FAQ() {
  const faqs = [
    {
      q: 'Mes données sont-elles sécurisées ?',
      a: 'Oui, toutes vos données sont protégées et confidentielles. Nous utilisons le chiffrement en transit et au repos.',
    },
    {
      q: 'Puis-je modifier mes informations après enregistrement ?',
      a: 'Oui. Vous pouvez mettre à jour vos informations personnelles et ajuster votre demande depuis votre espace client.',
    },
    {
      q: 'Puis-je personnaliser ma couverture ?',
      a: 'Oui, vous pouvez sélectionner les garanties qui correspondent à votre situation et à votre budget.',
    },
    {
      q: 'Comment suivre l’état de mon dossier ?',
      a: 'Vous pouvez suivre toutes les étapes depuis votre espace client : soumission, vérification, validation et mises à jour.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-28 overflow-hidden border-t border-white/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="flex justify-center mb-6" data-aos="fade-up">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-500 bg-blue-600/10 border border-blue-600/20 px-4 py-1.5 rounded-full">
            FAQ
          </span>
        </div>
        <h2
          className="text-4xl sm:text-5xl font-extrabold text-gray-700 text-center leading-tight mb-4"
          data-aos="fade-up"
          data-aos-delay="50"
        >
          Questions{' '}
          <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            fréquentes
          </span>
        </h2>
        <p
          className="text-base text-gray-500 text-center max-w-xl mx-auto mb-14"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Tout ce que vous devez savoir avant de commencer.
        </p>

        <div className="space-y-3">
          {faqs.map((item, index) => (
            <div
              key={item.q}
              className="rounded-2xl border-2 border-cyan-600 overflow-hidden transition-all duration-300 hover:border-blue-600/30 bg-white/5"
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              <button
                className="w-full px-6 py-5 flex justify-between items-center text-left gap-4"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-base font-semibold text-gray-700">{item.q}</span>
                <FaChevronDown
                  className={`text-gray-500 shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
