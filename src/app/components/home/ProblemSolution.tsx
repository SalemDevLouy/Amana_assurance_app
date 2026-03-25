import React from 'react'
import { FaExclamationTriangle, FaLightbulb } from 'react-icons/fa';

export default function ProblemSolution() {
  return (
    <section className="relative py-28 overflow-hidden border-t border-white/5">
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="flex justify-center mb-6" data-aos="fade-up">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-500 bg-blue-600/10 border border-blue-600/20 px-4 py-1.5 rounded-full">
            Contexte
          </span>
        </div>
        <div className="text-center mb-16">
          <h2
            className="text-4xl sm:text-5xl font-extrabold text-gray-500 leading-tight"
            data-aos="fade-up"
            data-aos-delay="50"
          >
            Le Défi &amp;{' '}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Notre Solution
            </span>
          </h2>
          <p
            className="mt-5 text-base text-gray-500/50 max-w-xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Simplifier l&apos;accès à une assurance claire, personnalisée et rapide pour chaque client.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Problem card */}
          <div
            className="relative p-8 rounded-2xl border border-rose-500/20 bg-rose-500/5 hover:border-rose-500/40 transition-all duration-300"
            data-aos="fade-right"
          >
            <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-5">
              <FaExclamationTriangle />
              Le Problème
            </div>
            <h3 className="text-xl font-bold text-gray-500 mb-3">Parcours assurance complexe</h3>
            <p className="text-gray-500/55 leading-relaxed text-sm">
              Beaucoup de clients perdent du temps entre formulaires, offres peu claires et démarches papier pour obtenir une couverture adaptée.
            </p>
          </div>

          {/* Solution card */}
          <div
            className="relative p-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 hover:border-cyan-500/40 transition-all duration-300"
            data-aos="fade-left"
          >
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-5">
              <FaLightbulb />
              Notre Solution
            </div>
            <h3 className="text-xl font-bold text-gray-500 mb-3">Guidé, personnalisé, digital</h3>
            <p className="text-gray-500/55 leading-relaxed text-sm">
              Amana centralise tout dans un parcours simple : connexion,
              informations personnelles, personnalisation de la couverture,
              validation et suivi digital du dossier.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}