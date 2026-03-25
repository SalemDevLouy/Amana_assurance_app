"use client"
import useAOS from '../../hooks/useAOS';
import Link from 'next/link';
import { FaArrowRight, FaRocket } from 'react-icons/fa';

export default function Hero() {
  useAOS();
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Ambient blobs */}
      {/* <div className="pointer-events-none absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full bg-blue-700/40 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-48 -right-48 w-[700px] h-[700px] rounded-full bg-cyan-600/35 blur-[140px]" /> */}
      {/* Subtle grid overlay */}
      {/* <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      /> */}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-600 text-sm font-medium px-4 py-1.5 rounded-full mb-10 backdrop-blur-sm"
          data-aos="fade-down"
        >
          <FaRocket className="text-xs" />
          Agence d&apos;assurance digitale en Algérie
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-700 leading-[1.1] mb-6"
          data-aos="fade-up"
        >
          Protégez{' '}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
            l&apos;essentiel.
          </span>{' '}
          Simplement.
        </h1>

        {/* Sub-headline */}
        <p
          className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Avec Amana, toute la gestion d&apos;assurance devient digitale :
          souscription, personnalisation, validation et suivi depuis un seul
          espace client.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-gray-100 px-8 py-3.5 rounded-full text-base font-semibold shadow-xl shadow-blue-500/25 hover:shadow-blue-600/50 hover:scale-105 transition-all duration-300"
          >
            Créer mon dossier
            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          {/* <Link
            href="#how-it-works"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-500 border border-white/15 hover:border-white/30 px-8 py-3.5 rounded-full text-base font-medium transition-all duration-300"
          >
            Voir comment ça marche
          </Link> */}
        </div>

        {/* Stats strip */}
        <div
          className="mt-24 grid grid-cols-3 gap-8 max-w-md mx-auto border-t border-white/10 pt-10"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {[
            { value: '500+', label: 'Clients assurés' },
            { value: '1K+', label: 'Devis traités' },
            { value: '100%', label: 'Parcours digital' }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500/85 mt-1 uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}