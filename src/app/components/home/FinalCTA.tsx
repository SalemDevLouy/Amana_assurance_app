import Link from 'next/link';
import React from 'react'
import { FaArrowRight, FaRocket } from 'react-icons/fa';

export default function FinalCTA() {
  return (
    <section className="relative py-32 overflow-hidden text-center border-t border-white/5">
      {/* Ambient blobs */}
      {/* <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-blue-700 blur-[140px]" /> */}

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-8"
          data-aos="fade-down"
        >
          <FaRocket className="text-xs" />
          Rejoignez des centaines de clients assurés
        </div>

        <h2
          className="text-4xl sm:text-6xl font-extrabold text-gray-700 leading-tight mb-6"
          data-aos="fade-up"
        >
          Lancez votre assurance{' '}
          <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            dès aujourd&apos;hui
          </span>
        </h2>

        <p
          className="text-lg text-gray-500/50 max-w-xl mx-auto mb-10"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Connectez-vous, complétez vos informations, personnalisez votre
          couverture et gérez tout votre parcours d’assurance en ligne.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-gray-500 px-8 py-3.5 rounded-full text-base font-semibold shadow-xl shadow-blue-600/25 hover:shadow-blue-600/50 hover:scale-105 transition-all duration-300"
          >
            Créer mon compte
            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-gray-500/60 hover:text-gray-500 border border-white/15 hover:border-white/30 px-8 py-3.5 rounded-full text-base font-medium transition-all duration-300"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </section>
  );
}