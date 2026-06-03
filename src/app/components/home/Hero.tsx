"use client"
import useAOS from '../../hooks/useAOS';
import Link from 'next/link';
import { FaArrowRight, FaShieldAlt, FaCar, FaBrain } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

export default function Hero() {
  useAOS();
  const { data: session, status } = useSession();
  const ctaHref =
    status === 'authenticated'
      ? session?.user?.role === 'ADMIN' ? '/dashboard' : '/main'
      : '/signup';
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-cyan-400/10 blur-[100px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-emerald-400/5 blur-[140px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-36 text-center">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-4 py-2 rounded-full mb-8 shadow-sm"
          data-aos="fade-down"
        >
          <FaBrain className="text-xs" />
          AI-Powered Auto Insurance · Algeria
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-800 leading-[1.08] mb-6"
          data-aos="fade-up"
        >
          Insurance that
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
            works as fast as you do.
          </span>
        </h1>

        {/* Sub-headline */}
        <p
          className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Amaneka replaces paperwork and bureaucracy with a fully digital insurance experience —
          from subscription to accident claim, expert review, and repair tracking.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <Link
            href={ctaHref}
            className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-2xl text-sm font-semibold shadow-xl shadow-blue-500/30 hover:shadow-blue-600/50 hover:scale-105 transition-all duration-300"
          >
            <FaShieldAlt className="text-xs" />
            {status === 'authenticated' ? 'Go to My Space' : 'Get a Free Quote'}
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            href="/#how-it-works"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 border border-gray-200 hover:border-blue-200 bg-white/70 hover:bg-blue-50/50 px-8 py-4 rounded-2xl text-sm font-medium transition-all duration-300 backdrop-blur-sm"
          >
            <FaCar className="text-xs" />
            See How It Works
          </Link>
        </div>

        {/* Feature pills */}
        <div
          className="flex flex-wrap justify-center gap-2.5 mb-16"
          data-aos="fade-up"
          data-aos-delay="280"
        >
          {[
            '✓ Digital Subscription',
            '✓ AI Risk Scoring',
            '✓ Instant Accident Declaration',
            '✓ Real-time Repair Tracking',
            '✓ Fraud Detection',
          ].map((pill) => (
            <span
              key={pill}
              className="text-xs font-medium text-gray-500 bg-white/80 border border-gray-100 px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-sm"
            >
              {pill}
            </span>
          ))}
        </div>

        {/* Stats strip */}
        <div
          className="mt-4 grid grid-cols-3 gap-8 max-w-md mx-auto border-t border-gray-100 pt-10"
          data-aos="fade-up"
          data-aos-delay="350"
        >
          {[
            { value: '500+', label: 'Insured Clients' },
            { value: '1K+', label: 'Claims Processed' },
            { value: '100%', label: 'Digital Journey' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
