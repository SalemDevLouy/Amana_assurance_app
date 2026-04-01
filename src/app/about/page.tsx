'use client';
import { FaLightbulb, FaRocket, FaUsers, FaGlobeAfrica, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import Footer from '../components/UI/Footer';

export default function AboutPage() {


  const values = [
    {
      icon: <FaLightbulb />,
      title: 'Notre Mission',
      description:
        "Chez Amana, nous simplifions l'accès à l'assurance pour chaque client. Notre mission est de rendre la souscription claire, rapide et compréhensible, du premier clic jusqu'au document final.",
      color: 'from-amber-400 to-orange-400',
      bg: 'bg-amber-400/50',
      border: 'border-amber-400/20',
    },
    {
      icon: <FaRocket />,
      title: 'Notre Vision',
      description:
        "Nous voulons faire d'Amana la référence de l'assurance digitale en Algérie, avec une expérience moderne où chaque client peut personnaliser sa couverture en toute confiance.",
      color: 'from-blue-600 to-pink-500',
      bg: 'bg-blue-600/50',
      border: 'border-blue-600/20',
    },
    {
      icon: <FaGlobeAfrica />,
      title: 'Ancré en Algérie',
      description:
        "Amana est conçu pour le marché algérien. Nos parcours, garanties et services tiennent compte des besoins réels des clients et du contexte local.",
      color: 'from-cyan-400 to-blue-500',
      bg: 'bg-cyan-500/50',
      border: 'border-cyan-500/20',
    },
  ];

  const stats = [
     { value: '500+', label: 'Clients assurés' },
      { value: '1K+', label: 'Devis traités' },
    { value: '100%', label: 'Parcours digital' },
  ];

  return (
    <div className="min-h-screen bg-[#ededed] font-sans overflow-x-hidden" dir="ltr">

      {/* ── Hero ── */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24 pb-20">
        {/* Blobs */}
        <div className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-blue-700/20 blur-[140px]" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/30 border border-white/50 text-blue-600 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8">
            <FaUsers className="text-[10px]" />
            Notre histoire
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-700 leading-tight mb-6">
            À propos de{' '}
            <span className="bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Amana
            </span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Une agence d&apos;assurance digitale née en Algérie, conçue pour
            transformer les opérations d&apos;assurance en parcours simples,
            rapides et entièrement numériques.
          </p>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-t border-white/5 border-b py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                {s.value}
              </p>
              <p className="text-xs text-gray-500/85 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission / Vision / Values ── */}
      <section className="py-28 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-500 bg-blue-600/10 border border-blue-600/20 px-4 py-1.5 rounded-full">
              Nos valeurs
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-500 text-center leading-tight mb-4">
            Ce qui nous{' '}
            <span className="bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              définit
            </span>
          </h2>
          <p className="text-base text-gray-500 text-center max-w-xl mx-auto mb-16">
            Nos engagements envers chaque client qui souhaite une assurance simple et fiable.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className={`p-8 rounded-2xl border ${v.border} ${v.bg} hover:scale-105 transition-all duration-300`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br ${v.color} text-gray-100 text-xl mb-5 shadow-lg`}>
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">{v.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── CTA ── */}
      <section className="relative py-28 overflow-hidden text-center border-t border-white/5">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-blue-700/15 blur-[120px] rounded-full" />
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-700 leading-tight mb-6">
            Prêt à lancer{' '}
            <span className="bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              votre assurance ?
            </span>
          </h2>
          <p className="text-base text-gray-500 mb-10 max-w-lg mx-auto">
            Rejoignez des centaines de clients qui font confiance à Amana pour
            souscrire, personnaliser et suivre leur assurance sans complexité.
          </p>
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-cyan-500 text-gray-100 px-8 py-3.5 rounded-full text-base font-semibold shadow-xl shadow-blue-600/25 hover:shadow-blue-600/50 hover:scale-105 transition-all duration-300"
          >
            Créer mon compte
            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
